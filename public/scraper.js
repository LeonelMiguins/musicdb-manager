const scrapeBtn = document.getElementById('scrapeBtn');
const resultsDiv = document.getElementById('results');
const saveBtn = document.getElementById('saveBtn');

let lastScrapedData = null;

// Função para extrair os dados do scraper e mostrar no HTML
scrapeBtn.addEventListener('click', async () => {
  const url = document.getElementById('url').value.trim();
  const albumName = document.getElementById('albumName').value.trim();
  const artistId = document.getElementById('artistId').value.trim();

  if (!url || !albumName || !artistId) {
    return alert("Preencha URL, Nome do Álbum e ID do Artista!");
  }

  try {
    // Chama o scraper via IPC
    const data = await window.api.scraperArchive(url);

    if (!data) {
      resultsDiv.innerHTML = "Erro ao buscar dados.";
      return;
    }

    // Adiciona os dados extras necessários para salvar
    lastScrapedData = {
      artista_id: Number(artistId), // garante que seja número
      nome: albumName,
      cover: data.cover || null,
      genero: data.genero || null,
      servidor: data.album || url, // caso não tenha servidor, usa a URL
      tracks: data.tracks || []
    };

    // Monta HTML para exibir resultado
    let html = `<h3>${albumName}</h3>`;
    if (lastScrapedData.cover) {
      html += `<img src="${lastScrapedData.cover}" alt="Capa do Álbum" style="max-width:200px; display:block; margin-bottom:10px;">`;
    }

    if (lastScrapedData.tracks.length > 0) {
      html += "<ul>";
      lastScrapedData.tracks.forEach(t => {
        html += `<li>${t.title} - <a href="${t.url}" target="_blank">Ouvir</a></li>`;
      });
      html += "</ul>";
    } else {
      html += "<p>Nenhuma faixa encontrada.</p>";
    }

    resultsDiv.innerHTML = html;
    saveBtn.style.display = "block";

  } catch (err) {
    console.error("Erro no scraping:", err);
    resultsDiv.innerHTML = "Erro ao buscar dados.";
  }
});

// Salvar no banco
saveBtn.addEventListener('click', async () => {
  if (!lastScrapedData) return;

  try {
    const result = await window.api.saveAlbum(lastScrapedData);

    if (result && result.success) {
      alert(`Álbum salvo com sucesso! ID gerado: ${result.id}`);
      saveBtn.style.display = "none";
      resultsDiv.innerHTML = ""; // limpa resultados
      lastScrapedData = null;
    } else {
      console.error("Erro ao salvar no banco:", result?.error);
      alert("Erro ao salvar no banco.");
    }
  } catch (err) {
    console.error("Erro ao salvar:", err);
    alert("Erro ao salvar no banco.");
  }
});
