/**
 * animay - ui.js
 * Renders anime result cards into the #main element.
 */

function renderResults(results, heading) {
    const main = document.getElementById("main");

    if (!results || !results.length) {
        main.innerHTML = `
            <h2 class="results-heading">${heading || "Results"}</h2>
            <p class="status-msg">No anime found. Try a different search!</p>
        `;
        return;
    }

    // Optional heading above the grid
    const headingHtml = heading
        ? `<h2 class="results-heading">${heading}</h2>`
        : "";

    let cardsHtml = "";

    results.forEach(r => {
        const title    = r.title || r.title_english || "Unknown Title";
        const synopsis = r.synopsis
            ? r.synopsis.replace(/\[Written by MAL Rewrite\]/g, "").trim()
            : "No synopsis available.";
        const imageUrl = r.images?.jpg?.large_image_url
                      || r.images?.jpg?.image_url
                      || "https://via.placeholder.com/300x400?text=No+Image";
        const score    = r.score ? `<span class="score-badge">★ ${r.score}</span>` : "";
        const episodes = r.episodes ? `<span class="ep-badge">${r.episodes} eps</span>` : "";

        cardsHtml += `
            <div class="rcard">
                <img
                    class="poster"
                    src="${imageUrl}"
                    alt="${title}"
                    loading="lazy"
                    onerror="this.src='https://via.placeholder.com/300x400?text=No+Image'"
                >
                <div class="cbody">
                    <h3>${title}</h3>
                    <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:4px">
                        ${score}${episodes}
                    </div>
                    <p>${synopsis}</p>
                </div>
            </div>
        `;
    });

    main.innerHTML = `
        ${headingHtml}
        <div class="rgrid">${cardsHtml}</div>
    `;
}

// Expose globally
window.renderResults = renderResults;
