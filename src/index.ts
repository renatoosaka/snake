#!/usr/bin/env node

import { Sprite, Terminal } from "command-line-draw";
import { Snake } from "./snake";

let timeout: NodeJS.Timeout;

const terminal = new Terminal({
  color: {
    background: "black",
    foreground: "white",
  },
});

const snakeSprite: Sprite[] = [];

const foodSprite = new Sprite(
  (x, y) => {
    terminal.drawBox(x, y, 1, 1, "red");
  },
  {
    preciseAxis: "neither",
    speed: 1000,
  }
);

const game = {
  score: 0,
  maxScore: 0,
  gameOver: false,
  showLogs: false,
};
const food = { x: random(terminal.width), y: random(terminal.height) };
const snake = new Snake({
  x: random(terminal.width),
  y: random(terminal.height),
  w: terminal.width,
  h: terminal.height,
});

function newSnakePiece() {
  const piece = new Sprite(
    (x, y) => {
      terminal.drawBox(x, y, 1, 1);
    },
    {
      preciseAxis: "neither",
      speed: 1000,
    }
  );

  snakeSprite.unshift(piece);

  terminal.addSprite(piece);
}

function random(max: number) {
  return Math.floor(Math.random() * max + 1);
}

function window() {
  terminal.drawBox(0, 0, terminal.width, terminal.height, "black");
}

function isFoodColected() {
  const { x, y } = snake.position;

  return x === food.x && y === food.y;
}

function newFood() {
  Object.assign(food, {
    x: random(terminal.width - 1),
    y: random(terminal.height - 1),
  });
}

function draw() {
  terminal.write(`Score: ${game.score} - Max Score: ${game.maxScore}`, 1, 0);

  const { x, y } = snake.move();
  if (snake.willColide()) {
    gameOver();
    return;
  }

  const s = snakeSprite.pop() as Sprite;
  s.draw(x, y);
  snakeSprite.unshift(s);

  if (isFoodColected()) {
    newFood();
    newSnakePiece();
    game.score += 1;
  }

  foodSprite.draw(food.x, food.y);

  if (game.showLogs) {
    terminal.write(JSON.stringify(food), 1, 0);
    terminal.write(JSON.stringify({ x, y }), 1, 1);
    terminal.write(
      JSON.stringify({ w: terminal.width, h: terminal.height }),
      1,
      2
    );
  }
}

function centerOfTheBox(x: number, len: number, width: number) {
  return x + Math.floor(width / 2) - Math.floor(len / 2);
}

function gameOver() {
  clearTimeout(timeout);
  game.maxScore = Math.max(game.maxScore, game.score);

  const boxWidth = Math.floor(terminal.width / 2);
  const boxHeight = 5;

  const x = boxWidth - Math.floor(boxWidth / 2);
  const y = Math.floor(terminal.height / 2) - Math.floor(boxHeight / 2);
  terminal.drawBox(x, y, boxWidth, boxHeight, "red");

  const gameOverText = "Game Over";
  terminal.write(
    gameOverText,
    centerOfTheBox(x, gameOverText.length, boxWidth),
    y + 1
  );

  const restartText = "Press r to restart";
  terminal.write(
    restartText,
    centerOfTheBox(x, restartText.length, boxWidth),
    y + 2
  );

  const quitGameText = "Press q to quit";
  terminal.write(
    quitGameText,
    centerOfTheBox(x, quitGameText.length, boxWidth),
    y + 3
  );
}

function loop() {
  draw();
  timeout = setTimeout(loop, 1000 / (8 + Math.floor(game.score / 10)));
}

function handleControls({ name }: { name: string }) {
  if (name === "r") {
    restart();
  }

  if (name === "q") {
    process.exit(0);
  }

  snake.direction = name as "up" | "down" | "left" | "right";
}

function restart() {
  terminal.clear();
  game.gameOver = false;
  game.score = 0;
  while (snakeSprite.length) snakeSprite.pop();
  newSnakePiece();
  snake.restart(random(terminal.width), random(terminal.height));

  newFood();
  timeout.refresh();
}

function setup() {
  terminal.clear();

  terminal.on("up", handleControls);
  terminal.on("down", handleControls);
  terminal.on("left", handleControls);
  terminal.on("right", handleControls);
  terminal.on("r", handleControls);
  terminal.on("q", handleControls);

  newSnakePiece();
  terminal.addSprite(foodSprite);
}

function main() {
  setup();
  window();
  loop();
}

main();
