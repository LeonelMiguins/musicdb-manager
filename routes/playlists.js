import express from 'express';
import db from './database.js';

const router = express.Router();

// =========================
// GET PLAYLISTS
// =========================

router.get('/', (req, res) => {

    db.all(`
        SELECT *
        FROM playlists
        ORDER BY id DESC
    `, [], (err, rows) => {

        if (err) {

            console.log(err);

            return res.status(500).json({
                error: err.message
            });
        }

        res.json(rows);

    });

});

// =========================
// DELETE PLAYLIST
// =========================

router.delete('/:id', (req, res) => {

    const playlistId =
        req.params.id;

    db.run(`
        DELETE FROM playlists
        WHERE id = ?
    `, [playlistId], function (err) {

        if (err) {

            console.log(err);

            return res.status(500).json({
                error: err.message
            });
        }

        res.json({
            success: true
        });

    });

});

// =========================
// ADD MUSIC PLAYLIST
// =========================

router.post('/:id/music', (req, res) => {

    const playlistId =
        req.params.id;

    const music =
        req.body;

    db.run(`
        INSERT INTO playlists_musicas (

            playlist_id,
            titulo,
            artista,
            url,
            cover

        )
        VALUES (?, ?, ?, ?, ?)
    `, [

        playlistId,
        music.title,
        music.artist,
        music.url,
        music.cover

    ], function (err) {

        if (err) {

            console.log(err);

            return res.status(500).json({
                error: err.message
            });
        }

        res.json({
            success: true
        });

    });

});

// =========================
// GET PLAYLIST BY ID
// =========================

router.get('/:id', (req, res) => {

    const playlistId =
        req.params.id;

    db.get(`
        SELECT *
        FROM playlists
        WHERE id = ?
    `, [playlistId], (err, playlist) => {

        if (err) {

            console.log(err);

            return res.status(500).json({
                error: err.message
            });
        }

        if (!playlist) {

            return res.status(404).json({
                error: 'playlist nao encontrada'
            });
        }

        // =========================
        // MUSICAS
        // =========================

        db.all(`
            SELECT *
            FROM playlists_musicas
            WHERE playlist_id = ?
        `, [playlistId], (err, tracks) => {

            if (err) {

                console.log(err);

                return res.status(500).json({
                    error: err.message
                });
            }

            playlist.tracks = tracks;

            res.json(playlist);

        });

    });

});



export default router;