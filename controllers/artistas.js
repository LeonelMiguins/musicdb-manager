const db = require('./database');

function getArtistas() {
    return new Promise((resolve, reject) => {
        db.all("SELECT * FROM artistas", [], (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
}

function addArtista({ nome, cover, letra, genero }) {
    return new Promise((resolve, reject) => {
        db.run(
            `INSERT INTO artistas (nome, cover, letra, genero) VALUES (?, ?, ?, ?)`,
            [nome, cover, letra, genero],
            function(err) {
                if (err) reject(err);
                else resolve({ id: this.lastID });
            }
        );
    });
}

module.exports = { getArtistas, addArtista };
