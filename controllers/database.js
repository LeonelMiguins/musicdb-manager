const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const { app } = require("electron");

let dbPath;

if (app.isPackaged) {
  // Produção (instalado)
  dbPath = path.join(app.getPath("userData"), "musicas.db");
} else {
  // Desenvolvimento (projeto)
  dbPath = path.join(__dirname, "../db/musicas.db");
}

console.log("Banco em uso:", dbPath);

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) return console.error("Erro ao conectar:", err.message);
  console.log("Conectado ao SQLite");
});

db.run("PRAGMA foreign_keys = ON;");

module.exports = db;