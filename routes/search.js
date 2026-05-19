import express from 'express';
import db from './database.js';

const router =
    express.Router();

// =========================
// SEARCH
// =========================

router.get('/', (req, res) => {

    const q =
        req.query.q;

    if (!q) {

        return res.json([]);
    }

    const search =
        `%${q}%`;

    // =========================
    // ALBUMS
    // =========================

    db.all(`
        SELECT
            *,
            'album' as type

        FROM albums

        WHERE
            titulo LIKE ?
            OR artista_nome LIKE ?

        ORDER BY id DESC
    `, [

        search,
        search

    ], (err, albums) => {

        if (err) {

            console.log(err);

            return res
                .status(500)
                .json({
                    error: err.message
                });
        }

        // =========================
        // PLAYLISTS
        // =========================

        db.all(`
            SELECT
                *,
                'playlist' as type

            FROM playlists

            WHERE
                titulo LIKE ?
                OR artista_nome LIKE ?

            ORDER BY id DESC
        `, [

            search,
            search

        ], (err, playlists) => {

            if (err) {

                console.log(err);

                return res
                    .status(500)
                    .json({
                        error: err.message
                    });
            }

            const results = [

                ...albums,
                ...playlists

            ];

            res.json(results);

        });

    });

});

export default router;