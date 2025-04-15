require("dotenv").config();
const express = require("express");
const cors = require("cors");
const sectorRoutes = require("./src/routes/sectorRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/sectors", sectorRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
