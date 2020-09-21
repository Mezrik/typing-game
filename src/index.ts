import "./assets/main.scss";

import Runner from "./core/Runner";
import Engine from "./core/Engine";
import Letter from "./objects/Letter";
import { getRandomCapitalLetter, getRandomInt } from "./utils/helpers";
import Bowl from "./objects/Bowl";

const LETTERS_ON_SCREEN = 8;
const X_MIN = 30;
const X_MAX = 630;
const Y_HEIGHT = 768;
const Y_STARTING_POINT = 40;
const MAX_STRIKES = 12;
const BOWL_WIDTH = X_MAX + X_MIN;
const BOWL_HEIGHT = 80;

const engine = new Engine({
  element: document.getElementById("game"),
  options: { width: X_MIN + X_MAX, height: Y_HEIGHT },
});

const runnerInstance = new Runner();
runnerInstance.run(engine);

const lettersMap: { [letter: string]: string[] } = {};
const eventsQueue: KeyboardEvent[] = [];

let lastSpeedUp: DOMHighResTimeStamp = 0;
let fallingSpeed = 1;
let strikes = 0;

const bowl = new Bowl(
  { x: 0, y: Y_HEIGHT - BOWL_HEIGHT },
  BOWL_WIDTH,
  BOWL_HEIGHT,
  MAX_STRIKES
);

const keepLettersComming = () => {
  if (engine.bodiesCount < LETTERS_ON_SCREEN) {
    const letter = getRandomCapitalLetter();
    const instance = new Letter(letter, {
      x: getRandomInt(X_MIN, X_MAX),
      y: Y_STARTING_POINT,
    });

    instance.onRemove(keepLettersComming);
    const id = engine.add(instance);

    lettersMap[letter]
      ? lettersMap[letter].push(id)
      : (lettersMap[letter] = [id]);

    return true;
  }

  return false;
};

const useKey = (key: string) => {
  const instances = lettersMap[key];

  if (!instances) return false;

  const id = instances.shift();
  engine.remove(id);

  if (instances.length <= 0) delete lettersMap[key];

  return true;
};

const keyDownHandler = (event: KeyboardEvent) => {
  if (event.isComposing) return;
  eventsQueue.push(event);
};

const refreshLetterPosition = (letter: Letter) => {
  letter.coords = {
    x: letter.coords.x,
    y: letter.coords.y + 1 * fallingSpeed,
  };

  checkIfFailed(letter);
};

const tickHandler = (time: DOMHighResTimeStamp, e: Engine) => {
  if (time - lastSpeedUp > 5000) {
    fallingSpeed *= 1.05;
    lastSpeedUp = time;
  }

  e.clearCanvas();

  const event = eventsQueue.shift();
  if (event) useKey(event.key);

  e.applyOnBodies(refreshLetterPosition);
  e.renderBodies();
  e.renderScene();
};

const checkIfFailed = (letter: Letter) => {
  if (letter.coords.y + bowl.waterLevel < engine.height + letter.height)
    return false;
  engine.remove(letter.engineID);
  strikes += 1;
  bowl.addWater();

  if (strikes >= MAX_STRIKES) {
    setGameOver();
  }

  return true;
};

const setGameOver = () => {
  runnerInstance.stop();
};

const main = () => {
  engine.addToScene(bowl);

  document.addEventListener("keydown", keyDownHandler);
  runnerInstance.onTick(tickHandler);

  for (let i = 0; i < LETTERS_ON_SCREEN; i++) {
    setTimeout(() => {
      keepLettersComming();
    }, 2000 * i);
  }
};

main();
