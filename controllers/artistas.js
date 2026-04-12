const db = require('../database/db');

exports.getArtistas = () => {
    return new Promise((resolve, reject) => {
        db.all("SELECT * FROM artistas", [], (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
};

exports.addArtista = (artista) => {
    return new Promise((resolve, reject) => {
        db.run(
            `INSERT INTO artistas (nome, cover, letra, genero)
             VALUES (?, ?, ?, ?)`,
            [artista.nome, artista.cover, artista.letra, artista.genero],
            function (err) {
                if (err) reject(err);
                else resolve({ id: this.lastID });
            }
        );
    });
};