const db = require('../database/db');

// 📥 GET
exports.getPlaylists = () => {
    return new Promise((resolve, reject) => {
        db.all("SELECT * FROM playlists", [], (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
};

// ➕ CREATE
exports.addPlaylist = (playlist) => {
    return new Promise((resolve, reject) => {
        db.run(
            `INSERT INTO playlists (nome, cover, descricao, artista, servidor)
             VALUES (?, ?, ?, ?, ?)`,
            [
                playlist.nome,
                playlist.cover || null,
                playlist.descricao || "",
                playlist.artista || "Vários",
                playlist.servidor || "Local"
            ],
            function (err) {
                if (err) {
                    console.error("[DB PLAYLIST ERROR]", err.message);
                    reject(err);
                } else {
                    resolve({ id: this.lastID });
                }
            }
        );
    });
};

// ✏️ UPDATE
exports.updatePlaylist = (id, playlist) => {
    return new Promise((resolve, reject) => {
        db.run(
            "UPDATE playlists SET name = ?, desc = ? WHERE id = ?",
            [playlist.name, playlist.desc, id],
            function (err) {
                if (err) reject(err);
                else resolve({ updated: this.changes });
            }
        );
    });
};

// ❌ DELETE
exports.deletePlaylist = (id) => {
    return new Promise((resolve, reject) => {
        db.run(
            "DELETE FROM playlists WHERE id = ?",
            [id],
            function (err) {
                if (err) reject(err);
                else resolve({ deleted: this.changes });
            }
        );
    });
};