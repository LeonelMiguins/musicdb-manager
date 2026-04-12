const express = require('express');
const router = express.Router();
const controller = require('../controllers/musicas');

// GET todas as músicas
router.get('/', async (req, res) => {
    try {
        const data = await controller.getMusicas();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST criar música
router.post('/', async (req, res) => {
    try {
        const result = await controller.addMusica(req.body);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;