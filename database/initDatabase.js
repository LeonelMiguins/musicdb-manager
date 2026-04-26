const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

function run(db, sql) {
    return new Promise((resolve, reject) => {
        db.run(sql, function (err) {
            if (err) reject(err);
            else resolve(this);
        });
    });
}

function get(db, sql) {
    return new Promise((resolve, reject) => {
        db.get(sql, (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
}

function initDb() {
    return new Promise(async (resolve, reject) => {

        const dbPath = path.join(__dirname, '../db/music.db');
        const db = new sqlite3.Database(dbPath);

        try {
            console.log('Criando banco...');

            await run(db, "PRAGMA foreign_keys = ON");

            // -------- TABELAS --------
            await run(db, `CREATE TABLE IF NOT EXISTS artistas (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nome TEXT,
                genero TEXT,
                descricao TEXT,
                cover TEXT,
                servidor TEXT
            )`);

            await run(db, `CREATE TABLE IF NOT EXISTS albuns (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                artista_id INTEGER,
                nome TEXT,
                ano TEXT,
                genero TEXT,
                descricao TEXT,
                cover TEXT,
                servidor TEXT,
                FOREIGN KEY (artista_id) REFERENCES artistas(id) ON DELETE CASCADE
            )`);

            await run(db, `CREATE TABLE IF NOT EXISTS musicas (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                album_id INTEGER,
                nome TEXT,
                url TEXT,
                FOREIGN KEY (album_id) REFERENCES albuns(id) ON DELETE CASCADE
            )`);

            await run(db, `CREATE TABLE IF NOT EXISTS playlists (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nome TEXT,
                cover TEXT,
                descricao TEXT,
                artista TEXT,
                servidor TEXT
            )`);

            await run(db, `CREATE TABLE IF NOT EXISTS playlist_musicas (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                playlist_id INTEGER,
                nome TEXT,
                artista TEXT,
                url TEXT,
                cover TEXT,
                FOREIGN KEY (playlist_id) REFERENCES playlists(id) ON DELETE CASCADE
            )`);

            // 🔥 CHECAGEM REAL DO BANCO
            const row = await get(db, "SELECT COUNT(*) as count FROM artistas");

            if (row.count > 0) {
                console.log("Banco já populado → ignorando seed");
                db.close();
                return resolve();
            }

            console.log("Banco vazio → populando...");

            // 🔥 SEED
            await run(db, `
                INSERT INTO artistas (nome, genero, descricao, cover, servidor)
                VALUES 
                ('Aron', 'Rock', 'Herói da sua história', 'https://artist99.cdn107.com/3c7/3c70bc2e79f555d1051ef699484e6e73_lg.jpg', 'Local'),
                ('Ester', 'Pop', 'Cantora misteriosa', 'https://artist99.cdn107.com/17a/17ad22c1b05778ddcf236e12fd5263ef_lg.jpg', 'Spotify')
            `);

            await run(db, `
                INSERT INTO albuns (artista_id, nome, ano, genero, descricao, cover, servidor)
                VALUES 
                (1, 'Sombras da Guerra', '1994', 'Rock', 'Álbum épico', 'https://artist99.cdn107.com/90a/90a1bab4054b8dc7d714d826b79e3006_lg.jpg', 'Local'),
            `);

            await run(db, `
                INSERT INTO musicas (album_id, nome, url)
                VALUES 
                (1, 'Chamas Eternas', 'https://m4a-64.jango.com/43/03/46/4303468333325401379.m4a'),
                (1, 'Eco das Ruínas', 'https://m4a-64.jango.com/25/94/88/2594883900153723657.m4a'),
                (1, 'Brilho Noturno', 'https://m4a-64.jango.com/22/48/20/2248207164423705543.m4a')
            `);

            await run(db, `
                INSERT INTO playlists (nome, cover, descricao, artista, servidor)
                VALUES 
                ('Favoritas', 'https://dn711103.ca.archive.org/0/items/rami-rez-1036544-rami-rez/Contracapa.jpg', 'Minhas favoritas', 'Vários', 'Local')
            `);

            await run(db, `
                INSERT INTO playlist_musicas (playlist_id, nome, artista, url, cover)
                VALUES 
                (1, 'Uma noite de Luar', 'Independente do amanhã', 'https://m4a-64.jango.com/22/48/20/2248207164423705543.m4a', 'https://dn711103.ca.archive.org/0/items/rami-rez-1036544-rami-rez/Contracapa.jpg'),
                (1, 'Eu amo você', 'Lucas Ricardo', 'https://m4a-64.jango.com/22/48/20/2248207164423705543.m4a', 'https://dn711103.ca.archive.org/0/items/rami-rez-1036544-rami-rez/Contracapa.jpg')
            `);

            console.log("Seed concluído!");

            db.close();
            resolve();

        } catch (err) {
            db.close();
            reject(err);
        }
    });
}

module.exports = initDb;