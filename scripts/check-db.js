const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database("D:/Dark Spotify/musicdb-manager/musicdb-manager/db/musicas.db");


db.all("SELECT id, nome FROM albuns ORDER BY id DESC LIMIT 5", (err, rows) => {
  if (err) throw err;
  console.log(rows);
  db.close();
});
