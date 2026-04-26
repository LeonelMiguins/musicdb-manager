const express = require("express");
const router = express.Router();
const exportDB = require("../scripts/export-db-json");

router.get("/", async (req, res) => {
    const result = await exportDB();

    if (!result.success) {
        return res.status(500).json(result);
    }

    res.json(result);
});

module.exports = router;