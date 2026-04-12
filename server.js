const express = require('express');
const open = (...args) => import('open').then(m => m.default(...args));
const app = express();

app.use(express.json());
app.use(express.static('public'));

app.use('/api/artistas', require('./routes/artistas'));
app.use('/api/albuns', require('./routes/albuns'));
app.use('/api/musicas', require('./routes/musicas'));

const initDatabase = require('./database/initDb');
const exportDB = require('./database/exportDB');
const scrapeArchive = require('./scripts/scraper-module');

// ROTAS
app.post('/api/init-db', async (req, res) => {
    const result = await initDatabase();
    res.json(result);
});

app.get('/api/export', async (req, res) => {
    const result = await exportDB();
    res.json(result);
});

app.post('/api/scraper', async (req, res) => {
    const { url } = req.body;
    const data = await scrapeArchive(url);
    res.json(data);
});

// SERVER
app.listen(3000, async () => {
    const url = 'http://localhost:3000';
    console.log(url);

    // 👇 abre automaticamente no navegador
    await open(url);
});