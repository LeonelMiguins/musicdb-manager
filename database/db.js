const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dir = path.join(__dirname, '../output');
const dbPath = path.join(dir, 'new-database-musicas.db');

// cria pasta se não existir
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
}

// verifica se banco já existia
const dbExists = fs.existsSync(dbPath);

// cria conexão
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Erro ao abrir banco:', err.message);
    } else {
        console.log('Banco conectado em:', dbPath);
    }
});

// ativa foreign keys
db.run("PRAGMA foreign_keys = ON;");

db.serialize(() => {

    // -------- ARTISTAS --------
    db.run(`
        CREATE TABLE IF NOT EXISTS artistas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            cover TEXT,
            letra TEXT,
            genero TEXT,
            descricao TEXT
        )
    `);

    // 🔥 adiciona coluna se não existir (banco antigo)
    db.run(`ALTER TABLE artistas ADD COLUMN descricao TEXT`, () => {});

    // -------- ALBUNS --------
    db.run(`
        CREATE TABLE IF NOT EXISTS albuns (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            artista_id INTEGER NOT NULL,
            nome TEXT NOT NULL,
            cover TEXT,
            genero TEXT,
            servidor TEXT,
            ano TEXT,
            FOREIGN KEY(artista_id) REFERENCES artistas(id) ON DELETE CASCADE
        )
    `);

    // 🔥 adiciona coluna se não existir
    db.run(`ALTER TABLE albuns ADD COLUMN ano TEXT`, () => {});

    // -------- MUSICAS --------
    db.run(`
        CREATE TABLE IF NOT EXISTS musicas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            album_id INTEGER NOT NULL,
            nome TEXT NOT NULL,
            url TEXT NOT NULL,
            FOREIGN KEY(album_id) REFERENCES albuns(id) ON DELETE CASCADE
        )
    `);

    // -------- PLAYLISTS --------
    db.run(`
        CREATE TABLE IF NOT EXISTS playlists (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS playlist_musicas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            playlist_id INTEGER,
            musica_id INTEGER,
            FOREIGN KEY(playlist_id) REFERENCES playlists(id) ON DELETE CASCADE,
            FOREIGN KEY(musica_id) REFERENCES musicas(id) ON DELETE CASCADE
        )
    `);

    console.log('Tabelas garantidas.');

    // 🔥 dados iniciais só se banco novo
    if (!dbExists) {
        console.log('Banco novo detectado, inserindo dados iniciais...');

        db.run(`
            INSERT INTO artistas (nome, cover, letra, genero, descricao)
            VALUES ('ARTISTA_TESTE', '', 'A', 'Rock', 'Artista de teste')
        `);

        db.run(`
            INSERT INTO albuns (artista_id, nome, cover, genero, servidor, ano)
            VALUES (1, 'ALBUM_TESTE', '', 'Rock', 'Spotify', '2024')
        `);

        db.run(`
            INSERT INTO musicas (album_id, nome, url)
            VALUES (1, 'MUSICA_TESTE', 'https://example.com/teste.mp3')
        `);

        console.log('Dados iniciais inseridos.');
    }
});

module.exports = db;