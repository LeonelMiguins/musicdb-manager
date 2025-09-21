const artistasList = document.getElementById('artistas-list');
const albunsList = document.getElementById('albuns-list');
const musicasList = document.getElementById('musicas-list');
const player = document.getElementById('player');

const modalArtista = document.getElementById('modal-artista');
const modalAlbum = document.getElementById('modal-album');
const modalMusica = document.getElementById('modal-musica');

let artistas = [];
let albuns = [];
let musicas = [];

// ------------------- MODAIS -------------------
document.querySelectorAll('.btn-close').forEach(btn => {
    btn.addEventListener('click', () => {
        btn.closest('.modal').style.display = 'none';
    });
});

document.getElementById('btn-open-artista').addEventListener('click', () => modalArtista.style.display = 'block');
document.getElementById('btn-open-album').addEventListener('click', openModalAlbum);
document.getElementById('btn-open-musica').addEventListener('click', openModalMusica);

// ------------------- BOTÕES ADICIONAR -------------------
function getLetraInicial(nome) {
    if (!nome) return '';
    return nome.trim().charAt(0).toUpperCase(); // a pega a primeira letra e transforma em maiúscula
}

document.getElementById('btn-add-artista').addEventListener('click', async () => {
    const nome = document.getElementById('input-artista-nome').value.trim();
    const genero = document.getElementById('input-artista-genero').value.trim();
    const cover = document.getElementById('input-artista-capa').value.trim();
    const letra = getLetraInicial(nome);

    if (!nome) return alert('Digite o nome do artista!');

    await window.api.addArtista({ nome, genero, cover, letra });
    modalArtista.style.display = 'none';
    loadArtistas();
});

document.getElementById('btn-add-album').addEventListener('click', async () => {
    const nome = document.getElementById('input-album-nome').value.trim();
    const cover = document.getElementById('input-album-capa').value.trim();
    const artista_id = document.getElementById('select-album-artista').value;
    const servidor = document.getElementById('input-album-servidor').value.trim();
    if (!nome || !artista_id) return alert('Preencha o nome e selecione o artista!');

    await window.api.addAlbum({ nome, cover, artista_id, servidor });
    modalAlbum.style.display = 'none';
    loadAlbuns(parseInt(artista_id));
});

document.getElementById('btn-add-musica').addEventListener('click', async () => {
    const nome = document.getElementById('input-musica-nome').value.trim();
    const url = document.getElementById('input-musica-url').value.trim();
    const album_id = document.getElementById('select-musica-album').value;

    if (!nome || !url || !album_id) return alert('Preencha nome, link e selecione o álbum!');

    await window.api.addMusica({ nome, url, album_id });
    modalMusica.style.display = 'none';
    loadMusicas(parseInt(album_id));
});

document.getElementById('btn-export-db').addEventListener('click', async () => {
    const result = await window.api.exportDBJson();
    if (result.success) {
        alert(`Exportação concluída! Arquivo gerado em:\n${result.path}`);
    } else {
        alert(`Erro ao exportar banco:\n${result.error}`);
    }
});

document.getElementById('btn-export-db-letters').addEventListener('click', async () => {
    const result = await window.api.exportDBByLetter();
    if (result.success) {
        alert(`Exportação concluída! Arquivo gerado em:\n${result.path}`);
    } else {
        alert(`Erro ao exportar banco:\n${result.error}`);
    }
});


// ------------------- CARREGAR E RENDERIZAR -------------------
async function loadArtistas() {
    artistas = await window.api.fetchArtistas();
    renderArtistas();
}

function renderArtistas() {
    artistasList.innerHTML = '';
    artistas.forEach(a => {
        const div = document.createElement('div');
        div.classList.add('card');
        div.innerHTML = `${a.nome} <strong>[Id: ${a.id}]</strong>`;
        div.addEventListener('click', () => {
            localStorage.setItem('selectedArtistaId', a.id);
            loadAlbuns(a.id);
        });
        artistasList.appendChild(div);
    });
}

async function loadAlbuns(artistaId) {
    const allAlbuns = await window.api.fetchAlbuns();
    albuns = allAlbuns.filter(a => a.artista_id === artistaId);
    renderAlbuns();
    musicasList.innerHTML = '';
}

function renderAlbuns() {
    albunsList.innerHTML = '';
    albuns.forEach(a => {
        const div = document.createElement('div');
        div.classList.add('card');
        div.innerHTML = `<img src="${a.cover}" alt="${a.nome}"><div>${a.nome}</div>`;
        div.addEventListener('click', () => {
            localStorage.setItem('selectedAlbumId', a.id);
            localStorage.setItem('selectedArtistaId', a.artista_id);
            loadMusicas(a.id);
        });
        albunsList.appendChild(div);
    });
}

async function loadMusicas(albumId) {
    const allMusicas = await window.api.fetchMusicas();
    musicas = allMusicas.filter(m => m.album_id === albumId);
    renderMusicas();
}

function renderMusicas() {
    musicasList.innerHTML = '';
    musicas.forEach(m => {
        const li = document.createElement('li');
        li.textContent = m.nome;
        li.addEventListener('click', () => {
            player.pause();
            player.src = m.url;
            player.play();
        });
        musicasList.appendChild(li);
    });
}

// ------------------- MODAIS COM SELEÇÃO AUTOMÁTICA -------------------
function openModalAlbum() {
    const select = document.getElementById('select-album-artista');
    select.innerHTML = '';
    artistas.forEach(a => {
        const option = document.createElement('option');
        option.value = a.id;
        option.textContent = a.nome;
        if (localStorage.getItem('selectedArtistaId') == a.id) option.selected = true;
        select.appendChild(option);
    });
    modalAlbum.style.display = 'block';
}

function openModalMusica() {
    const select = document.getElementById('select-musica-album');
    select.innerHTML = '';
    window.api.fetchAlbuns().then(allAlbuns => {
        allAlbuns.forEach(a => {
            const option = document.createElement('option');
            option.value = a.id;
            option.textContent = a.nome;
            if (localStorage.getItem('selectedAlbumId') == a.id) option.selected = true;
            select.appendChild(option);
        });
        modalMusica.style.display = 'block';
    });
}

const modalInfo = document.getElementById('modal-info');
const infoArtistas = document.getElementById('info-artistas');
const infoAlbuns = document.getElementById('info-albuns');
const infoMusicas = document.getElementById('info-musicas');

// Abrir modal ao clicar no botão
document.getElementById('btn-open-info').addEventListener('click', async () => {
    const artistas = await window.api.fetchArtistas();
    const albuns = await window.api.fetchAlbuns();
    const musicas = await window.api.fetchMusicas();

    infoArtistas.textContent = `Total de artistas: ${artistas.length}`;
    infoAlbuns.textContent = `Total de álbuns: ${albuns.length}`;
    infoMusicas.textContent = `Total de músicas: ${musicas.length}`;

    modalInfo.style.display = 'block';
});

// Fechar modal
modalInfo.querySelector('.btn-close').addEventListener('click', () => {
    modalInfo.style.display = 'none';
});



// ------------------- INICIALIZAÇÃO -------------------
loadArtistas();
