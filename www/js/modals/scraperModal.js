export function renderScraperModal() {
    return `
        <div class="scraper-layout">

            <div class="scraper-left">

                <input id="url" placeholder="URL do álbum">

                <button onclick="buscarScraper()">
                    Buscar
                </button>

                <hr>

                <input id="nomeAlbum" placeholder="Nome do álbum">
                <input id="anoAlbum" placeholder="Ano">
                <input id="servidor" placeholder="Servidor">

                <hr>

                <input id="buscaArtista" placeholder="Buscar artista">
                <ul id="listaBusca"></ul>

                <input id="artistaId" readonly placeholder="ID artista">

                <button onclick="salvarScraper()">
                    Salvar Álbum
                </button>

            </div>

            <div class="scraper-right">
                <div id="preview"></div>
            </div>

        </div>
    `;
}