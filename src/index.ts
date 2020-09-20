import Runner from "./core/Runner";
import Engine from "./core/Engine";
import Letter from "./objects/Letter";
import { getRandomCapitalLetter, getRandomInt } from "./utils/helpers";

const LETTERS_ON_SCREEN = 12;
const X_MIN = 30;
const X_MAX = 830;
const Y_STARTING_POINT = 40;

const engine = new Engine({
  element: document.getElementById("app"),
  options: { width: window.innerWidth, height: window.innerHeight },
});

const runnerInstance = new Runner();
runnerInstance.run(engine);

const lettersMap: { [letter: string]: string[] } = {};
const eventsQueue: KeyboardEvent[] = [];

let lastSpeedUp: DOMHighResTimeStamp = 0;
let fallingSpeed = 1;

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
};

const checkIfFailed = (letter: Letter) => {
  if (letter.coords.y < engine.height + letter.height) return false;
  engine.remove(letter.engineID);

  return true;
};

const main = () => {
  document.addEventListener("keydown", keyDownHandler);
  runnerInstance.onTick(tickHandler);

  for (let i = 0; i < LETTERS_ON_SCREEN; i++) {
    setTimeout(() => {
      keepLettersComming();
    }, 2000 * i);
  }
};

main();
