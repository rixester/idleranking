const { initializeApp } = require("firebase/app");
const { getDatabase, ref, push } = require("firebase/database");

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  databaseURL: process.env.DATABASE_URL,
  projectId: process.env.PROJECT_ID
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Método não permitido" };
  }

  const { name, score } = JSON.parse(event.body);

  if (!name || !Number.isInteger(score)) {
    return { statusCode: 400, body: "Dados inválidos" };
  }

  await push(ref(db, "ranking"), { name, score, date: new Date().toISOString() });

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Pontuação salva!" })
  };
};
