const express = require('express');
const router = express.Router();
const scrapeArchive = require('../scripts/scraper-module');

router.post('/', async (req, res) => {
    const { url } = req.body;

    const result = await scrapeArchive(url);

    if (!result) {
        return res.status(500).json({ error: 'Scraper falhou' });
    }

    return res.json({
        album: result.album,
        cover: result.cover,
        tracks: result.tracks   // 🔥 ISSO ESTAVA FALTANDO
    });
});

module.exports = router;