let dadosScraper = null;

// =========================
// BUSCAR SCRAPER
// =========================
export async function buscarScraper() {

    const url = document.getElementById('url').value;

    if (!url) {
        alert("Cole uma URL");
        return;
    }

    const res = await fetch('/api/scraper', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url })
    });

    const data = await res.json();

    if (!data) {
        alert("Erro ao buscar álbum");
        return;
    }

    dadosScraper = data;

    renderPreview(data);
}


// =========================
// PREVIEW
// =========================
function renderPreview(data) {

    const preview = document.getElementById('preview');

    preview.innerHTML = `
        <h3>Preview</h3>

        <img src="${data.cover || ''}" width="150">

        <p>
            <strong>${data.tracks.length}</strong> músicas encontradas
        </p>

        <ul class="preview-list">
            ${data.tracks.map(t => `
                <li>${t.title}</li>
            `).join('')}
        </ul>

        <button onclick="salvarScraper()">
            Salvar Álbum
        </button>
    `;
}


// =========================
// SALVAR SCRAPER
// =========================
export async function salvarScraper() {

    if (!dadosScraper) {
        alert("Nenhum dado carregado");
        return;
    }

    const artista_id = document.getElementById('artistaId').value;

    if (!artista_id) {
        alert("Selecione um artista");
        return;
    }

    const nomeAlbum =
        document.getElementById('nomeAlbum').value ||
        dadosScraper.album.split('/').filter(Boolean).pop();

    const ano =
        document.getElementById('anoAlbum').value;

    const servidor =
        document.getElementById('servidor').value;

    // =========================
    // CRIAR ÁLBUM
    // =========================
    const albumRes = await fetch('/api/albuns', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            nome: nomeAlbum,
            artista_id,
            cover: dadosScraper.cover,
            genero: '',
            ano,
            servidor
        })
    });

    const album = await albumRes.json();

    // =========================
    // CRIAR MUSICAS
    // =========================
    for (const track of dadosScraper.tracks) {

        await fetch('/api/musicas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nome: track.title,
                url: track.url,
                album_id: album.id
            })
        });
    }

    alert("Álbum importado!");

    location.reload();
}