const app = document.getElementById('app');

let currentPlaylist = null;

/* =========================
   🎧 LISTAR PLAYLISTS
========================= */
export async function loadPlaylists() {
    const res = await fetch('/api/playlists');
    const playlists = await res.json();

    renderPlaylists(playlists);
}

/* =========================
   🎨 RENDER PLAYLISTS
========================= */
function renderPlaylists(list) {
    app.innerHTML = `
        <h2 class="pl-title">Playlists</h2>

        <div class="pl-grid">
            ${list.map(p => `
                <div class="pl-card" onclick="loadPlaylistMusicas(${p.id})">
                    <img class="pl-cover" src="${p.cover || ''}">
                    <div class="pl-info">
                        <h3 class="pl-name">${p.nome}</h3>
                        <p class="pl-desc">${p.descricao || ''}</p>
                        <p class="pl-desc">${p.artistas || ''}</p>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

/* =========================
   🎧 MUSICAS DA PLAYLIST
========================= */
export async function loadPlaylistMusicas(id) {

    const [playlistRes, musicasRes] = await Promise.all([
        fetch(`/api/playlists/${id}`),
        fetch(`/api/playlists/${id}/musicas`)
    ]);

    const playlist = await playlistRes.json();
    const musicas = await musicasRes.json();

    renderPlaylistView(playlist, musicas);
}
/* =========================
   🎨 RENDER MUSICAS
========================= */
function renderMusicas(musicas) {
    const info = musicas[0] || {}; // pega dados do álbum (se vier junto)

    app.innerHTML = `
        <!-- 🔝 HEADER DA PLAYLIST -->
        <div class="pl-header">
            <img class="pl-header-cover" src="${info.cover || ''}" />

            <div class="pl-header-info">
                <h2 class="pl-header-title">${info.playlist_nome || 'Playlist'}</h2>

                <div class="pl-header-meta">
                    <span>${info.artista || ''}</span>
                    <span>${info.descricao || ''}</span>
                    <span>${info.servidor || ''}</span>
                </div>
            </div>
        </div>

        <button class="pl-back" onclick="loadPlaylists()">⬅ Voltar</button>

        <div class="pl-music-grid">
            ${musicas.map((m, index) => `
                <div class="pl-music-card" onclick="playMusic(${index}, '${m.url}')">
                    <div class="pl-music-name">${m.nome}</div>
                    <div class="pl-music-artist">${m.artista || ''}</div>
                    <button class="pl-play-btn">▶</button>
                </div>
            `).join('')}
        </div>
    `;
}

function renderPlaylistView(playlist, musicas) {
    //salva o id da playlist clicada para ser usada em outros locais
    localStorage.setItem("CURRENT_PLAYLIST_ID", playlist.id)
    app.innerHTML = `
        <div class="pl-header">
            <img class="pl-cover" src="${playlist.cover}">
            
            <div class="pl-info">
                <h1>${playlist.nome}</h1>
                <p>${playlist.descricao || ''}</p>
                <small>${playlist.artista || ''}</small>
                <small>${playlist.servidor || ''}</small>
            </div>

            <button class="pl-add-btn" onclick="openMusicPlaylistModal()">
            + Adicionar música
            </button>

        </div>

        <button class="pl-back" onclick="loadPlaylists()">⬅ Voltar</button>

        <div class="pl-music-grid">
${musicas.map((m, i) => `
    <div class="pl-music-card">
        
        <div class="pl-music-info" onclick="playMusic(${i}, '${m.url}')">
            <div>${m.nome}</div>
            <small>${m.artista || ''}</small>
        </div>

        <button class="pl-delete-btn" onclick="deleteMusic(${m.id})">
            🗑
        </button>

       </div>
       `).join('')}
        </div>
    `;
}

/* GLOBAL */
window.loadPlaylists = loadPlaylists;
window.loadPlaylistMusicas = loadPlaylistMusicas;