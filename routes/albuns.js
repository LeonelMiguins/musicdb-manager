const express = require('express');
const router = express.Router();
const db = require('../database/db');

// 🔹 GET por ID (ADICIONA ISSO)
router.get('/:id', (req, res) => {
    db.get(
        "SELECT * FROM albuns WHERE id = ?",
        [req.params.id],
        (err, row) => {
            if (err) return res.status(500).json(err);

            if (!row) {
                return res.status(404).json({ error: 'Álbum não encontrado' });
            }

            res.json(row);
        }
    );
});

// 🔹 GET lista / filtro por artista
router.get('/', (req, res) => {
    const artista_id = req.query.artista_id;

    if (artista_id) {
        db.all(
            "SELECT * FROM albuns WHERE artista_id = ?",
            [artista_id],
            (err, rows) => {
                if (err) return res.status(500).json(err);
                res.json(rows);
            }
        );
    } else {
        db.all("SELECT * FROM albuns", [], (err, rows) => {
            if (err) return res.status(500).json(err);
            res.json(rows);
        });
    }
});

router.post('/', (req, res) => {
    const { nome, ano, cover, genero, artista_id } = req.body;

    db.run(
        `INSERT INTO albuns (nome, ano, cover, genero, artista_id)
         VALUES (?, ?, ?, ?, ?)`,
        [nome, ano, cover, genero, artista_id],
        function (err) {
            if (err) {
                return res.status(500).json(err);
            }

            return res.json({
                id: this.lastID,
                nome,
                ano,
                cover,
                genero,
                artista_id
            });
        }
    );
});

module.exports = router;