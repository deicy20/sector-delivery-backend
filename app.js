require("dotenv").config();
const express = require("express");
const cors = require("cors");
const sectorRoutes = require("./src/routes/sectorRoutes");
const { db } = require("./src/config/firebase");

const app = express();

const allowedOrigins = [
  "https://sector-delivery-app.vercel.app",
  "https://sector-delivery-42v1mlkpr-deicys-projects-ea3567ec.vercel.app",
  "http://localhost:3000",
];

app.use((req, res, next) => {
  console.log(
    `[${new Date().toISOString()}] ${req.method} ${req.path} - Origin: ${
      req.headers.origin
    }`
  );
  next();
});

const corsOptions = {
  origin: function (origin, callback) {
    if (
      !origin ||
      allowedOrigins.some(
        (allowed) =>
          origin === allowed ||
          origin.includes(
            allowed.replace("https://", "").replace("http://", "")
          )
      )
    ) {
      callback(null, true);
    } else {
      console.warn(`⚠️ Origen bloqueado: ${origin}`);
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.options("*", cors(corsOptions));
app.use(cors(corsOptions));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    status: "API funcionando",
    endpoints: {
      sectors: "/api/sectors",
      available: "/api/sectors/available?lat=XX&lng=XX",
    },
  });
});

app.use("/api/sectors", sectorRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);

  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({
      error: "Origen no permitido",
      allowedOrigins,
    });
  }

  res.status(500).json({ error: "Error interno del servidor" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 Servidor funcionando en puerto ${PORT}`);
  console.log("🔒 Orígenes permitidos:");
  allowedOrigins.forEach((origin) => console.log(`- ${origin}`));
  console.log(`\n📌 URL Local: http://localhost:${PORT}`);
  console.log(`🌐 URL Remota: https://sector-delivery-backend.onrender.com\n`);
});
