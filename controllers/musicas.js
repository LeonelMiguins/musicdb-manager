const db = require('./database');

function getMusicas() {
    return new Promise((resolve, reject) => {
        db.all("SELECT * FROM musicas", [], (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
}

function addMusica({ album_id, nome, url }) {
    return new Promise((resolve, reject) => {
        db.run(
            `INSERT INTO musicas (album_id, nome, url) VALUES (?, ?, ?)`,
            [album_id, nome, url],
            function(err) {
                if (err) reject(err);
                else resolve({ id: this.lastID });
            }
        );
    });
}

module.exports = { getMusicas, addMusica };
