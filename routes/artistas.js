const express = require('express');
const router = express.Router();
const db = require('../database/db');

/* 🔹 LISTAR TODOS */
router.get('/', (req, res) => {
    db.all("SELECT * FROM artistas", [], (err, rows) => {
        if (err) return res.status(500).json(err);
        res.json(rows);
    });
});

/* 🔹 PEGAR POR ID */
router.get('/:id', (req, res) => {
    db.get(
        "SELECT * FROM artistas WHERE id = ?",
        [req.params.id],
        (err, row) => {
            if (err) return res.status(500).json(err);
            if (!row) return res.status(404).json({ error: 'Artista não encontrado' });
            res.json(row);
        }
    );
});

/* 🔥 CRIAR ARTISTA (FALTAVA ISSO) */
router.post('/', (req, res) => {
    const { nome, genero, descricao, cover, servidor } = req.body;

    db.run(
        `INSERT INTO artistas (nome, genero, descricao, cover, servidor)
         VALUES (?, ?, ?, ?, ?)`,
        [nome, genero, descricao, cover, servidor],
        function (err) {
            if (err) return res.status(500).json(err);

            res.json({
                id: this.lastID,
                nome,
                genero,
                descricao,
                cover,
                servidor
            });
        }
    );
});

router.delete('/:id', (req, res) => {
    const id = req.params.id;

    db.run(
        "DELETE FROM artistas WHERE id = ?",
        [id],
        function (err) {
            if (err) return res.status(500).json(err);

            res.json({
                success: true,
                deleted: this.changes
            });
        }
    );
});

module.exports = router;