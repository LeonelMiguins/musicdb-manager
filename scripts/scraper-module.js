const axios = require("axios");
const cheerio = require("cheerio");

async function scrapeArchive(url) {
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        const results = {
            album: url,
            cover: null,
            tracks: [],
            info: null // 🔥 novo campo
        };

        // =========================
        // 🎵 TRACKS + COVER (igual já está)
        // =========================
        $("a").each((_, el) => {
            const href = $(el).attr("href");
            if (!href) return;

            if (href.endsWith(".mp3")) {
                const fileUrl = new URL(href, url).href;
                const fileName = decodeURIComponent(href.split("/").pop());
                const title = fileName.replace(".mp3", "").trim();
                results.tracks.push({ title, url: fileUrl });
            }

            if (href.toLowerCase() === "cover.jpg") {
                results.cover = new URL(href, url).href;
            }
        });

        // =========================
        // 🔥 NOVO: tenta carregar info.json
        // =========================
        try {
            const infoUrl = new URL("info.json", url).href;
            const infoRes = await axios.get(infoUrl);

            if (infoRes.data) {
                results.info = infoRes.data;
            }
        } catch (e) {
            // silencioso → não quebra se não existir
            console.log("[SCRAPER] info.json não encontrado");
        }

        return results;

    } catch (err) {
        console.error("Erro no scraper:", err);
        return null;
    }
}

module.exports = scrapeArchive;