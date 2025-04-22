const NUM_STATIONS = 6;
const bowls = [];
const bowlData = [];
let currentPlayer = 0;

const diceFaces = [
  "./images/toc/die1.png",
  "./images/toc/die2.png",
  "./images/toc/die3.png",
  "./images/toc/die4.png",
  "./images/toc/die5.png",
  "./images/toc/die6.png",
];

const container = document.getElementById("production-line");

for (let i = 0; i < NUM_STATIONS; i++) {
  const station = document.createElement("div");
  station.className = "station";

  const bowl = document.createElement("div");
  bowl.className = "bowl";

  const dice = document.createElement("img");
  dice.className = "dice-img";
  dice.src = diceFaces[0];

  const rollButton = document.createElement("button");
  rollButton.textContent = "Roll";
  rollButton.onclick = () => rollDice(i);
  rollButton.disabled = i !== currentPlayer;

  station.appendChild(bowl);
  station.appendChild(dice);
  station.appendChild(rollButton);
  container.appendChild(station);

  bowls.push({ bowl, dice, rollButton });
  bowlData.push(0);
}

bowlData[0] = 0;
render();

function rollDice(index) {
  if (index !== currentPlayer) return;

  bowls[index].rollButton.disabled = true;
  startDiceAnimation(index);

  setTimeout(() => {
    const roll = rollDie();
    updateDie(index, roll);
    handleMatchstickMove(index, roll);
  }, 2000);
}

function startDiceAnimation(index) {
  bowls[index].dice.classList.add("dice-roll");
  let faceIndex = 0;

  const interval = setInterval(() => {
    faceIndex = Math.floor(Math.random() * diceFaces.length);
    bowls[index].dice.src = diceFaces[faceIndex];
  }, 200);

  setTimeout(() => {
    clearInterval(interval);
    bowls[index].dice.src =
      diceFaces[Math.floor(Math.random() * diceFaces.length)];
    stopDiceAnimation(index);
  }, 2000);
}

function stopDiceAnimation(index) {
  bowls[index].dice.classList.remove("dice-roll");
}

function rollDie() {
  return Math.floor(Math.random() * 6) + 1;
}

function updateDie(index, value) {
  bowls[index].dice.src = diceFaces[value - 1];
  stopDiceAnimation(index);
}

function handleMatchstickMove(index, roll) {
  const available = index == 0 ? roll : bowlData[index - 1];
  const moved = Math.min(roll, available);
  bowlData[index] += moved;
  bowlData[index - 1] -= moved;

  currentPlayer = (currentPlayer + 1) % NUM_STATIONS;
  render();
}

function render() {
  bowls.forEach((station, i) => {
    const { bowl } = station;
    bowl.innerHTML = "";
    for (let j = 0; j < bowlData[i]; j++) {
      const stick = document.createElement("div");
      stick.className = "matchstick";
      bowl.appendChild(stick);
    }
    station.rollButton.disabled = i !== currentPlayer;
  });
}
