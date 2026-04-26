const express = require('express');
const app = express();
const initDb = require('./database/initDatabase');
const scraperRoute = require("./routes/scraper");
const exportRoute = require("./routes/export");




app.use(express.json());
app.use(express.static('www'));

app.use("/api/export", exportRoute);
app.use('/api/artistas', require('./routes/artistas'));
app.use('/api/albuns', require('./routes/albuns'));
app.use('/api/musicas', require('./routes/musicas'));
app.use('/api/playlists', require('./routes/playlists'));
app.use("/api/scraper", scraperRoute);


initDb().then(() => {
    app.listen(3000, () => {
        console.log('http://localhost:3000');
    });
});