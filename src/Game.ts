import Runner from "./core/Runner";
import Engine from "./core/Engine";
import Letter from "./objects/Letter";
import { getRandomCapitalLetter, getRandomInt } from "./utils/helpers";
import Bowl from "./objects/Bowl";

import constants from "./config/constants";

class Game {
  private _lettersMap: { [letter: string]: string[] } = {};
  private _eventsQueue: KeyboardEvent[] = [];
  private _engine: Engine;
  private _runnerInstance: Runner;

  private _bowl: Bowl;
  private _lastSpeedUp: DOMHighResTimeStamp = 0;
  private _fallingSpeed = 1;
  private _strikes = 0;
  private _score = 0;
  private _scoreElement: HTMLElement;

  constructor() {
    this._engine = new Engine({
      element: document.getElementById(constants.APP_ROOT_ELEMENT_ID),
      options: {
        width: constants.X_MIN + constants.X_MAX,
        height: constants.Y_HEIGHT,
      },
    });

    this._bowl = new Bowl(
      { x: 0, y: constants.Y_HEIGHT - constants.BOWL_HEIGHT },
      constants.BOWL_WIDTH,
      constants.BOWL_HEIGHT,
      constants.MAX_STRIKES
    );

    this._runnerInstance = new Runner();
    this.initScorePanel();

    this.keyDownHandler = this.keyDownHandler.bind(this);
    this.refreshLetterPosition = this.refreshLetterPosition.bind(this);
    this.tickHandler = this.tickHandler.bind(this);
    this.keepLettersComming = this.keepLettersComming.bind(this);
  }

  public keepLettersComming() {
    if (this._engine.bodiesCount < constants.LETTERS_ON_SCREEN) {
      const letter = getRandomCapitalLetter();
      const instance = new Letter(letter, {
        x: getRandomInt(constants.X_MIN, constants.X_MAX),
        y: constants.Y_STARTING_POINT,
      });

      instance.onRemove(this.keepLettersComming);
      const id = this._engine.add(instance);

      this._lettersMap[letter]
        ? this._lettersMap[letter].push(id)
        : (this._lettersMap[letter] = [id]);

      return true;
    }

    return false;
  }

  get score() {
    return this._score;
  }

  set score(x: number) {
    this._score = x;
    this._scoreElement.innerHTML = `score: ${x}`;
  }

  public keyPressHandler(key: string) {
    const instances = this._lettersMap[key];

    if (!instances) return false;

    const id = instances.shift();
    this._engine.remove(id);
    this.score += 1;

    if (instances.length <= 0) delete this._lettersMap[key];

    return true;
  }

  public keyDownHandler(event: KeyboardEvent) {
    if (event.isComposing) return;
    this._eventsQueue.push(event);
  }

  public refreshLetterPosition(letter: Letter) {
    letter.coords = {
      x: letter.coords.x,
      y: letter.coords.y + 1 * this._fallingSpeed,
    };

    this.checkIfFailed(letter);
  }

  public tickHandler(time: DOMHighResTimeStamp, e: Engine) {
    if (time - this._lastSpeedUp > constants.SPEED_UP_AFTER) {
      this._fallingSpeed *= 1.05;
      this._lastSpeedUp = time;
    }

    e.clearCanvas();

    const event = this._eventsQueue.shift();
    if (event) this.keyPressHandler(event.key);

    e.applyOnBodies(this.refreshLetterPosition);
    e.renderBodies();
    e.renderScene();
  }

  public checkIfFailed(letter: Letter) {
    if (
      letter.coords.y + this._bowl.waterLevel <
      this._engine.height + letter.height
    )
      return false;
    this._engine.remove(letter.engineID);
    this._strikes += 1;
    this._bowl.addWater();

    if (this._strikes >= constants.MAX_STRIKES) {
      this.setGameOver();
    }

    return true;
  }

  public setGameOver() {
    this._runnerInstance.stop();
  }

  public initScorePanel() {
    const panel = document.createElement("div");
    panel.classList.add("score-panel");
    panel.style.height = `${constants.Y_HEIGHT}px`;
    const root = document.getElementById(constants.APP_ROOT_ELEMENT_ID);
    root.appendChild(panel);

    const score = document.createElement("div");
    score.classList.add("score");
    panel.appendChild(score);

    score.innerHTML = `score: 0`;
    this._scoreElement = score;
  }

  public main() {
    this._runnerInstance.run(this._engine);
    this._engine.addToScene(this._bowl);

    document.addEventListener("keydown", this.keyDownHandler);
    this._runnerInstance.onTick(this.tickHandler);

    for (let i = 0; i < constants.LETTERS_ON_SCREEN; i++) {
      setTimeout(() => {
        this.keepLettersComming();
      }, 2000 * i);
    }
  }
}

export default Game;
