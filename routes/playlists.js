const express = require('express');
const router = express.Router();
const controller = require('../controllers/playlists');

// GET
router.get('/', async (req, res) => {
    try {
        const data = await controller.getPlaylists();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST
router.post('/', async (req, res) => {
    try {
        const result = await controller.addPlaylist(req.body);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT
router.put('/:id', async (req, res) => {
    try {
        const result = await controller.updatePlaylist(req.params.id, req.body);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE
router.delete('/musicas/:id', (req, res) => {
    const db = require('../database/db');

    db.run(
        `DELETE FROM playlist_musicas WHERE id = ?`,
        [req.params.id],
        function (err) {
            if (err) return res.status(500).json(err);

            res.json({ success: true });
        }
    );
});

router.get('/:id/musicas', (req, res) => {
    console.log("REQ ID:", req.params.id);

    const db = require('../database/db');

    db.all(
        `SELECT * FROM playlist_musicas WHERE playlist_id = ?`,
        [req.params.id],
        (err, rows) => {
            console.log("ROWS:", rows);

            if (err) return res.status(500).json(err);
            res.json(rows);
        }
    );
});

router.get('/:id', (req, res) => {
    const db = require('../database/db');

    db.get(
        `SELECT * FROM playlists WHERE id = ?`,
        [req.params.id],
        (err, row) => {
            if (err) return res.status(500).json(err);
            res.json(row);
        }
    );
});

router.post('/:id/musicas', (req, res) => {
    const db = require('../database/db');

    const { nome, artista, url, cover } = req.body;
    const playlist_id = req.params.id;

    db.run(
        `INSERT INTO playlist_musicas 
        (playlist_id, nome, artista, url, cover)
        VALUES (?, ?, ?, ?, ?)`,
        [playlist_id, nome, artista, url, cover],
        function (err) {
            if (err) return res.status(500).json(err);

            res.json({
                id: this.lastID,
                playlist_id,
                nome,
                artista,
                url,
                cover
            });
        }
    );
});

module.exports = router;