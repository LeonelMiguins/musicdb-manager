export function exportDatabaseJson() {

    window.location.href =
        '/api/export/db-json';

}

document
    .getElementById(
        'export-db-to-json'
    )
    .addEventListener(
        'click',
        exportDatabaseJson
    );