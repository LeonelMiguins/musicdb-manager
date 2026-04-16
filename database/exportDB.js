const fs = require("fs");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

async function exportDB() {

  const dbPath = path.join(__dirname, "../output/new-database-musicas.db");
  const outputDir = path.join(__dirname, "../output");

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
    const playlists = await getAll("SELECT * FROM playlists");
    const playlistMusicas = await getAll("SELECT * FROM playlist_musicas");

    // -------- ARTISTAS --------
    const artistasFormatados = artistas.map((artista) => {
      const artistaAlbuns = albuns.filter(
        (album) => album.artista_id === artista.id
      );

      return {
        id: artista.id,
        nome: artista.nome,
        genero: artista.genero,
        cover: artista.cover,
        descricao: artista.descricao,

        albuns: artistaAlbuns.map((album) => {
          const albumMusicas = musicas.filter(
            (m) => m.album_id === album.id
          );

          return {
            id: album.id,
            nome: album.nome,
            cover: album.cover,
            genero: album.genero,
            servidor: album.servidor,
            ano: album.ano,

            tracks: albumMusicas.map((m) => ({
              id: m.id,
              title: m.nome,
              url: m.url
            }))
          };
        }),
      };
    });

    // -------- PLAYLISTS --------
    const playlistsFormatadas = playlists.map((p) => {
      const musicasDaPlaylist = playlistMusicas
        .filter(pm => pm.playlist_id === p.id)
        .map(pm => {
          const musica = musicas.find(m => m.id === pm.musica_id);
          return musica
            ? {
                id: musica.id,
                title: musica.nome,
                url: musica.url
              }
            : null;
        })
        .filter(Boolean);

      return {
        id: p.id,
        nome: p.nome,
        tracks: musicasDaPlaylist
      };
    });

    // -------- JSON FINAL --------
    const exportData = {
      artistas: artistasFormatados,
      playlists: playlistsFormatadas
    };

    // 🔥 AQUI A MÁGICA (COMPACTO)
    fs.writeFileSync(outputPath, formatCompact(exportData));

    db.close();

    return { success: true, path: outputPath };

  } catch (err) {
    db.close();
    return { success: false, error: err.message };
  }
}

function formatCompact(obj, level = 0) {
  const indent = '  '.repeat(level);

  if (Array.isArray(obj)) {
    if (obj.length === 0) return '[]';

    return `[\n${obj.map(item =>
      indent + '  ' + formatCompact(item, level + 1)
    ).join(',\n')}\n${indent}]`;
  }

  if (typeof obj === 'object' && obj !== null) {
    const entries = Object.entries(obj);

    // 🔥 tudo na mesma linha (se for objeto simples)
    const simple = entries.every(([_, v]) =>
      typeof v !== 'object' || v === null
    );

    if (simple) {
      return `{ ${entries.map(([k, v]) =>
        `"${k}": ${JSON.stringify(v)}`
      ).join(', ')} }`;
    }

    // 🔥 objetos complexos (com arrays dentro)
    return `{\n${entries.map(([k, v]) =>
      `${indent}  "${k}": ${formatCompact(v, level + 1)}`
    ).join(',\n')}\n${indent}}`;
  }

  return JSON.stringify(obj);
}


module.exports = exportDB;