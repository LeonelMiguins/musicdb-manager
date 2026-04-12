const express = require('express');
const router = express.Router();
const controller = require('../controllers/artistas');

router.get('/', async (req, res) => {
    res.json(await controller.getArtistas());
});

router.post('/', async (req, res) => {
    res.json(await controller.addArtista(req.body));
});

module.exports = router;