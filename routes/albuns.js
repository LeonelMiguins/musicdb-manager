const express = require('express');
const router = express.Router();
const controller = require('../controllers/albuns');

// GET todos os álbuns
router.get('/', async (req, res) => {
    try {
        const data = await controller.getAlbuns();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST criar álbum
router.post('/', async (req, res) => {
    try {
        const result = await controller.addAlbum(req.body);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const {
            artista_id,
            nome,
            cover,
            genero,
            servidor,
            ano
        } = req.body;

        const result = await Album.addAlbum({
            artista_id,
            nome,
            cover,
            genero,
            servidor,
            ano
        });

        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


module.exports = router;