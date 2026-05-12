/**
 * animay - app.js
 * Wires up all UI events and initializes the app.
 * Loaded LAST so auth.js, ui.js, and search.js are already defined.
 */

// ── Search events ─────────────────────────────────────────────────────────────

document.getElementById("search-btn").addEventListener("click", doSearch);

document.getElementById("q").addEventListener("keydown", e => {
    if (e.key === "Enter") doSearch();
});

// ── Navigation events ─────────────────────────────────────────────────────────

document.getElementById("logo-home").addEventListener("click", () => {
    document.getElementById("q").value = "";
    buildTrending();
});

document.getElementById("nav-home").addEventListener("click", () => {
    document.getElementById("q").value = "";
    buildTrending();
});

document.getElementById("nav-top").addEventListener("click", () => {
    document.getElementById("q").value = "top anime";
    doSearch();
});

document.getElementById("nav-movies").addEventListener("click", () => {
    document.getElementById("q").value = "anime movie";
    doSearch();
});

// ── Filter pill events ────────────────────────────────────────────────────────

document.querySelectorAll(".pill").forEach(p => {
    p.addEventListener("click", () => {
        // Toggle active state
        document.querySelectorAll(".pill").forEach(x => x.classList.remove("on"));
        p.classList.add("on");

        // Update the active filter in search.js
        setFilter(p.dataset.filter);

        // Re-run search if there's a query; otherwise rebuild trending
        const q = document.getElementById("q").value.trim();
        if (q) {
            doSearch();
        } else {
            buildTrending();
        }
    });
});

// ── Score & episode badge styles (injected once) ──────────────────────────────

(function injectBadgeStyles() {
    const style = document.createElement("style");
    style.textContent = `
        .score-badge, .ep-badge {
            font-size: 12px;
            font-weight: 700;
            padding: 3px 10px;
            border-radius: 999px;
            white-space: nowrap;
        }
        .score-badge {
            background: #fff3e0;
            color: #e65100;
        }
        .ep-badge {
            background: #f3e5f5;
            color: #6a1b9a;
        }
    `;
    document.head.appendChild(style);
})();

// ── Initialization ────────────────────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", () => {
    // Render header (auth.js)
    renderHeader();

    // If user already has a session, skip the auth overlay and show trending
    if (getCurrentUser()) {
        document.getElementById("auth-overlay").classList.add("hidden");
        buildTrending();
    }
    // Otherwise auth overlay stays visible (default in HTML)
});
