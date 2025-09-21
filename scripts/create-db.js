const sqlite3 = require('sqlite3').verbose();

// Cria ou abre o banco de dados
const db = new sqlite3.Database('output/new-database-musicas.db', (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Conectado ao banco de dados SQLite.');
});

// Ativa suporte a foreign keys
db.run("PRAGMA foreign_keys = ON;");

db.serialize(() => {
    // Tabela Artistas
    db.run(`
        CREATE TABLE IF NOT EXISTS artistas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            cover TEXT,
            letra TEXT,
            genero TEXT
        )
    `);

    // Tabela Albuns com ON DELETE CASCADE
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

    // Tabela Musicas com ON DELETE CASCADE
    db.run(`
        CREATE TABLE IF NOT EXISTS musicas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            album_id INTEGER NOT NULL,
            nome TEXT NOT NULL,
            url TEXT NOT NULL,
            FOREIGN KEY(album_id) REFERENCES albuns(id) ON DELETE CASCADE
        )
    `);

    console.log('Tabelas criadas com sucesso.');

    // Inserindo dados fictícios
    db.run(`INSERT INTO artistas (nome, cover, letra, genero) VALUES 
        ('The Fictives', 'https://i.scdn.co/image/ab67616d0000b2730ea1ecb2d5271c2db402b0c2', 'T', 'Rock'),
        ('Average Sevenfold', 'https://i.scdn.co/image/ab67616d0000b2730ea1ecb2d5271c2db402b0c2', 'A', 'Rock'),
        ('Synth Lords', 'https://i.scdn.co/image/ab67616d0000b2730ea1ecb2d5271c2db402b0c2', 'S', 'Synthwave')
    `);

    db.run(`INSERT INTO albuns (artista_id, nome, cover, genero, servidor) VALUES
        (1, 'Rocking the World', 'https://i.scdn.co/image/ab67616d0000b273c34064a3c5e4a25892a091f3', 'Rock' , 'Spotify'),
        (1, 'Acoustic Dreams', 'https://i.scdn.co/image/ab67616d0000b273c34064a3c5e4a25892a091f3', 'Rock' , 'Apple Music'),
        (2, 'Heavenly Riffs', 'https://i.scdn.co/image/ab67616d0000b273c34064a3c5e4a25892a091f3', 'Rock', 'YouTube Music'),
        (3, 'Neon Nights', 'https://i.scdn.co/image/ab67616d0000b273c34064a3c5e4a25892a091f3', 'Synthwave', 'YouTube Music')
    `);

    db.run(`INSERT INTO musicas (album_id, nome, url) VALUES
        (1, 'High Voltage', 'https://example.com/musica1.mp3'),
        (1, 'Electric Heart', 'https://example.com/musica2.mp3'),
        (2, 'Soft Strings', 'https://example.com/musica3.mp3'),
        (3, 'Shining Stars', 'https://example.com/musica4.mp3'),
        (4, 'Neon Lights', 'https://example.com/musica5.mp3')
    `);

    console.log('Dados fictícios inseridos com sucesso.');
});

// Fechando o banco
db.close((err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Conexão com o banco de dados encerrada.');
});
