const app = document.getElementById('app');
import { loadAlbum } from './albumView.js';
import { loadArtista } from './artistView.js';
import { loadPlaylists, loadPlaylistMusicas } from './playlistView.js';

window.loadPlaylists = loadPlaylists;
window.loadPlaylistMusicas = loadPlaylistMusicas;

window.loadAlbum = loadAlbum;

let cache = [];

// 🔄 LOAD INICIAL
loadHome();

export async function loadHome() {
    const res = await fetch('/api/artistas');
    const data = await res.json();

    cache = data;
    render(data);
}

window.loadHome = loadHome;

// 🎨 RENDER HOME
function render(lista) {
    app.innerHTML = `<div class="home-grid"></div>`;
    const grid = app.querySelector('.home-grid');

    lista.forEach(item => {
        const div = document.createElement('div');
        div.className = 'card';

        div.innerHTML = `
            <img src="${item.cover || ''}">
            <div class="card-title">${item.nome}</div>
            <div>ID: ${item.id || ''}</div>
            <div>${item.genero || ''}</div>
                <button class="delete-btn" data-id="${item.id}">
        🗑 Deletar
    </button>
        `;

        div.onclick = (e) => {
            if (e.target.classList.contains('delete-btn')) return;
            localStorage.setItem("CURRENT_ARTIST_ID", item.id)
            loadArtista(item.id);
        };

        grid.appendChild(div);
    });
}

// 🔍 FILTRO
function filtrar() {
    const termo = document.getElementById('search').value.toLowerCase();

    const filtrados = cache.filter(a =>
        a.nome.toLowerCase().includes(termo)
    );

    render(filtrados);
}

window.filtrar = filtrar;

// 🧊 MODAL
let tipoModal = null;

function abrirModal(tipo) {
    tipoModal = tipo;

    const modal = document.getElementById('modal');
    const body = document.getElementById('modalBody');
    const title = document.getElementById('modalTitle');

    modal.style.display = 'flex';

    if (tipo === 'artista') {
        title.textContent = 'Novo Artista';

        body.innerHTML = `
            <input id="nome" placeholder="Nome">
            <input id="cover" placeholder="Cover">
            <input id="genero" placeholder="Gênero">
            <input id="descricao" placeholder="Descrição">
        `;
    }

    if (tipo === 'album') {
        title.textContent = 'Novo Álbum';

        body.innerHTML = `
            <input id="nome" placeholder="Nome">
            <input id="ano" placeholder="1994">
            <input id="cover" placeholder="Cover">
            <input id="genero" placeholder="Gênero">
            <input id="servidor" placeholder="Servidor">
            <input id="artista_id" placeholder="ID do artista">
        `;
    }

    if (tipo === 'playlists') {
        title.textContent = 'Nova Playlist';

        body.innerHTML = `
            <input id="playlist_nome" placeholder="Nome da playlist">
            <input id="playlist_cover" placeholder="Cover (opcional)">
            <input id="playlist_descricao" placeholder="Descrição">
        `;
    }
}

window.abrirModal = abrirModal;

function fecharModal() {
    document.getElementById('modal').style.display = 'none';
}

window.fecharModal = fecharModal;

// 💾 SALVAR
async function salvarModal() {

    if (tipoModal === 'artista') {
        const nome = document.getElementById('nome').value;
        const cover = document.getElementById('cover').value;
        const genero = document.getElementById('genero').value;
        const descricao = document.getElementById('descricao').value;

        await fetch('/api/artistas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, cover, genero, descricao })
        });
        console.log("Artista adicionado!")
        alert("Artista adicionado!")
    }

    if (tipoModal === 'album') {
        const nome = document.getElementById('nome').value;
        const ano = document.getElementById('ano').value;
        const cover = document.getElementById('cover').value;
        const genero = document.getElementById('genero').value;
        const servidor = document.getElementById('servidor').value;
        const artista_id = document.getElementById('artista_id').value;

        await fetch('/api/albuns', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, ano, cover, genero, artista_id, servidor })
        });
        console.log("Album adicionado!")
        alert("Album adicionado!")
    }

    if (tipoModal === 'playlists') {

        const nome = document.getElementById('playlist_nome').value;
        const cover = document.getElementById('playlist_cover').value;

        if (!nome) {
            alert("Nome da playlist é obrigatório");
            return;
        }

        await fetch('/api/playlists', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nome,
                cover: cover || null,
                descricao: ""
            })
        });

        console.log("Playlist criada!");
        alert("Playlist criada com sucesso!");
    }


    fecharModal();
    loadHome();
}



