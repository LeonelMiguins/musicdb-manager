import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs';

export async function scrapeArchive(url) {

    try {

        const itemId =
            url.split('/details/')[1];

        if (!itemId) {

            throw new Error(
                'url invalida'
            );
        }

        const downloadUrl =
            `https://archive.org/download/${itemId}/`;

        // =========================
        // PAGE
        // =========================

        const { data: html } =
            await axios.get(url);

        const $ =
            cheerio.load(html);

        // =========================
        // DADOS
        // =========================

        const albumName =
            $("h1.item-title span[itemprop='name']")
                .text()
                .trim();

        if (!albumName) {

            throw new Error(
                'album nao encontrado'
            );
        }

        const creator =
            $(".item-upload-info__uploader-name")
                .first()
                .text()
                .trim();

        const cover =
            $("img.img-responsive")
                .attr("src");

        // =========================
        // DOWNLOAD PAGE
        // =========================

        const {
            data: downloadHtml
        } = await axios.get(downloadUrl);

        const $$ =
            cheerio.load(downloadHtml);

        const tracks = [];

        $$("a").each((i, el) => {

            const href =
                $$(el).attr("href");

            if (
                href &&
                href.endsWith(".mp3")
            ) {

                tracks.push({

                    title:
                        decodeURIComponent(href)
                            .replace(".mp3", ""),

                    url:
                        downloadUrl + href
                });
            }
        });

        // =========================
        // JSON
        // =========================

        const albumData = {

            album:
                albumName,

            artist:
                "Desconhecido",

            server:
                "internet-archive",

            genrer:
                "Rock",

            author:
                creator,

            cover:
                cover.startsWith('http')
                    ? cover
                    : 'https://archive.org' + cover,

            tracks
        };

        // salva json opcional

        // =========================
        // CREATE DOWNLOADS FOLDER
        // =========================

        if (!fs.existsSync('./albums_json/')) {

            fs.mkdirSync('./albums_json/');
        }

        // =========================
        // SAVE JSON
        // =========================

        fs.writeFileSync(

            `./albums_json/${albumName}.json`,

            JSON.stringify(
                albumData,
                null,
                2
            )
        );

        return albumData;

    } catch (err) {

        console.log(err);

        return null;
    }
}