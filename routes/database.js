//conexão com o banco de dados para uso global

import sqlite3 from 'sqlite3';

import path from 'path';

import { fileURLToPath }
from 'url';

sqlite3.verbose();

const __filename =
    fileURLToPath(import.meta.url);

const __dirname =
    path.dirname(__filename);

const DB_PATH =
    path.join(__dirname, '../db/music.db');

const db =
    new sqlite3.Database(DB_PATH, (err) => {

        if (err) {
            console.error('❌ erro banco:', err);
        } else {
            console.log('✅ banco conectado');
        }

    });

export default db;