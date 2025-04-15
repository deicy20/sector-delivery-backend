const express = require("express");
const router = express.Router();
const {
  registerSector,
  listSectors,
  getAvailableSectors,
} = require("../controllers/sectorController");

const validateSector = require("../middlewares/sectorValidator");

router.post("/", validateSector, registerSector);
router.get("/", listSectors);
router.get("/available", getAvailableSectors);
module.exports = router;
