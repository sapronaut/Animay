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

function buildTrending() {
    const main = document.getElementById("main");

    const pillsHtml = TRENDING.map(title => `
        <div class="pill-card" onclick="searchByTitle('${title}')">${title}</div>
    `).join("");

    main.innerHTML = `
        <h2 class="trending-title">Trending</h2>
        <div class="trending-row">${pillsHtml}</div>
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
