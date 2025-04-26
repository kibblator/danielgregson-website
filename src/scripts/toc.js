const NUM_STATIONS = 6;
const bowls = [];
const bowlData = [];
let currentPlayer = 0;
let wastePercentage = 0;
let maxAvailable = 0;
let totalWasted = 0;
let totalMoved = 0;

let lifetimeAvailable = 0;
let lifetimeWasted = 0;

const lifetimeWastedSpan = document.createElement("span");
lifetimeWastedSpan.innerText = "Lifetime Wastage 0%";

const diceFaces = [
  "./images/toc/die1.png",
  "./images/toc/die2.png",
  "./images/toc/die3.png",
  "./images/toc/die4.png",
  "./images/toc/die5.png",
  "./images/toc/die6.png",
];

const container = document.getElementById("production-line");

function createStations() {
  for (let i = 0; i < NUM_STATIONS; i++) {
    const station = document.createElement("div");
    station.className = "station";

    const bowl = document.createElement("div");
    bowl.className = "bowl";

    const dice = document.createElement("img");
    dice.addEventListener("click", async () => await rollDice(i));
    dice.className = "dice-img";
    if (i !== currentPlayer) {
      dice.classList.add("disabled");
    }
    dice.src = diceFaces[0];

    const wastePercentageSpan = document.createElement("span");
    wastePercentageSpan.innerText = "Waste 0%";

    station.appendChild(bowl);
    station.appendChild(dice);
    station.appendChild(wastePercentageSpan);
    container.appendChild(station);

    bowls.push({ bowl, dice, wastePercentageSpan });
    bowlData.push(0);
  }

  const rollAllContainer = document.createElement("div");
  rollAllContainer.className = "roll-all-container";

  const rollAll = document.createElement("button");
  rollAll.className = "roll-all";
  rollAll.innerText = "Roll Round";
  rollAll.onclick = () => rollAllInSequence();

  rollAllContainer.appendChild(rollAll);
  rollAllContainer.appendChild(lifetimeWastedSpan);

  container.appendChild(rollAllContainer);
}

async function rollAllInSequence() {
  for (var i = 0; i < NUM_STATIONS; i++) {
    await rollDice(i);
  }
}

async function rollDice(index) {
  if (index !== currentPlayer) return;

  bowls[index].dice.classList.add("disabled");

  startDiceAnimation(index);
  await wait(2000);
  const roll = rollDie();
  updateDie(index, roll);
  handleMatchstickMove(index, roll);
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
  if (index == 0) {
    available = roll;
    maxAvailable = roll;
    lifetimeAvailable += maxAvailable;
  } else {
    available = bowlData[index - 1];
  }

  const moved = Math.min(roll, available);
  const waste = Math.round(((available - moved) / available) * 100);

  bowls[index].wastePercentageSpan.innerText = `Waste ${waste}%`;

  bowlData[index] += moved;
  bowlData[index - 1] -= moved;

  currentPlayer = (currentPlayer + 1) % NUM_STATIONS;

  if (index + 1 == NUM_STATIONS) {
    const turnWaste = maxAvailable - moved;
    lifetimeWasted += turnWaste;
  }

  render();
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
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

    if (i !== currentPlayer) {
      station.dice.classList.add("disabled");
    } else {
      station.dice.classList.remove("disabled");
    }
  });

  if (lifetimeAvailable && lifetimeWasted) {
    const lifetimeWastedPercent = Math.round(
      (lifetimeWasted / lifetimeAvailable) * 100
    );
    lifetimeWastedSpan.innerText = `Lifetime Wastage ${lifetimeWastedPercent}%`;
  }
}

createStations();
