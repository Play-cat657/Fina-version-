// ===== SAVE / LOAD =====
let save = JSON.parse(localStorage.getItem("racingSave")) || {
  money: 2000,
  carIndex: 0,
  upgrades: { engine: 0, turbo: 0, tires: 0 },
  missionsDone: []
};

const cars = [
  { name: "Toyota Supra", baseSpeed: 4 },
  { name: "Nissan GTR", baseSpeed: 5 },
  { name: "Ferrari F8", baseSpeed: 6 },
  { name: "Lamborghini Huracán", baseSpeed: 7 }
];

let currentCar = cars[save.carIndex];

// ===== CANVAS =====
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let player = { x: 100, y: 200, speed: 0 };
let police = { x: -200, y: 200 };
let racing = false;

// ===== MISSÕES =====
const missions = [
  { text: "Vencer uma corrida", reward: 500 },
  { text: "Alcançar velocidade 8", reward: 800 },
  { text: "Ganhar $5000", reward: 1500 }
];

// ===== UI =====
function updateUI() {
  document.getElementById("money").innerText = save.money;
  document.getElementById("carName").innerText = currentCar.name;
  document.getElementById("speed").innerText = getMaxSpeed();
  localStorage.setItem("racingSave", JSON.stringify(save));
}
updateUI();

// ===== VELOCIDADE =====
function getMaxSpeed() {
  return (
    currentCar.baseSpeed +
    save.upgrades.engine +
    save.upgrades.turbo +
    save.upgrades.tires
  );
}

// ===== CONTROLES =====
document.addEventListener("keydown", e => {
  if (!racing) return;
  if (e.key === "ArrowUp") player.speed = getMaxSpeed();
  if (e.key === "ArrowDown") player.speed = 1;
});

document.addEventListener("keyup", () => {
  player.speed = 0;
});

// ===== CORRIDA =====
function startRace() {
  racing = true;
  player.x = 100;
  police.x = -300;
  document.getElementById("screen").innerHTML = "🏁 Corrida iniciada!";
  gameLoop();
}

function gameLoop() {
  if (!racing) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // pista
  ctx.fillStyle = "#555";
  ctx.fillRect(0, 180, 800, 80);

  // jogador
  ctx.fillStyle = "yellow";
  ctx.fillRect(player.x, player.y, 40, 20);
  player.x += player.speed;

  // polícia
  ctx.fillStyle = "blue";
  ctx.fillRect(police.x, police.y, 40, 20);
  police.x += 2;

  // vitória
  if (player.x > 760) {
    winRace();
    return;
  }

  // polícia pega
  if (police.x + 40 > player.x) {
    loseRace();
    return;
  }

  requestAnimationFrame(gameLoop);
}

function winRace() {
  racing = false;
  save.money += 500;
  document.getElementById("screen").innerHTML = "🏆 Você venceu a corrida!";
  checkMissions();
  updateUI();
}

function loseRace() {
  racing = false;
  document.getElementById("screen").innerHTML = "🚓 Polícia te pegou!";
}

// ===== GARAGEM =====
function openGarage() {
  let html = "<h3>🔧 Garagem</h3>";

  html += `<p>Motor (+vel): ${save.upgrades.engine}
  <button onclick="buyUpgrade('engine')">Comprar ($500)</button></p>`;

  html += `<p>Turbo (+vel): ${save.upgrades.turbo}
  <button onclick="buyUpgrade('turbo')">Comprar ($700)</button></p>`;

  html += `<p>Pneus (+vel): ${save.upgrades.tires}
  <button onclick="buyUpgrade('tires')">Comprar ($400)</button></p>`;

  html += "<h4>Trocar Carro</h4>";

  cars.forEach((c, i) => {
    html += `<button onclick="selectCar(${i})">${c.name}</button>`;
  });

  document.getElementById("screen").innerHTML = html;
}

function buyUpgrade(type) {
  const prices = { engine: 500, turbo: 700, tires: 400 };
  if (save.money >= prices[type]) {
    save.money -= prices[type];
    save.upgrades[type]++;
    updateUI();
    openGarage();
  }
}

function selectCar(index) {
  save.carIndex = index;
  currentCar = cars[index];
  updateUI();
}

// ===== MISSÕES =====
function openMissions() {
  let html = "<h3>📜 Missões</h3>";
  missions.forEach((m, i) => {
    html += `<p>${save.missionsDone.includes(i) ? "✅" : "❌"} ${m.text} ($${m.reward})</p>`;
  });
  document.getElementById("screen").innerHTML = html;
}

function checkMissions() {
  if (!save.missionsDone.includes(0)) {
    save.missionsDone.push(0);
    save.money += missions[0].reward;
  }

  if (getMaxSpeed() >= 8 && !save.missionsDone.includes(1)) {
    save.missionsDone.push(1);
    save.money += missions[1].reward;
  }

  if (save.money >= 5000 && !save.missionsDone.includes(2)) {
    save.missionsDone.push(2);
    save.money += missions[2].reward;
  }
// ===== TELA INICIAL =====
function drawIdleScreen() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#444";
  ctx.fillRect(0, 180, 800, 80);

  ctx.fillStyle = "yellow";
  ctx.fillRect(100, 200, 40, 20);

  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText("Clique em CORRIDA para começar", 240, 160);

  requestAnimationFrame(drawIdleScreen);
}

drawIdleScreen();
