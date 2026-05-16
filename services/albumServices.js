import db from '../routes/database.js';

// =========================
// GET ALL
// =========================

export function getAlbums() {

    return new Promise((resolve, reject) => {

        db.all(`
            SELECT * FROM albums
        `, (err, rows) => {

            if (err) reject(err);
            else resolve(rows);

        });

    });

}

// =========================
// ADD
// =========================

export function addAlbum(album) {

    return new Promise((resolve, reject) => {

        // =========================
        // SALVA ALBUM
        // =========================

        db.run(`
            INSERT INTO albums (
                artista_nome,
                titulo,
                ano,
                genero,
                cover,
                servidor,
                autor
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [

            album.artist,
            album.album,
            album.year,
            album.genrer,
            album.cover,
            album.server,
            album.author

        ], function (err) {

            if (err) {

                reject(err);

                return;
            }

            // id do album criado

            const albumId =
                this.lastID;

            // =========================
            // SEM MUSICAS
            // =========================

            if (
                !album.tracks ||
                album.tracks.length === 0
            ) {

                resolve(albumId);

                return;
            }

            // =========================
            // SALVAR MUSICAS
            // =========================

            const stmt =
                db.prepare(`
                    INSERT INTO musicas (
                        album_id,
                        titulo,
                        url,
                        artista
                    )
                    VALUES (?, ?, ?, ?)
                `);

            album.tracks.forEach(track => {

                stmt.run([

                    albumId,
                    track.title,
                    track.url,
                    album.artist

                ]);

            });

            stmt.finalize();

            resolve(albumId);

        });

    });

}

// =========================
// DELETE
// =========================

export function deleteAlbum(id) {

    return new Promise((resolve, reject) => {

        db.run(`
            DELETE FROM albums
            WHERE id = ?
        `, [id], function (err) {

            if (err) reject(err);
            else resolve();

        });

    });

}