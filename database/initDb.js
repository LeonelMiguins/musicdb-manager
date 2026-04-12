const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

function initDatabase() {
    return new Promise((resolve, reject) => {
        const dir = path.join(__dirname, '../output');

        // cria pasta se não existir
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }

        const dbPath = path.join(dir, 'new-database-musicas.db');

        const db = new sqlite3.Database(dbPath, (err) => {
            if (err) return reject(err);
        });

        db.serialize(() => {
            db.run("PRAGMA foreign_keys = ON;");

            db.run(`
                CREATE TABLE IF NOT EXISTS artistas (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    nome TEXT NOT NULL,
                    cover TEXT,
                    letra TEXT,
                    genero TEXT
                )
            `);

            db.run(`
                CREATE TABLE IF NOT EXISTS albuns (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    artista_id INTEGER NOT NULL,
                    nome TEXT NOT NULL,
                    cover TEXT,
                    genero TEXT,
                    servidor TEXT,
                    FOREIGN KEY(artista_id) REFERENCES artistas(id) ON DELETE CASCADE
                )
            `);

            db.run(`
                CREATE TABLE IF NOT EXISTS musicas (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    album_id INTEGER NOT NULL,
                    nome TEXT NOT NULL,
                    url TEXT NOT NULL,
                    FOREIGN KEY(album_id) REFERENCES albuns(id) ON DELETE CASCADE
                )
            `);

            // dados de teste
            db.run(`
                INSERT INTO artistas (nome, cover, letra, genero)
                VALUES ('ARTISTA_TESTE', '', 'A', 'Rock')
            `);

            db.run(`
                INSERT INTO albuns (artista_id, nome, cover, genero, servidor)
                VALUES (1, 'ALBUM_TESTE', '', 'Rock', 'Spotify')
            `);

            db.run(`
                INSERT INTO musicas (album_id, nome, url)
                VALUES (1, 'MUSICA_TESTE', 'https://example.com/teste.mp3')
            `);

            db.close((err) => {
                if (err) reject(err);
                else resolve({ success: true, path: dbPath });
            });
        });
    });
}

module.exports = initDatabase;