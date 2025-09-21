const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    // Eventos para carregar e manipular dados do banco de dados
    fetchArtistas: () => ipcRenderer.invoke('fetch-artistas'),
    addArtista: (artista) => ipcRenderer.invoke('add-artista', artista),
    fetchAlbuns: () => ipcRenderer.invoke('fetch-albuns'),
    addAlbum: (album) => ipcRenderer.invoke('add-album', album),
    fetchMusicas: () => ipcRenderer.invoke('fetch-musicas'),
    addMusica: (musica) => ipcRenderer.invoke('add-musica', musica),

    // Eventos para abrir modais dentro da aplicação
    onOpenModalArtista: (callback) => ipcRenderer.on('open-modal-artista', callback),
    onOpenModalAlbum: (callback) => ipcRenderer.on('open-modal-album', callback),
    onOpenModalMusica: (callback) => ipcRenderer.on('open-modal-musica', callback),

    // Eventos para exportar banco de dados para arquivos JSON
    exportDBJson: () => ipcRenderer.invoke('export-db-json'),
    exportDBByLetter: () => ipcRenderer.invoke('export-db-letters'),

    /**
     * Scrapes data from the provided archive URL.
     * @param {string} url - The URL to scrape data from.
     * @returns {Promise<any>} - The result of the scraping operation.
     */
    scraperArchive: (url) => ipcRenderer.invoke('scraper-archive', url),
    saveAlbum: (data) => ipcRenderer.invoke("save-album", data),


});

