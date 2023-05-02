export default class Ship {
  #hits;
  #hitsPositions;
  constructor(row, column, length, orientation) {
    this.#hits = 0;
    this.length = length;
    this.row = row;
    this.column = column;
    this.orientation = orientation;
    this.#hitsPositions = [];
  }

  hit(row, column) {
    if (
      this.#hitsPositions.find((cell) => {
        return cell.row === row && cell.column === column;
      }) === null
    )
      return;
    this.#hits++;
    this.#hitsPositions.push({ row, column });
  }

  isSunk() {
    return this.#hits === this.length;
  }

  isIntersect(row, column) {
    if (this.orientation === "vertical") {
      return (
        this.column === column &&
        row >= this.row &&
        row < this.row + this.length
      );
    } else {
      return (
        this.row === row &&
        column >= this.column &&
        column < this.column + this.length
      );
    }
  }

  getCells() {
    const cells = [];
    if (this.orientation === "vertical") {
      for (let i = 0; i < this.length; i++) {
        cells.push({ row: this.row + i, column: this.column });
      }
    } else {
      for (let i = 0; i < this.length; i++) {
        cells.push({ row: this.row, column: this.column + i });
      }
    }
    return cells;
  }

  getHitCells() {
    return this.#hitsPositions;
  }
}
