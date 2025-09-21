// import-album-json-console.js
const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

// --- CONFIGURAR BANCO ---
const dbPath = path.join(__dirname, 'db/musicas.db');
const db = new sqlite3.Database(dbPath);

// --- ARGUMENTOS ---
const [,, filePath, artistaId, albumNome] = process.argv;

if (!filePath || !artistaId || !albumNome) {
    console.log('Uso: node import-album-json-console.js <caminho-do-json> <id-artista> "<nome-album>"');
    process.exit(1);
}

// --- LER JSON ---
let json;
try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    json = JSON.parse(raw);
} catch (err) {
    console.error('Erro ao ler o JSON:', err.message);
    process.exit(1);
}

// --- INSERIR ÁLBUM ---
db.run(
    `INSERT INTO albuns (artista_id, nome, cover, servidor) VALUES (?, ?, ?, ?)`,
    [artistaId, albumNome, json.cover || '', json.album || ''],
    function(err) {
        if (err) {
            console.error('Erro ao inserir álbum:', err.message);
            process.exit(1);
        }
        const albumId = this.lastID;
        console.log(`Álbum inserido com ID ${albumId}. Inserindo músicas...`);

        // --- INSERIR MÚSICAS ---
        const tracks = json.tracks || [];
        let count = 0;

        if (tracks.length === 0) {
            console.log('Nenhuma música encontrada no JSON.');
            process.exit(0);
        }

        tracks.forEach(track => {
            db.run(
                `INSERT INTO musicas (album_id, nome, url) VALUES (?, ?, ?)`,
                [albumId, track.title, track.url],
                (err) => {
                    if (err) {
                        console.error('Erro ao inserir música:', err.message);
                    } else {
                        count++;
                        if (count === tracks.length) {
                            console.log(`Todas as ${count} músicas foram inseridas com sucesso!`);
                            db.close();
                        }
                    }
                }
            );
        });
    }
);
