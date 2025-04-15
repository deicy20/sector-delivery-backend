const { validationResult } = require("express-validator");
const { createSector, getSectors } = require("../services/sectorService");

exports.registerSector = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const id = await createSector(req.body);
    res.status(201).json({ id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.listSectors = async (req, res) => {
  try {
    const sectors = await getSectors();
    res.status(200).json(sectors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const haversineDistance = (coords1, coords2) => {
  const toRad = (x) => (x * Math.PI) / 180;

  const R = 6371;
  const dLat = toRad(coords2.lat - coords1.lat);
  const dLon = toRad(coords2.lng - coords1.lng);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(coords1.lat)) *
      Math.cos(toRad(coords2.lat)) *
      Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

exports.getAvailableSectors = async (req, res) => {
  const { lat, lng } = req.query;

  if (!lat || !lng)
    return res.status(400).json({ error: "Lat y lng requeridos" });

  try {
    const allSectors = await getSectors();

    const now = new Date();
    const day = now
      .toLocaleDateString("es-CO", { weekday: "long" })
      .toLowerCase();
    const time = now.toTimeString().slice(0, 5); // HH:mm

    const available = allSectors.filter((sector) => {
      const distance = haversineDistance(
        { lat: parseFloat(lat), lng: parseFloat(lng) },
        sector.coordenadas
      );

      const horarios = sector.horarios?.[day];
      if (!horarios || horarios.length !== 2) return false;

      return distance <= 5 && time >= horarios[0] && time <= horarios[1];
    });

    res.status(200).json(available);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
