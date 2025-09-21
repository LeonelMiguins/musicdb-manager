const fs = require("fs");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();
const { app, shell } = require("electron");

async function exportDB() {
  // Caminho do banco real em uso
  const userDataPath = app.getPath("userData");
  const dbPath = path.join(userDataPath, "musicas.db");

  // Pasta de saída (dev: ./output, dist: userData/output)
  const outputDir = app.isPackaged
    ? path.join(userDataPath, "output") // dist -> dentro de AppData/...
    : path.join(__dirname, "../output"); // dev -> pasta local do projeto

  // Cria a pasta se não existir
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

    // Abre a pasta no Explorer/Finder
    shell.showItemInFolder(outputPath);

    console.log(`Exportação concluída! Arquivo gerado em: ${outputPath}`);
    return { success: true, path: outputPath };
  } catch (err) {
    db.close();
    console.error("Erro na exportação:", err.message);
    return { success: false, error: err.message };
  }
}

module.exports = exportDB;