async function buscarScraper() {
    const url = document.getElementById('scraper-url').value;

    const res = await fetch('/api/scraper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
    });

    const data = await res.json();

    if (!data) return alert("Nada encontrado");

    window.scraperTracks = data.tracks || [];

    // 🔥 usa info.json se existir
    const info = data.info || {};

    document.getElementById('scraper-nome').value =
        info.name || "";

    document.getElementById('scraper-cover').value =
        data.cover || "";

    document.getElementById('scraper-ano').value =
        info.year || "";

    document.getElementById('scraper-genero').value =
        info.genre || "";

    document.getElementById('scraper-servidor').value = 'Scraper';

    const container = document.getElementById('scraper-resultados');

    container.innerHTML = (data.tracks || []).map(t => `
        <div class="track-preview">
            🎵 ${t.title}
        </div>
    `).join('');
}

async function salvarScraper() {
    const nome = document.getElementById('scraper-nome').value;
    const ano = document.getElementById('scraper-ano').value;
    const cover = document.getElementById('scraper-cover').value;
    const genero = document.getElementById('scraper-genero').value;
    const servidor = document.getElementById('scraper-servidor').value;
    const artista_id = document.getElementById('scraper-artista').value;

    const res = await fetch('/api/albuns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            nome,
            ano,
            cover,
            genero,
            servidor,
            artista_id
        })
    });

    const album = await res.json();
    const albumId = album.id;

    // 🚨 AGORA SALVA AS MÚSICAS
    const musicas = window.scraperTracks || [];

    for (const m of musicas) {
        await fetch('/api/musicas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nome: m.title,
                url: m.url,
                album_id: albumId
            })
        });
    }

    fecharScraper();
    loadHome();
    //console.log("TRACKS:", window.scraperTracks); <- DEBUG
    //console.log("ALBUM RESPONSE:", album); <- DEBUG
    console.log("Album adicionado ao artista de id: " + artista_id)
    alert("Album adicionado ao artista de id: " + artista_id)
}

function fecharScraper() {
    document.getElementById('modal-scraper').style.display = 'none';
}

function abrirScraper() {
    document.getElementById('modal-scraper').style.display = 'flex';
}

document.addEventListener('click', async (e) => {
    if (e.target.classList.contains('delete-btn')) {
        const id = e.target.dataset.id;

        const confirmacao = confirm("Tem certeza que deseja deletar este artista?");

        if (!confirmacao) return;

        await fetch(`/api/artistas/${id}`, {
            method: 'DELETE'
        });

        console.log('Artista deletado!')
        loadHome(); // recarrega lista
    }
});

function openMusicPlaylistModal() {
    document.getElementById('music-playlist-modal').style.display = 'flex';
}

window.openMusicPlaylistModal = openMusicPlaylistModal;

function closeMusicPlaylistModal() {
    document.getElementById('music-playlist-modal').style.display = 'none';
}

window.closeMusicPlaylistModal = closeMusicPlaylistModal;

async function saveMusicToPlaylist() {
    const currentPlaylist = localStorage.getItem("CURRENT_PLAYLIST_ID")
    const nome = document.getElementById('music-playlist-modal-name').value;
    const artista = document.getElementById('music-playlist-modal-artist').value;
    const url = document.getElementById('music-playlist-modal-url').value;
    const cover = document.getElementById('music-playlist-modal-cover').value;

    if (!currentPlaylist) {
        alert("Nenhuma playlist selecionada");
        return;
    }

    await fetch(`/api/playlists/${currentPlaylist}/musicas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            nome,
            artista,
            url,
            cover
        })
    });

    console.log("música salva na playlist: " + currentPlaylist)
    alert("música salva na playlist: " + currentPlaylist)
    closeMusicPlaylistModal();
    loadPlaylistMusicas(currentPlaylist);
}

async function deleteMusic(id) {

    const confirmacao = confirm("Deseja realmente excluir esta música?");
    if (!confirmacao) return;

    await fetch(`/api/playlists/musicas/${id}`, {
        method: 'DELETE'
    });


    const currentPlaylist = localStorage.getItem("CURRENT_PLAYLIST_ID")
    console.log("Música deletada da playlist " + currentPlaylist)
    alert("Música deletada da playlist " + currentPlaylist)
    // recarrega playlist atual
    const playlistId = localStorage.getItem("CURRENT_PLAYLIST_ID");
    loadPlaylistMusicas(playlistId);
}

document.getElementById("export-db-btn").addEventListener("click", async () => {
    const confirmacao = confirm("Tem certeza que deseja exportar o banco de dados?");

    if (!confirmacao) {
        return; // cancela a execução
    }

    const res = await fetch("/api/export");
    const data = await res.json();

    if (!data.success) {
        alert("Erro ao exportar DB: " + data.error);
        return;
    }

    alert("Exportado com sucesso!\n" + data.path);
    console.log("Exportado com sucesso!\n" + data.path);
});

window.deleteMusic = deleteMusic;
window.saveMusicToPlaylist = saveMusicToPlaylist;

/* 🔥 ESSENCIAL (sem isso não funciona no onclick) */
window.buscarScraper = buscarScraper;
window.salvarScraper = salvarScraper;
window.fecharScraper = fecharScraper;
window.abrirScraper = abrirScraper;
window.loadAlbum = loadAlbum;
window.loadArtista = loadArtista;
window.salvarModal = salvarModal;