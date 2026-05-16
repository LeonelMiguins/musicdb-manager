import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs';

export async function scrapePalco(url) {

    try {

        console.log('🚀 carregando página...');

        // =========================
        // HTML
        // =========================

        const { data: html } =
            await axios.get(url);

        const $ =
            cheerio.load(html);

        // =========================
        // ALBUM
        // =========================

        const album =
            $('h1')
                .first()
                .text()
                .trim();

        if (!album) {

            throw new Error(
                'album nao encontrado'
            );
        }

        // =========================
        // ARTIST
        // =========================

        const artist =
            $('a[title*="Ir para a página de"]')
                .first()
                .text()
                .trim();

        // =========================
        // COVER
        // =========================

        const cover =
            $('img')
                .first()
                .attr('src');

        // =========================
        // YEAR
        // =========================

        const infoText =
            $('h2')
                .first()
                .text();

        const yearMatch =
            infoText.match(
                /\b(19|20)\d{2}\b/
            );

        const year =
            yearMatch
                ? yearMatch[0]
                : '';

        // =========================
        // MUSIC NAMES
        // =========================

        const musicNames = [];

        $('a._6fBao._16Uya')
            .each((i, el) => {

                const title =
                    $(el)
                        .text()
                        .trim();

                if (title) {

                    musicNames.push(
                        title
                    );
                }
            });

        // =========================
        // MP3 URLS
        // =========================

        const mp3Regex =
            /https:\/\/[^"]+\.mp3/g;

        const mp3Matches =
            html.match(mp3Regex) || [];

        const uniqueMp3 =
            [...new Set(mp3Matches)];

        // =========================
        // TRACKS
        // =========================

        const tracks = [];

        uniqueMp3.forEach(
            (trackUrl, index) => {

                tracks.push({

                    title:
                        musicNames[index] ||
                        `Faixa ${index + 1}`,

                    url:
                        trackUrl.replace(
                            /\\/g,
                            ''
                        )
                });
            }
        );

        // =========================
        // JSON
        // =========================

        const albumData = {

            album,

            artist,

            server:
                'palco-mp3',

            genrer:
                'Rock',

            author:
                'Leo Miguins',

            year,

            cover,

            tracks
        };

        // =========================
        // CREATE DOWNLOADS
        // =========================

        if (
            !fs.existsSync(
                'albums_json'
            )
        ) {

            fs.mkdirSync(
                'albums_json'
            );
        }

        // =========================
        // SAVE JSON
        // =========================

        fs.writeFileSync(

            `albums_json/${album} - ${artist}.json`,

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