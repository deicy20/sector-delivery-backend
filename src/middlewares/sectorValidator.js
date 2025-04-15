const { body } = require("express-validator");

const validateSector = [
  body("nombre").notEmpty().withMessage("El nombre es obligatorio"),
  body("direccion").notEmpty().withMessage("La dirección es obligatoria"),

  body("coordenadas.lat")
    .isFloat({ min: -90, max: 90 })
    .withMessage("Latitud inválida"),

  body("coordenadas.lng")
    .isFloat({ min: -180, max: 180 })
    .withMessage("Longitud inválida"),

  body("horarios")
    .custom(
      (value) =>
        typeof value === "object" &&
        value !== null &&
        Object.keys(value).length > 0
    )
    .withMessage("Horarios obligatorios"),
];

module.exports = validateSector;
