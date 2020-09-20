import Runner from "./core/Runner";
import Engine from "./core/Engine";
import Letter from "./objects/Letter";

const LETTERS_ON_SCREEN = 12;

const engine = new Engine({ element: document.getElementById("app") });

const runnerInstance = new Runner();
runnerInstance.run(engine);

const lettersMap: { [letter: string]: number[] } = {};

const keepLettersComming = () => {
  if (engine.bodiesCount < LETTERS_ON_SCREEN) {
    const letter = "T";
    const pos = engine.add(new Letter(letter));

    lettersMap[letter]
      ? lettersMap[letter].push(pos)
      : (lettersMap[letter] = [pos]);
  }
};

const main = () => {};
