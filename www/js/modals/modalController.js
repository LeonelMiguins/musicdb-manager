import { renderArtistaModal } from "./artistaModal.js";
import { renderPlaylistModal } from "./playlistModal.js";
import { renderScraperModal } from "./scraperModal.js";
import { renderAlbumModal } from "./albumModal.js";
import { carregarBuscaArtistas } from "../utils/artistaSearch.js";

let tipoModal = null;

export function abrirModal(tipo) {
  tipoModal = tipo;

  const modal = document.getElementById("modal");
  const body = document.getElementById("modalBody");
  const title = document.getElementById("modalTitle");

  modal.style.display = "flex";

  if (tipo === "artista") {
    title.textContent = "Novo Artista";
    body.innerHTML = renderArtistaModal();
  }

  if (tipo === "album") {
    title.textContent = "Novo Álbum";
    body.innerHTML = renderAlbumModal();
  }

  if (tipo === "playlists") {
    title.textContent = "Nova Playlist";
    body.innerHTML = renderPlaylistModal();
  }

  if (tipo === "scraper") {

    title.textContent = "Importar Álbum";

    body.innerHTML = renderScraperModal();

    setTimeout(() => {
      carregarBuscaArtistas();
    }, 0);
  }
}

export function fecharModal() {
  document.getElementById("modal").style.display = "none";
}

export function getTipoModal() {
  return tipoModal;
}