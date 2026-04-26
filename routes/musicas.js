const express = require('express');
const router = express.Router();
const MusicasController = require('../controllers/musicas');

router.get('/', MusicasController.getAll);
router.get('/album/:id', MusicasController.getByAlbum);

// ✔ POST AQUI
router.post('/', MusicasController.create);

module.exports = router;