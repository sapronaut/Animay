/**
 * animay - auth.js
 * Handles user authentication (sign in / sign up / guest) and header rendering.
 * Must be loaded FIRST so other scripts can call renderHeader().
 */

const DB_KEY = "animay_db";

// Load persisted user database (username → { password })
let db = (() => {
    try {
        return JSON.parse(localStorage.getItem(DB_KEY)) || { users: {} };
    } catch (e) {
        return { users: {} };
    }
})();

// Restore session if user was previously signed in
let currentUser = localStorage.getItem("animay_current_user") || null;

let authMode = "signin";

// ── Persistence ──────────────────────────────────────────────────────────────

function saveDB() {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
}

// ── Tab switcher ─────────────────────────────────────────────────────────────

function switchTab(mode) {
    authMode = mode;

    document.getElementById("tab-signin").classList.toggle("active", mode === "signin");
    document.getElementById("tab-signup").classList.toggle("active", mode === "signup");
    document.getElementById("auth-submit").textContent =
        mode === "signin" ? "Sign In ✦" : "Create Account ✦";

    // Clear any previous error
    document.getElementById("auth-error").textContent = "";
}

// ── Auth handler ─────────────────────────────────────────────────────────────

function handleAuth() {
    const user = document.getElementById("auth-user").value.trim();
    const pass = document.getElementById("auth-pass").value;
    const err  = document.getElementById("auth-error");

    err.textContent = "";

    if (!user || !pass) {
        err.textContent = "Please fill in all fields.";
        return;
    }

    if (authMode === "signup") {
        if (db.users[user]) {
            err.textContent = "Username already taken.";
            return;
        }
        db.users[user] = { password: pass };
        saveDB();
        _signIn(user);

    } else {
        if (!db.users[user] || db.users[user].password !== pass) {
            err.textContent = "Invalid username or password.";
            return;
        }
        _signIn(user);
    }
}

// ── Internal sign-in helper ───────────────────────────────────────────────────

function _signIn(user) {
    currentUser = user;
    localStorage.setItem("animay_current_user", user);

    document.getElementById("auth-overlay").classList.add("hidden");
    document.getElementById("auth-user").value = "";
    document.getElementById("auth-pass").value = "";
    document.getElementById("auth-error").textContent = "";

    renderHeader();

    // Build trending now that we're signed in
    if (typeof buildTrending === "function") buildTrending();
}

// ── Guest mode ────────────────────────────────────────────────────────────────

function guestMode() {
    currentUser = null;
    document.getElementById("auth-overlay").classList.add("hidden");
    renderHeader();
    if (typeof buildTrending === "function") buildTrending();
}

// ── Sign out ──────────────────────────────────────────────────────────────────

function signOut() {
    currentUser = null;
    localStorage.removeItem("animay_current_user");
    renderHeader();

    // Clear main content and show auth again
    const main = document.getElementById("main");
    if (main) main.innerHTML = "";

    document.getElementById("auth-overlay").classList.remove("hidden");
    switchTab("signin");
}

// ── Header renderer ───────────────────────────────────────────────────────────

function renderHeader() {
    const hr = document.getElementById("header-right");
    if (!hr) return;

    if (currentUser) {
        hr.innerHTML = `
            <span style="margin-right:10px; font-size:14px; color:var(--ink3)">
                hi, <strong>${currentUser}</strong>
            </span>
            <button onclick="signOut()">sign out</button>
        `;
    } else {
        hr.innerHTML = `
            <button onclick="document.getElementById('auth-overlay').classList.remove('hidden')">
                sign in
            </button>
        `;
    }
}

// Expose to global scope for inline onclick handlers and other scripts
window.switchTab  = switchTab;
window.handleAuth = handleAuth;
window.guestMode  = guestMode;
window.signOut    = signOut;
window.renderHeader = renderHeader;
window.getCurrentUser = () => currentUser;
