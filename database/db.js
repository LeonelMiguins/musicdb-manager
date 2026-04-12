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

// cria estrutura
db.serialize(() => {

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

    console.log('Tabelas garantidas.');

    // 🔥 só insere dados se banco for novo
    if (!dbExists) {
        console.log('Banco novo detectado, inserindo dados iniciais...');

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

        console.log('Dados iniciais inseridos.');
    }
});

module.exports = db;