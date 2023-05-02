import Ship from "./Ship";

export default class GameBoard {
  #ships;
  #missedAttacks;
  constructor() {
    this.#ships = [];
    this.#missedAttacks = [];
  }

  addShip(row, column, length, orientation) {
    this.#ships.push(new Ship(row, column, length, orientation));
  }

  isLegalMove(row, column) {
    return (
      this.#missedAttacks.every(
        (cell) => cell.row !== row || cell.column !== column
      ) &&
      this.hitAttacks().every((ship) => {
        return ship.cells.every(
          (cell) => cell.row !== row || cell.column !== column
        );
      })
    );
  }

  canPlaceShip(row, column) {
    return this.#ships.every((ship) => {
      return !ship.isIntersect(row, column);
    });
  }

  receiveAttack(row, column) {
    const attackedShip = this.#ships.find((ship) => {
      return ship.isIntersect(row, column);
    });
    if (!attackedShip) {
      this.#missedAttacks.push({ row, column });
      return;
    }

    attackedShip.hit(row, column);
  }

  hitAttacks() {
    return this.#ships.reduce((prev, curr) => {
      return [
        ...prev,
        {
          isSunk: curr.isSunk(),
          cells: curr.getHitCells(),
        },
      ];
    }, []);
  }

  missedAttacks() {
    return this.#missedAttacks;
  }

  gameOver() {
    return this.#ships.every((ship) => ship.isSunk());
  }
}
