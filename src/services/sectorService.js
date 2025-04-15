const { db } = require("../config/firebase");

const createSector = async (data) => {
  const sector = {
    ...data,
    createdAt: new Date(),
  };

  const res = await db.collection("sectors").add(sector);
  return res.id;
};

const getSectors = async () => {
  const snapshot = await db.collection("sectors").get();
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

module.exports = { createSector, getSectors };
