let tipoModal = null;
let artistaSelecionado = null;
let albumSelecionado = null;
let dadosScraper = null;
let artistasCache = [];
let albunsCache = [];

// -------- MODAL --------
async function abrirModal(tipo) {
    tipoModal = tipo;

    const modal = document.getElementById('modal');
    const title = document.getElementById('modalTitle');
    const body = document.getElementById('modalBody');

    modal.style.display = 'flex'; 

    

    // -------- ARTISTA --------
    if (tipo === 'artista') {
        title.textContent = 'Adicionar Artista';
        body.innerHTML = `
            <input id="nome" placeholder="Nome">
            <input id="cover" placeholder="URL da capa">
            <input id="genero" placeholder="Gênero">
        `;
    }

    // -------- ALBUM --------
    if (tipo === 'album') {
        title.textContent = 'Adicionar Álbum';

        body.innerHTML = `
            <input id="buscaArtista" placeholder="Buscar artista...">
            <ul id="listaBusca"></ul>

            <input id="artistaId" placeholder="ID do artista" readonly>

            <input id="nome" placeholder="Nome do álbum">
            <input id="cover" placeholder="Cover">
            <input id="genero" placeholder="Gênero">
            <input id="servidor" placeholder="Servidor">
        `;

        carregarBuscaArtistas();
    }

    // -------- MUSICA --------
    if (tipo === 'musica') {
        title.textContent = 'Adicionar Música';

        body.innerHTML = `
            <input id="buscaAlbum" placeholder="Buscar álbum...">
            <ul id="listaBuscaAlbum"></ul>

            <input id="albumId" placeholder="ID do álbum" readonly>

            <input id="nome" placeholder="Nome">
            <input id="url" placeholder="URL">
        `;

        carregarBuscaAlbuns();
    }

    // -------- SCRAPER --------
else if (tipo === 'scraper') {
    title.textContent = 'Importar do Internet Archive';

    body.innerHTML = `
    <input id="url" placeholder="Cole a URL do álbum">

    <button onclick="buscarScraper()">Buscar</button>

    <hr>

    <!-- 🔥 NOVO CAMPO -->
    <input id="nomeAlbum" placeholder="Nome do álbum">

    <input id="buscaArtista" placeholder="Buscar artista...">
    <ul id="listaBusca"></ul>

    <input id="artistaId" placeholder="ID do artista" readonly>

    <hr>

    <div id="preview"></div>
`;

    carregarBuscaArtistas();
}

}

function fecharModal() {
    document.getElementById('modal').style.display = 'none';
}

// -------- SALVAR --------
async function salvarModal() {

    // -------- ARTISTA --------
    if (tipoModal === 'artista') {
        const nome = document.getElementById('nome').value;
        const cover = document.getElementById('cover').value;
        const genero = document.getElementById('genero').value;

        const letra = nome.charAt(0).toUpperCase();

        await fetch('/api/artistas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, cover, genero, letra })
        });

        loadArtistas();
    }

    // -------- ALBUM --------
    if (tipoModal === 'album') {
        const nome = document.getElementById('nome').value;
        const artista_id = document.getElementById('artistaId').value;
        const cover = document.getElementById('cover').value;
        const genero = document.getElementById('genero').value;
        const servidor = document.getElementById('servidor').value;

        await fetch('/api/albuns', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nome,
                artista_id,
                cover,
                genero,
                servidor
            })
        });

        loadArtistas();
    }

    // -------- MUSICA --------
    if (tipoModal === 'musica') {
        const nome = document.getElementById('nome').value;
        const url = document.getElementById('url').value;
        const album_id = document.getElementById('albumId').value;

        await fetch('/api/musicas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nome,
                url,
                album_id
            })
        });

        loadArtistas();
    }

    fecharModal();
}

// -------- LISTAGEM --------
async function loadArtistas() {
    const res = await fetch('/api/artistas');
    artistasCache = await res.json();

    renderArtistas(artistasCache);
}

function renderArtistas(listaData) {
    const lista = document.getElementById('listaArtistas');
    lista.innerHTML = '';

    listaData.forEach(a => {
        const li = document.createElement('li');
        li.textContent = `${a.nome} (ID: ${a.id})`;

        li.onclick = () => {
            artistaSelecionado = a.id;
            loadAlbuns(a.id);
        };

        lista.appendChild(li);
    });
}

async function loadAlbuns(artistaId) {
    const res = await fetch('/api/albuns');
    albunsCache = await res.json();

    const filtrados = albunsCache.filter(a => a.artista_id == artistaId);
    renderAlbuns(filtrados);
}

