// =========================
// SCRAPER ARCHIVE
// =========================

app.post(
    '/api/scrape/archive',

    async (req, res) => {

        try {

            const { url } =
                req.body;

            const album =
                await scrapeArchive(url);

            if (!album) {

                return res.status(404).json({

                    success: false,
                    error: 'album nao encontrado'
                });
            }

            res.json({

                success: true,
                album
            });

        } catch (err) {

            console.log(err);

            res.status(500).json({

                success: false,
                error: 'erro interno'
            });
        }
    }
);