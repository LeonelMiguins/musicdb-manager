const db = require('../database/db');

exports.getAlbuns = () => {
    return new Promise((resolve, reject) => {
        db.all("SELECT * FROM albuns", [], (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
};

exports.addAlbum = (album) => {
    return new Promise((resolve, reject) => {
        db.run(
            `INSERT INTO albuns (artista_id, nome, cover, genero, servidor, ano)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [
                album.artista_id,
                album.nome,
                album.cover,
                album.genero,
                album.servidor,
                album.ano
            ],
            function (err) {
                if (err) reject(err);
                else resolve({ id: this.lastID });
            }
        );
    });
};