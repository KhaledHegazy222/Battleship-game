import Player from "./Player";
import {
  initDom,
  initEvents,
  missCell,
  attackCell,
  sinkCell,
  newShip,
} from "./DOM";

let player;
let computer;
let gameStart;
function getShip(length) {
  return new Promise((resolve, reject) => {
    newShip(length, resolve);
  });
}

async function initGame() {
  initDom();
  initEvents();

  gameStart = false;
  player = new Player();

  const addShip = (args) => {
    player.gameBoard.addShip(...args);
  };
  const addRandomShip = (length) => {
    while (true) {
      const row = Math.floor(Math.random() * 10);
      const column = Math.floor(Math.random() * 10);
      const orientation = Math.floor(Math.random() * 2)
        ? "vertical"
        : "horizontal";
      let good = true;
      for (let i = 0; i < length; i++) {
        const newRow = row + (orientation === "vertical" ? i : 0);
        const newCol = column + (orientation === "horizontal" ? i : 0);
        if (
          newRow >= 10 ||
          newCol >= 10 ||
          !computer.gameBoard.canPlaceShip(newRow, newCol)
        ) {
          good = false;
          break;
        }
      }
      if (good) {
        return [row, column, length, orientation];
      }
      console.log("trying");
    }
  };

  await getShip(5).then(addShip);
  await getShip(4).then(addShip);
  await getShip(3).then(addShip);
  await getShip(2).then(addShip);
  await getShip(2).then(addShip);
  await getShip(2).then(addShip);
  await getShip(1).then(addShip);
  await getShip(1).then(addShip);
  await getShip(1).then(addShip);

  gameStart = true;

  computer = new Player();
  computer.gameBoard.addShip(...addRandomShip(5));
  computer.gameBoard.addShip(...addRandomShip(4));
  computer.gameBoard.addShip(...addRandomShip(3));
  computer.gameBoard.addShip(...addRandomShip(2));
  computer.gameBoard.addShip(...addRandomShip(2));
  computer.gameBoard.addShip(...addRandomShip(1));
  computer.gameBoard.addShip(...addRandomShip(1));
  computer.gameBoard.addShip(...addRandomShip(1));
  alert("Start Fire!!");
}

function render() {
  player.gameBoard.missedAttacks().forEach((cell) => {
    missCell(cell.row, cell.column, true);
  });
  player.gameBoard.hitAttacks().forEach((ship) => {
    if (ship.isSunk) {
      ship.cells.forEach((cell) => {
        sinkCell(cell.row, cell.column, true);
      });
    } else {
      ship.cells.forEach((cell) => {
        attackCell(cell.row, cell.column, true);
      });
    }
  });
  computer.gameBoard.missedAttacks().forEach((cell) => {
    missCell(cell.row, cell.column, false);
  });
  computer.gameBoard.hitAttacks().forEach((ship) => {
    if (ship.isSunk) {
      ship.cells.forEach((cell) => {
        sinkCell(cell.row, cell.column, false);
      });
    } else {
      ship.cells.forEach((cell) => {
        attackCell(cell.row, cell.column, false);
      });
    }
  });
}

function computerMove() {
  while (true) {
    const row = Math.floor(Math.random() * 10);
    const column = Math.floor(Math.random() * 10);
    if (!player.gameBoard.isLegalMove(row, column)) continue;
    player.gameBoard.receiveAttack(row, column);
    break;
  }
}
function canPlace(row, column) {
  return player.gameBoard.canPlaceShip(row, column);
}

function handleClicks(row, column) {
  if (!gameStart) return;
  if (player.gameBoard.gameOver() || computer.gameBoard.gameOver()) return;
  if (!computer.gameBoard.isLegalMove(row, column)) return;
  computer.gameBoard.receiveAttack(row, column);
  computerMove();
  render();
}

export { initGame, computerMove, render, handleClicks, canPlace };
