export async function carregarBuscaArtistas() {

    const res = await fetch('/api/artistas');
    const artistas = await res.json();

    const modal = document.getElementById('modal');

    const input = modal.querySelector('#buscaArtista');
    const lista = modal.querySelector('#listaBusca');
    const artistaId = modal.querySelector('#artistaId');

    if (!input || !lista || !artistaId) return;

    input.oninput = () => {

        const valor = input.value.toLowerCase();

        lista.innerHTML = '';

        if (!valor) return;

        artistas
            .filter(a =>
                a.nome.toLowerCase().includes(valor)
            )
            .forEach(a => {

                const li = document.createElement('li');

                li.textContent = a.nome;
                li.style.cursor = "pointer";

                li.onclick = () => {

                    artistaId.value = a.id;

                    input.value = a.nome;

                    lista.innerHTML = '';
                };

                lista.appendChild(li);
            });
    };
}