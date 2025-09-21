// script para exportar a base de dados em múltiplos arquivos JSON por letra inicial do artista

const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

async function exportDBByLetter() {
    const dbPath = path.join(__dirname, '../db/musicas.db');
    const db = new sqlite3.Database(dbPath);

    const getAll = (sql) => new Promise((resolve, reject) => {
        db.all(sql, (err, rows) => err ? reject(err) : resolve(rows));
    });

    try {
        const artistas = await getAll('SELECT * FROM artistas');
        const albuns = await getAll('SELECT * FROM albuns');
        const musicas = await getAll('SELECT * FROM musicas');

        // Agrupa por letra inicial
        const artistasPorLetra = {};
        artistas.forEach(artista => {
            const letra = artista.nome[0].toUpperCase();
            if (!/[A-Z]/.test(letra)) return; // ignora se não for letra
            if (!artistasPorLetra[letra]) artistasPorLetra[letra] = [];
            artistasPorLetra[letra].push(artista);
        });

        // Cria pasta de output se não existir
        const outputDir = path.join(__dirname, '../output/database-by-letters');
        if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

        // Para cada letra, cria um JSON separado
        for (const letra of Object.keys(artistasPorLetra)) {
            const exportData = artistasPorLetra[letra].map(artista => {
                const artistaAlbuns = albuns.filter(a => a.artista_id === artista.id);
                return {
                    id: artista.id,         
                    nome: artista.nome,
                    genero: artista.genero,
                    cover: artista.cover,
                    albuns: artistaAlbuns.map(album => {
                        const albumMusicas = musicas.filter(m => m.album_id === album.id);
                        return {
                            id: album.id,       
                            nome: album.nome,
                            cover: album.cover,
                            servidor: album.servidor,
                            tracks: albumMusicas.map(m => ({
                                id: m.id,       
                                title: m.nome,
                                url: m.url
                            }))
                        };
                    })
                };
            });

            const outputPath = path.join(outputDir, `${letra}.json`);
            fs.writeFileSync(outputPath, JSON.stringify(exportData, null, 2), 'utf-8');
            console.log(`Exportação da letra ${letra} concluída: ${outputPath}`);
        }

        db.close();
        return { success: true, message: 'Exportação completa por letra!' };

    } catch (err) {
        db.close();
        console.error('Erro na exportação:', err.message);
        return { success: false, error: err.message };
    }
}

module.exports = exportDBByLetter;
