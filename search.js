/**
 * animay - search.js
 * Handles Jikan API fetching, trending display, and genre filtering.
 */

const TRENDING = [
    "Naruto",
    "Bleach",
    "One Piece",
    "Attack on Titan",
    "Death Note"
];

// Jikan v4 genre IDs
const GENRE_IDS = {
    action:  1,
    romance: 22,
    isekai:  62
};

let currentFilter = "all";

// ── Trending ──────────────────────────────────────────────────────────────────


    const TRENDING_DATA = [
    { title: "Naruto",          genre: "Shonen",        eps: "720 eps",   heat: 97, emoji: "🍥", accent: "#ff3870", bg: "#fff0f4" },
    { title: "Bleach",          genre: "Action",        eps: "366 eps",   heat: 91, emoji: "⚔️",  accent: "#7c3aed", bg: "#f3eeff" },
    { title: "One Piece",       genre: "Adventure",     eps: "1100+ eps", heat: 99, emoji: "🏴‍☠️", accent: "#f59e0b", bg: "#fffbeb" },
    { title: "Attack on Titan", genre: "Dark Fantasy",  eps: "87 eps",    heat: 95, emoji: "⚡",  accent: "#06b6d4", bg: "#ecfeff" },
    { title: "Death Note",      genre: "Psychological", eps: "37 eps",    heat: 93, emoji: "📓", accent: "#10b981", bg: "#ecfdf5" },
];

function buildTrending() {
    const main = document.getElementById("main");

    const cardsHtml = TRENDING_DATA.map((a, i) => `
        <div class="tr-card"
             style="--card-accent:${a.accent}; --card-bg:${a.bg}"
             onclick="searchByTitle('${a.title}')">
            <div class="tr-rank">${String(i + 1).padStart(2, "0")}</div>
            <div class="tr-icon">${a.emoji}</div>
            <div class="tr-title">${a.title}</div>
            <div class="tr-meta">
                <div class="tr-genre">${a.genre}</div>
                <div class="tr-eps">${a.eps}</div>
                <div class="tr-heat">
                    <div class="tr-heat-bar">
                        <div class="tr-heat-fill" style="width:${a.heat}%"></div>
                    </div>
                    <span>${a.heat}%</span>
                </div>
            </div>
        </div>
    `).join("");

    main.innerHTML = `
        <div class="trending-label">what everyone's watching</div>
        <h2 class="trending-title">
            <span class="trending-dot"></span>
            Trending
        </h2>
        <div class="trending-grid">${cardsHtml}</div>
    `;
}

// ── Search ─────────────────────────────────────────────────────────────────────

async function doSearch() {
    const q = document.getElementById("q").value.trim();

    if (!q) {
        buildTrending();
        return;
    }

    await _fetchAndRender(q);
}

async function searchByTitle(title) {
    document.getElementById("q").value = title;
    await _fetchAndRender(title);
}

async function _fetchAndRender(q) {
    const main = document.getElementById("main");
    main.innerHTML = `<p class="status-msg">Loading...</p>`;

    let url = `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(q)}&limit=12&sfw=true`;

    if (currentFilter !== "all" && GENRE_IDS[currentFilter]) {
        url += `&genres=${GENRE_IDS[currentFilter]}`;
    }

    try {
        const res = await fetch(url);

        if (!res.ok) {
            throw new Error(`API error: ${res.status}`);
        }

        const data = await res.json();
        const results = data.data || [];

        renderResults(results, `Results for "${q}"`);

    } catch (err) {
        console.error("Jikan fetch error:", err);
        main.innerHTML = `
            <p class="status-msg">
                Could not load results. The API may be rate-limited — please try again in a moment.
            </p>
        `;
    }
}

// ── Filter ────────────────────────────────────────────────────────────────────

function setFilter(value) {
    currentFilter = value;
}

// Expose globally
window.buildTrending  = buildTrending;
window.doSearch       = doSearch;
window.searchByTitle  = searchByTitle;
window.setFilter      = setFilter;
