export async function loadArtista(id) {
    const app = document.getElementById('app');

    const resArtista = await fetch(`/api/artistas/${id}`);
    const artista = await resArtista.json();

    const resAlbuns = await fetch(`/api/albuns?artista_id=${id}`);
    const albuns = await resAlbuns.json();

    app.innerHTML = `
        <div class="artist-page">

            <button class="back-btn" onclick="loadHome()">⬅ Voltar</button>

            <!-- ARTISTA -->
            <div class="artist-header">

                <img class="artist-img" src="${artista.cover}" />

                <h2>${artista.nome}</h2>

                <div class="artist-meta">
                    <span>ID: ${artista.id}</span>
                    <span>${artista.genero || '-'}</span>
                    <span>${artista.servidor || '-'}</span>
                </div>

                <p class="artist-desc">
                    ${artista.descricao || ''}
                </p>
            </div>

            <hr>

            <!-- ÁLBUNS -->
            <br>
            <h1>Álbuns</h1>
            <br>

            <div class="albuns-grid">
                ${albuns.map(album => `
                    <div class="album-card" onclick="loadAlbum(${album.id})">
                        <img src="${album.cover}" />
                        <div>${album.nome}</div>
                    </div>
                `).join('')}
            </div>

        </div>
    `;
}