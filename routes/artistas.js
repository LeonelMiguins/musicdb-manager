const express = require('express');
const router = express.Router();
const controller = require('../controllers/artistas');

// GET
router.get('/', async (req, res) => {
    const data = await controller.getArtistas();
    res.json(data);
});

// POST
router.post('/', async (req, res) => {
    const result = await controller.addArtista(req.body);
    res.json(result);
});

// DELETE ✅
router.delete('/:id', async (req, res) => {
    try {
        const result = await controller.deleteArtista(req.params.id);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;