function renderAlbuns(listaData) {
    const lista = document.getElementById('listaAlbuns');
    lista.innerHTML = '';

    listaData.forEach(a => {
        const li = document.createElement('li');

        li.innerHTML = `
            <div class="album-item">
                <img src="${a.cover || 'https://i.scdn.co/image/ab67616d00001e0235eeb40f2fa70b35d9c48ece'}" />
                <span>${a.nome}</span>
            </div>
        `;

        li.onclick = () => {
            albumSelecionado = a.id;
            loadMusicas(a.id);
        };

        lista.appendChild(li);
    });
}

function filtrar() {
    const termo = document.getElementById('search').value.toLowerCase();

    // filtrar artistas
    const artistasFiltrados = artistasCache.filter(a =>
        a.nome.toLowerCase().includes(termo)
    );

    renderArtistas(artistasFiltrados);

    // filtrar álbuns também
    const albunsFiltrados = albunsCache.filter(a =>
        a.nome.toLowerCase().includes(termo)
    );

    renderAlbuns(albunsFiltrados);
}

async function loadMusicas(albumId) {
    const res = await fetch('/api/musicas');
    const musicas = await res.json();

    const lista = document.getElementById('listaMusicas');
    lista.innerHTML = '';

    musicas
        .filter(m => m.album_id == albumId)
        .forEach(m => {
            const li = document.createElement('li');
            li.textContent = m.nome;

            li.onclick = () => new Audio(m.url).play();

            lista.appendChild(li);
        });
}

async function carregarBuscaArtistas() {
    const res = await fetch('/api/artistas');
    const artistas = await res.json();

    const input = document.getElementById('buscaArtista');
    const lista = document.getElementById('listaBusca');

    input.addEventListener('input', () => {
        const valor = input.value.toLowerCase();
        lista.innerHTML = '';

        artistas
            .filter(a => a.nome.toLowerCase().includes(valor))
            .forEach(a => {
                const li = document.createElement('li');
                li.textContent = `${a.nome} (ID: ${a.id})`;

                li.onclick = () => {
                    document.getElementById('artistaId').value = a.id;
                    lista.innerHTML = '';
                    input.value = a.nome;
                };

                lista.appendChild(li);
            });
    });
}

async function carregarBuscaAlbuns() {
    const res = await fetch('/api/albuns');
    const albuns = await res.json();

    const input = document.getElementById('buscaAlbum');
    const lista = document.getElementById('listaBuscaAlbum');

    input.addEventListener('input', () => {
        const valor = input.value.toLowerCase();
        lista.innerHTML = '';

        albuns
            .filter(a => a.nome.toLowerCase().includes(valor))
            .forEach(a => {
                const li = document.createElement('li');
                li.textContent = `${a.nome} (ID: ${a.id})`;

                li.onclick = () => {
                    document.getElementById('albumId').value = a.id;
                    lista.innerHTML = '';
                    input.value = a.nome;
                };

                lista.appendChild(li);
            });
    });
}

async function exportar() {
    const res = await fetch('/api/export');
    const data = await res.json();

    if (data.success) {
        alert('Exportado com sucesso!\n' + data.path);
    } else {
        alert('Erro: ' + data.error);
    }
}

async function buscarScraper() {
    const url = document.getElementById('url').value;

    const res = await fetch('/api/scraper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
    });

    const data = await res.json();
    dadosScraper = data;

    renderPreview(data);
}

function renderPreview(data) {
    const div = document.getElementById('preview');

    if (!data) {
        div.innerHTML = 'Erro ao carregar';
        return;
    }

    div.innerHTML = `
        <h3>Preview</h3>
        <img src="${data.cover || ''}" width="120"><br><br>

        <strong>${data.tracks.length} músicas encontradas</strong>

        <ul style="max-height:150px; overflow:auto;">
            ${data.tracks.map(t => `<li>${t.title}</li>`).join('')}
        </ul>

        <button onclick="salvarScraper()">Salvar no banco</button>
    `;
}

async function salvarScraper() {
    if (!dadosScraper) return alert('Nenhum dado carregado');

    const artista_id = document.getElementById('artistaId').value;

    if (!artista_id) {
        return alert('Selecione um artista!');
    }

    // 🔥 pega nome digitado OU automático
    const nomeDigitado = document.getElementById('nomeAlbum').value;

    const nomeAlbum = nomeDigitado || dadosScraper.album
        .split('/')
        .filter(Boolean)
        .pop();

    // 1. cria álbum
    const albumRes = await fetch('/api/albuns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            nome: nomeAlbum,
            artista_id,
            cover: dadosScraper.cover,
            genero: '',
            servidor: 'Internet Archive'
        })
    });

    const album = await albumRes.json();
    const albumId = album.id;

    // 2. cria músicas
    for (const track of dadosScraper.tracks) {
        await fetch('/api/musicas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nome: track.title,
                url: track.url,
                album_id: albumId
            })
        });
    }

    alert('Importado com sucesso!');
    fecharModal();
    loadArtistas();
}
// INIT
loadArtistas();