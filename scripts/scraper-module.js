// script para fazer scraping de arquivos MP3 e capas de álbuns de um diretório/servidor web

const axios = require("axios");
const cheerio = require("cheerio");

async function scrapeArchive(url) {
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        const results = { album: url, cover: null, tracks: [] };

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

        return results;
    } catch (err) {
        console.error("Erro no scraper:", err);
        return null;
    }
}

module.exports = scrapeArchive;
