const db = require('../database/db');

const MusicasController = {

    getAll(req, res) {
        db.all("SELECT * FROM musicas", [], (err, rows) => {
            if (err) return res.status(500).json(err);
            res.json(rows);
        });
    },

    getByAlbum(req, res) {
        db.all(
            "SELECT * FROM musicas WHERE album_id = ?",
            [req.params.id],
            (err, rows) => {
                if (err) return res.status(500).json(err);
                res.json(rows);
            }
        );
    },

    // ✔ AQUI O POST
    create(req, res) {
        const { nome, url, album_id } = req.body;
        //console.log("MUSICA RECEBIDA:", req.body); <- DEBUG

        db.run(
            "INSERT INTO musicas (nome, url, album_id) VALUES (?, ?, ?)",
            [nome, url, album_id],
            function (err) {
                if (err) return res.status(500).json(err);

                res.json({ id: this.lastID });
            }
        );
    }

};

module.exports = MusicasController;