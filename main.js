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
