const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../db/music.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) console.error(err);
    else console.log('DB conectado');
});

module.exports = db;