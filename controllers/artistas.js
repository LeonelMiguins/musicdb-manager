const db = require('../database/db');

// GET
exports.getArtistas = () => {
    return new Promise((resolve, reject) => {
        db.all("SELECT * FROM artistas", [], (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
};

// CREATE
exports.addArtista = (artista) => {
    return new Promise((resolve, reject) => {
        db.run(
            "INSERT INTO artistas (name, genre, desc, cover, server) VALUES (?, ?, ?, ?, ?)",
            [artista.name, artista.genre, artista.desc, artista.cover, artista.server],
            function (err) {
                if (err) reject(err);
                else resolve({ id: this.lastID });
            }
        );
    });
};

router.get('/:id', (req, res) => {
    const db = require('../database/db');

    db.get(
        "SELECT * FROM artistas WHERE id = ?",
        [req.params.id],
        (err, row) => {
            if (err) return res.status(500).json(err);
            res.json(row);
        }
    );
});