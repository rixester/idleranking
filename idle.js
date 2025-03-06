// Inicializando o Firebase
import initializeApp from "https://cors-anywhere.herokuapp.com/http://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, push, onValue } from "http://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyDkqvBB-fqdZFE28XZ8yI-Pvb9JanTy7fQ",
  authDomain: "rixester-a.firebaseapp.com",
  databaseURL: "http://rixester-a.firebaseio.com",
  projectId: "rixester-a",
  storageBucket: "rixester-a.appspot.com",
  messagingSenderId: "749530358235",
  appId: "1:749530358235:web:af8b9cc07610ae632d47fe"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

let coins = parseInt(localStorage.getItem("coins")) || 0;
let autoClicks = parseInt(localStorage.getItem("autoClicks")) || 0;
let autoClickLevel = parseInt(localStorage.getItem("autoClickLevel")) || 0; // Nível do auto-click
let autoClickCost = 10; // Custo inicial de auto-click
let levelLimit = 25; // Limite de níveis até o próximo aumento de ganho
let gainPerSecond = 1; // Geração inicial de moedas por segundo
const coinSpan = document.getElementById("coins");
const clickBtn = document.getElementById("clickBtn");
const autoUpgradeBtn = document.getElementById("autoUpgrade");
const upInfo = document.getElementById("upInfo");
const progressBar = document.getElementById("progressBar"); // A barra de progresso
const resetBtn = document.getElementById("resetBtn");

clickBtn.addEventListener("click", () => {
  coins++;
  updateCoins();
});

autoUpgradeBtn.addEventListener("click", () => {
  if (coins >= autoClickCost) {
    coins -= autoClickCost;
    autoClicks++;
    autoClickLevel++;
	
	document.getElementById("progressBar").innerText = `(${autoClickLevel}/${levelLimit})`;
	autoClickCost = Math.floor(autoClickCost * 1.10); // Aumenta o custo em 10%
    // A cada 25 níveis, o ganho por segundo (auto-clique) aumenta
    if (autoClickLevel % levelLimit === 0) {
      gainPerSecond *= 2; // Dobra o ganho por segundo
      levelLimit += 25; // Aumenta o limite para o próximo aumento de ganho
    }

    updateCoins();
    saveGame();
  }
});

resetBtn.addEventListener("click", () => {
  resetGame();
});

function updateCoins() {
  coinSpan.innerText = coins;
    upInfo.innerText = `${autoClicks}p/s`;
    document.getElementById("autoUpgrade").innerText = `Auto Click (${autoClickCost})`;
	document.getElementById("progressBar").innerText = `(${autoClickLevel}/${levelLimit})`;

  // Atualiza a barra de progresso
  const progress = (autoClickLevel % 25) / 25 * 100; // Calcula o progresso do nível atual
  progressBar.style.width = `${progress}%`; // Atualiza a barra de progresso
}

function saveGame() {
  localStorage.setItem("coins", coins);
  localStorage.setItem("autoClicks", autoClicks);
  localStorage.setItem("autoClickLevel", autoClickLevel);
  localStorage.setItem("autoClickCost", autoClickCost);
  localStorage.setItem("gainPerSecond", gainPerSecond);
}

function resetGame() {
  coins = 0;
  autoClicks = 0;
  autoClickLevel = 0;
  autoClickCost = 10
  gainPerSecond = 1; // Reinicia o ganho por segundo
  levelLimit = 25; // Reseta o limite de níveis
  document.getElementById("autoUpgrade").innerText = `Auto Click 10`;
  updateCoins();
  saveGame();
}

setInterval(() => {
  coins += autoClicks * gainPerSecond; // O ganho por segundo é multiplicado pelos autoClicks
  updateCoins();
  saveGame();
}, 1000);

window.onload = () => {
  gainPerSecond = parseInt(localStorage.getItem("gainPerSecond")) || 1;
  autoClickCost = parseInt(localStorage.getItem("autoClickCost")) || 10; // Recupera o custo do auto-click salvo
  autoClickLevel = parseInt(localStorage.getItem("autoClickLevel")) || 0;
  levelLimit = autoClickLevel >= 25 ? Math.floor(autoClickLevel / 25) * 25 + 25 : 25;
  updateCoins();
  showRanking();
};

async function sendScore(name, score) {
  push(ref(database, "ranking"), {
    name: name,
    score: score,
    date: new Date().toISOString()
  });
}

setInterval(() => {
  sendScore("Jogador", coins);
  console.log("Pontuação enviada!");
}, 10000);

function showRanking() {
  const rankingRef = ref(database, "ranking");
  onValue(rankingRef, (snapshot) => {
    console.clear();
    console.log("Ranking Online:");
    snapshot.forEach((child) => {
      const data = child.val();
      console.log(`${data.name}: ${data.score} moedas`);
    });
  });
}


