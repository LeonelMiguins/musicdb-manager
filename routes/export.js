import express from 'express';

import fs from 'fs';
import path from 'path';

import {
    exportDB
}
from '../scripts/exportDB.js';

const router =
    express.Router();

router.get(
    '/db-json',

    async (req, res) => {

        try {

            const data =
                await exportDB();

            const tempDir =
                path.resolve('./temp');

            if (
                !fs.existsSync(tempDir)
            ) {

                fs.mkdirSync(tempDir);

            }

            const filePath =
                path.join(

                    tempDir,

                    `fenix-backup-${Date.now()}.json`

                );

            fs.writeFileSync(

                filePath,

                JSON.stringify(
                    data,
                    null,
                    2
                )

            );

            res.download(filePath);

        } catch (err) {

            console.log(err);

            res.status(500).json({

                error:
                    err.message

            });

        }

    }
);

export default router;