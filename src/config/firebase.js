const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");

const serviceAccountPath = path.resolve(
  __dirname,
  "../../firebase-credentials.json"
);

let serviceAccount;

try {
  const raw = fs.readFileSync(serviceAccountPath);
  serviceAccount = JSON.parse(raw);
} catch (err) {
  console.error("Error reading firebase-credentials.json:", err.message);
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
module.exports = { admin, db };
