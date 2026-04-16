const db = require('../database/db');

// -------- LISTAR --------
exports.getArtistas = () => {
    return new Promise((resolve, reject) => {
        db.all("SELECT * FROM artistas", [], (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
};

// -------- ADICIONAR --------
exports.addArtista = (artista) => {
    return new Promise((resolve, reject) => {
        db.run(
            `INSERT INTO artistas (nome, cover, letra, genero, descricao)
             VALUES (?, ?, ?, ?, ?)`,
            [
                artista.nome,
                artista.cover,
                artista.letra,
                artista.genero,
                artista.descricao || '' // 🔥 evita null
            ],
            function (err) {
                if (err) reject(err);
                else resolve({ id: this.lastID });
            }
        );
    });
};

// -------- DELETAR --------
exports.deleteArtista = (id) => {
    return new Promise((resolve, reject) => {
        db.run(
            "DELETE FROM artistas WHERE id = ?",
            [id],
            function (err) {
                if (err) reject(err);
                else resolve({ success: true });
            }
        );
    });
};