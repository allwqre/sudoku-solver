#!/usr/bin/env node
const { readFileSync, writeFileSync } = require("fs");

const args = process.argv.slice(2);

const fileName = args[0];

const data = readFileSync(fileName, "utf-8");

const normalize = (data) =>
  data
    .replace(/ /g, "")
    .split("\n")
    .filter((val) => val !== "");

function prepareGrid(normalData) {
  const isHyphen = (particle) => particle === "-";
  const isNumber = (particle) => !isNaN(Number(particle));

  const parseCell = (cell) => {
    if (isHyphen(cell)) return 0;
    if (isNumber(cell)) return Number(cell);
    return undefined;
  };

  const parseRow = (row) => row.split("").map((val) => parseCell(val));
  const parseGrid = (grid) => grid.map((val) => parseRow(val));

  return parseGrid(normalData);
}

const Grid = prepareGrid(normalize(data));

function solveGrid(grid) {
  const possibleInRow = (num, row, col) => {
    for (let i = 0; i < 9; i++)
      if (i !== col && grid[row][i] === num) return false;
    return true;
  };
  const possibleInCol = (num, row, col) => {
    for (let i = 0; i < 9; i++)
      if (i !== row && grid[i][col] === num) return false;
    return true;
  };
  const possibleInBox = (num, row, col) => {
    const boxRowStart = Math.floor(row / 3) * 3; // 0, 0, 0, 3, 3, 3, 6, 6, 6, ...
    const boxColStart = Math.floor(col / 3) * 3; // 0, 0, 0, 3, 3, 3, 6, 6, 6, ...

    for (let i = 0; i < 9; i++) {
      const rowToCheck = boxRowStart + Math.floor(i / 3);
      const colToCheck = boxColStart + (i % 3);

      if (
        rowToCheck !== row &&
        colToCheck !== col &&
        grid[rowToCheck][colToCheck] === num
      )
        return false;
    }

    return true;
  };

  const possible = (num, row, col) =>
    possibleInRow(num, row, col) &&
    possibleInCol(num, row, col) &&
    possibleInBox(num, row, col);

  const preSolved = grid.map((row) => row.map((val) => val !== 0));
  let k = 0;
  let backtracking = false;

  while (k >= 0 && k < 81) {
    const row = Math.floor(k / 9);
    const col = k % 9;

    if (!preSolved[row][col]) {
      grid[row][col]++;

      while (!possible(grid[row][col], row, col) && grid[row][col] <= 9)
        grid[row][col]++;

      if (grid[row][col] > 9) {
        grid[row][col] = 0;
        backtracking = true;
      } else backtracking = false;
    }

    if (backtracking) k--;
    else k++;
  }

  if (k === 81) return grid;
  else return null;
}

const solution = solveGrid(Grid);

function verifySolution(grid) {
  const verifyRow = (row) =>
    grid[row].reduce((prev, curr) => prev + curr) === 45;
  const verifyCol = (col) => {
    let acc = 0;
    for (let i = 0; i < grid.length; i++) acc = acc + grid[i][col];
    return acc === 45;
  };
  const verifyBox = (box) => {
    const boxRowStart = Math.floor((box * 3) % 9); // 0, 3, 6, 0, 3, 6, 0, 3, 6, ...
    const boxColStart = Math.floor((box * 3) / 9) * 3; // 0, 0, 0, 3, 3, 3, 6, 6, 6, ...

    let acc = 0;
    for (let i = 0; i < 9; i++) {
      const colToAdd = boxRowStart + Math.floor(i / 3);
      const rowToAdd = boxColStart + (i % 3);

      acc = acc + grid[rowToAdd][colToAdd];
    }
    return acc === 45;
  };

  for (let i = 0; i < 9; i++) {
    if (!verifyRow(i) || !verifyCol(i) || !verifyBox(i)) return false;
  }
  return true;
}

if (solution && verifySolution(solution)) console.log("Solution good.");
else console.log("Solution bad.");
