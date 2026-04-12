const db = require('../database/db');

exports.getMusicas = () => {
    return new Promise((resolve, reject) => {
        db.all("SELECT * FROM musicas", [], (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
};

exports.addMusica = (musica) => {
    return new Promise((resolve, reject) => {
        db.run(
            `INSERT INTO musicas (album_id, nome, url)
             VALUES (?, ?, ?)`,
            [musica.album_id, musica.nome, musica.url],
            function (err) {
                if (err) reject(err);
                else resolve({ id: this.lastID });
            }
        );
    });
};