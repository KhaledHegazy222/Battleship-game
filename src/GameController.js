import Player from "./Player";
import {
  initDom,
  initEvents,
  missCell,
  attackCell,
  sinkCell,
  newShip,
} from "./DOM";
/* The game board consists of :
  (1) Ship [4] (Horizontal)
  (1) Ship [3] (Vertical)
  (2) Ship [2] (Vertical / Horizontal)
  (2) Ship [1] (None)
*/

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

  await getShip(4).then(addShip);
  await getShip(3).then(addShip);
  await getShip(2).then(addShip);
  await getShip(2).then(addShip);
  await getShip(1).then(addShip);
  await getShip(1).then(addShip);

  gameStart = true;

  computer = new Player();
  computer.gameBoard.addShip(4, 2, 4, "horizontal");
  computer.gameBoard.addShip(6, 3, 3, "vertical");
  computer.gameBoard.addShip(1, 6, 2, "horizontal");
  computer.gameBoard.addShip(2, 9, 2, "vertical");
  computer.gameBoard.addShip(7, 5, 1, "horizontal");
  computer.gameBoard.addShip(0, 0, 1, "vertical");
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
