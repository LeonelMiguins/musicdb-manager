const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const artistasController = require('./controllers/artistas');
const albunsController = require('./controllers/albuns');
const musicasController = require('./controllers/musicas');
const { screen, Menu } = require('electron');
const sqlite3 = require('sqlite3').verbose();

// --- IPC HANDLERS ---
ipcMain.handle('fetch-artistas', () => artistasController.getArtistas());
ipcMain.handle('add-artista', (event, artista) => artistasController.addArtista(artista));

ipcMain.handle('fetch-albuns', () => albunsController.getAlbuns());
ipcMain.handle('add-album', (event, album) => albunsController.addAlbum(album));

ipcMain.handle('fetch-musicas', () => musicasController.getMusicas());
ipcMain.handle('add-musica', (event, musica) => musicasController.addMusica(musica));



const scrapeArchive = require('./scripts/scraper-module.js');
ipcMain.handle('scraper-archive', async (event, url) => {
    console.log('Iniciando scraping do Internet Archive para URL:', url);
    const data = await scrapeArchive(url);
    console.log('Scraping finalizado para URL:', url);
    return data;
});


const exportDB = require('./scripts/export-db-to-json');
ipcMain.handle('export-db-json', async () => {
    console.log('Exportação iniciada pelo front-end...');
    const result = await exportDB();
    return result;
});

const exportDBLetters = require('./scripts/export-db-to-letters');
const { maxHeaderSize } = require('http');
ipcMain.handle('export-db-letters', async () => {
    console.log('Exportação iniciada pelo front-end...');
    const result = await exportDBLetters();
    return result;
});


ipcMain.handle('save-album', async (event, albumData) => {
    try {
        // 1. Salvar álbum
        const albumResult = await albunsController.addAlbum(albumData);

        const albumId = albumResult.id;

        // 2. Salvar músicas
        if (albumData.tracks && albumData.tracks.length > 0) {
            for (const track of albumData.tracks) {
                await musicasController.addMusica({
                    album_id: albumId,
                    nome: track.title,
                    url: track.url
                });
            }
        }

        return { success: true, id: albumId };
    } catch (err) {
        console.error('Erro ao salvar álbum e músicas:', err);
        return { success: false, error: err.message };
    }
});



// --- CRIAR JANELA ---
function createWindow() {
    // Pega o tamanho da tela primária
    const primaryDisplay = screen.getPrimaryDisplay();
    const { width, height } = primaryDisplay.workAreaSize;

    // Caminho seguro para o ícone, dev ou dist
    const iconPath = app.isPackaged
    ? path.join(process.resourcesPath, "icons", "icon.png") // buildado
    : path.join(__dirname, "icons", "icon.png");             // dev

    const win = new BrowserWindow({
        width: maxHeaderSize,
        height: maxHeaderSize,
        icon: iconPath,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            contextIsolation: true,
            nodeIntegration: false,
        },

    });

    win.loadFile('public/index.html');

    // --- REMOVER MENU PADRÃO ---
    win.setMenu(null);

    return win;
}

// --- APP READY ---
app.whenReady().then(() => {
    const mainWindow = createWindow();

    // --- FECHAR APP ---
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});



app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});



