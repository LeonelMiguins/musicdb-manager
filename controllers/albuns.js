const db = require('./database');

function getAlbuns() {
    return new Promise((resolve, reject) => {
        db.all("SELECT * FROM albuns", [], (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
}

function addAlbum({ artista_id, nome, cover, genero, servidor }) {
    return new Promise((resolve, reject) => {
        db.run(
            `INSERT INTO albuns (artista_id, nome, cover, genero, servidor) VALUES (?, ?, ?, ?, ?)`,
            [artista_id, nome, cover, genero, servidor],
            function(err) {
                if (err) reject(err);
                else resolve({ id: this.lastID });
            }
        );
    });
}

module.exports = { getAlbuns, addAlbum };
