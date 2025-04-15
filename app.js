require("dotenv").config();
const express = require("express");
const cors = require("cors");
const sectorRoutes = require("./src/routes/sectorRoutes");
const { db } = require("./src/config/firebase");

const app = express();

const allowedOrigins = [
  "https://sector-delivery-42v1mlkpr-deicys-projects-ea3567ec.vercel.app",
  "http://localhost:3000",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Bloqueado por CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

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
  res.status(500).json({ error: err.message || "Error interno" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
  console.log(`URL del backend: http://localhost:${PORT}`);
  console.log(`Orígenes permitidos: ${allowedOrigins.join(", ")}`);
});
