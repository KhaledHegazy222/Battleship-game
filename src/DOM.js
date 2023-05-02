import "./style.css";
import skullIcon from "./assets/skull.png";
import { handleClicks, canPlace } from "./GameController";
const gameGrid = document.querySelectorAll(".game-grid");
const computerGrid = document
  .querySelector(".computer-board")
  .querySelector(".game-grid");
const playerGrid = document
  .querySelector(".player-board")
  .querySelector(".game-grid");

const horizontalInput = document.getElementById("horizontal-input");
let playerGridMatrix = [];
let ComputerGridMatrix = [];

function initDom() {
  playerGridMatrix = new Array(10);
  ComputerGridMatrix = new Array(10);
  for (let i = 0; i < 10; i++) {
    playerGridMatrix[i] = new Array(10);
    ComputerGridMatrix[i] = new Array(10);
  }
  gameGrid.forEach((grid) => {
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        const cell = document.createElement("div");
        const img = document.createElement("img");
        img.setAttribute("src", skullIcon);
        img.classList.add("skull-img");
        cell.appendChild(img);
        cell.classList.add("grid-cell");
        cell.setAttribute("data-row", i);
        cell.setAttribute("data-column", j);

        grid.appendChild(cell);
      }
    }

    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        playerGridMatrix[i][j] = getCell(i, j, playerGrid);
        ComputerGridMatrix[i][j] = getCell(i, j, computerGrid);
      }
    }
  });
}

function initEvents() {
  computerGrid.querySelectorAll(".grid-cell").forEach((cell) => {
    cell.addEventListener("click", function (event) {
      const row = parseInt(this.getAttribute("data-row"));
      const column = parseInt(this.getAttribute("data-column"));
      handleClicks(row, column, true);
    });
  });
}

function missCell(row, column, isPlayerBoard) {
  const grid = isPlayerBoard ? playerGrid : computerGrid;
  const cell = grid.querySelector(
    `[data-row="${row}"][data-column="${column}"]`
  );
  cell.classList.add("missed-cell");
}

function attackCell(row, column, isPlayerBoard) {
  const grid = isPlayerBoard ? playerGrid : computerGrid;
  const cell = grid.querySelector(
    `[data-row="${row}"][data-column="${column}"]`
  );
  cell.classList.add("attacked-cell");
}

function sinkCell(row, column, isPlayerBoard) {
  const grid = isPlayerBoard ? playerGrid : computerGrid;
  const cell = getCell(row, column, grid);
  cell.classList.add("attacked-cell");
  cell.classList.add("sunk-cell");
}

function getCell(row, column, grid) {
  return grid.querySelector(`[data-row="${row}"][data-column="${column}"]`);
}

function getCells(row, column, length, orientation) {
  const cells = [];
  for (let i = 0; i < length; i++) {
    if (orientation === "vertical") {
      if (row + i < 10) {
        cells.push({ row: row + i, column });
      } else {
        cells.push({ row: row - ((row + i) % 9), column });
      }
    } else {
      if (column + i < 10) {
        cells.push({ row, column: column + i });
      } else {
        cells.push({ row, column: column - ((column + i) % 9) });
      }
    }
  }
  return cells;
}
function newShip(length, callBack) {
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      playerGridMatrix[i][j].addEventListener("click", handleClickCell);
      playerGridMatrix[i][j].addEventListener("mouseenter", mouseEnter);
      playerGridMatrix[i][j].addEventListener("mouseout", mouseOut);
    }
  }
  function handleClickCell(event) {
    const orientation = horizontalInput.checked ? "horizontal" : "vertical";
    const row = parseInt(this.getAttribute("data-row"));
    const column = parseInt(this.getAttribute("data-column"));
    const cells = getCells(row, column, length, orientation, playerGrid);

    if (
      !cells.every((cell) => {
        return canPlace(cell.row, cell.column);
      })
    ) {
      return;
    }

    cells.forEach((cell) => {
      playerGridMatrix[cell.row][cell.column].classList.add("fixed-new-ship");
    });

    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        playerGridMatrix[i][j].removeEventListener("click", handleClickCell);
        playerGridMatrix[i][j].removeEventListener("mouseenter", mouseEnter);
        playerGridMatrix[i][j].removeEventListener("mouseout", mouseOut);
      }
    }
    callBack([row, column, length, orientation]);
  }
  function mouseEnter(event) {
    const orientation = horizontalInput.checked ? "horizontal" : "vertical";
    const row = parseInt(this.getAttribute("data-row"));
    const column = parseInt(this.getAttribute("data-column"));
    const cells = getCells(row, column, length, orientation, playerGrid);
    if (
      !cells.every((cell) => {
        return canPlace(cell.row, cell.column);
      })
    ) {
      return;
    }
    cells.forEach((cell) => {
      playerGridMatrix[cell.row][cell.column].classList.add("new-ship");
    });
  }
  function mouseOut(event) {
    const orientation = horizontalInput.checked ? "horizontal" : "vertical";
    const row = parseInt(this.getAttribute("data-row"));
    const column = parseInt(this.getAttribute("data-column"));
    const cells = getCells(row, column, length, orientation, playerGrid);

    cells.forEach((cell) => {
      playerGridMatrix[cell.row][cell.column].classList.remove("new-ship");
    });
  }
}

export { initDom, initEvents, missCell, attackCell, sinkCell, newShip };
