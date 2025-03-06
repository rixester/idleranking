const { initializeApp } = require("firebase/app");
const { getDatabase, ref, push } = require("firebase/database");

const firebaseConfig = {
  apiKey: "AIzaSyDkqvBB-fqdZFE28XZ8yI-Pvb9JanTy7fQ",
  authDomain: "rixester-a.firebaseapp.com",
  databaseURL: "https://rixester-a.firebaseio.com",
  projectId: "rixester-a",
  storageBucket: "rixester-a.appspot.com",
  messagingSenderId: "749530358235",
  appId: "1:749530358235:web:af8b9cc07610ae632d47fe"
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
