const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const fs = require("fs");
const { app } = require("electron");

// Onde ficará o banco em tempo de execução (com permissão de escrita)
const userDataPath = app.getPath("userData");
const dbPath = path.join(userDataPath, "musicas.db");

// Determinar de onde copiar o banco inicial
let defaultDbPath;

// Se estamos no modo produção (empacotado)
if (app.isPackaged) {
  defaultDbPath = path.join(process.resourcesPath, "db", "musicas.db");
} else {
  // Dev: pega direto da pasta do projeto
  defaultDbPath = path.join(__dirname, "../db/musicas.db");
}

// Copiar o banco inicial se não existir ainda
if (!fs.existsSync(dbPath)) {
  try {
    fs.copyFileSync(defaultDbPath, dbPath);
    console.log("Banco inicial copiado para:", dbPath);
  } catch (err) {
    console.error("Erro ao copiar banco inicial:", err);
  }
}

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) return console.error("Erro ao conectar no SQLite:", err.message);
  console.log("Conectado ao banco SQLite em:", dbPath);
});

db.run("PRAGMA foreign_keys = ON;");

module.exports = db;
