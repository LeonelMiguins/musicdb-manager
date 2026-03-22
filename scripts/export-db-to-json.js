const fs = require("fs");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();
const { app, shell } = require("electron");

async function exportDB() {

  // ✅ Caminho do banco (padronizado)
  const dbPath = app.isPackaged
    ? path.join(app.getPath("userData"), "musicas.db")
    : path.join(__dirname, "../db/musicas.db");

  // ✅ Pasta de saída
  const outputDir = app.isPackaged
    ? path.join(app.getPath("userData"), "output")
    : path.join(__dirname, "../output");

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const outputPath = path.join(
    outputDir,
    `dbmusicas_${Date.now()}.json`
  );

  const db = new sqlite3.Database(dbPath);

  const getAll = (sql) =>
    new Promise((resolve, reject) => {
      db.all(sql, (err, rows) => (err ? reject(err) : resolve(rows)));
    });

  try {
    const artistas = await getAll("SELECT * FROM artistas");
    const albuns = await getAll("SELECT * FROM albuns");
    const musicas = await getAll("SELECT * FROM musicas");

    const exportData = artistas.map((artista) => {
      const artistaAlbuns = albuns.filter(
        (album) => album.artista_id === artista.id
      );
      return {
        id: artista.id,
        nome: artista.nome,
        genero: artista.genero,
        cover: artista.cover,
        albuns: artistaAlbuns.map((album) => {
          const albumMusicas = musicas.filter(
            (m) => m.album_id === album.id
          );
          return {
            id: album.id,
            nome: album.nome,
            cover: album.cover,
            servidor: album.servidor,
            tracks: albumMusicas.map((m) => ({
              id: m.id,
              title: m.nome,
              url: m.url,
            })),
          };
        }),
      };
    });

    fs.writeFileSync(outputPath, JSON.stringify(exportData, null, 2), "utf-8");
    db.close();

    shell.showItemInFolder(outputPath);

    console.log(`Exportação concluída! Arquivo em: ${outputPath}`);
    return { success: true, path: outputPath };

  } catch (err) {
    db.close();
    console.error("Erro na exportação:", err.message);
    return { success: false, error: err.message };
  }
}

module.exports = exportDB;