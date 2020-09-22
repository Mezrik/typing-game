import Runner from "./core/Runner";
import Engine from "./core/Engine";
import Letter from "./objects/Letter";
import { getRandomCapitalLetter, getRandomInt } from "./utils/helpers";
import Bowl from "./objects/Bowl";

import constants from "./config/constants";

const root = document.getElementById(constants.APP_ROOT_ELEMENT_ID);

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

  private _oponentScore = 0;
  private _socket: SocketIOClient.Socket;

  private _opponentsScoreElement: HTMLElement;
  private _goOpponentScore: HTMLElement;

  constructor(socket?: SocketIOClient.Socket, roomID?: string) {
    this.keyDownHandler = this.keyDownHandler.bind(this);
    this.refreshLetterPosition = this.refreshLetterPosition.bind(this);
    this.tickHandler = this.tickHandler.bind(this);
    this.keepLettersComming = this.keepLettersComming.bind(this);
    this.resetGame = this.resetGame.bind(this);
    this.listenToSocket = this.listenToSocket.bind(this);

    if (socket) {
      this._socket = socket;
      this.listenToSocket(socket);
    }

    this._engine = new Engine({
      element: root,
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

    this._engine.addToScene(this._bowl);
    this._runnerInstance = new Runner();
    document.addEventListener("keydown", this.keyDownHandler);
    this._runnerInstance.onTick(this.tickHandler);

    this.initScorePanel();
  }

  public listenToSocket(socket: SocketIOClient.Socket) {
    socket.on("score-change", (scores: { [id: string]: number }) => {
      delete scores[socket.id];
      this.opponentScore = scores[Object.keys(scores)[0]];
    });
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

      this._lettersMap[letter.toLowerCase()]
        ? this._lettersMap[letter.toLowerCase()].push(id)
        : (this._lettersMap[letter.toLowerCase()] = [id]);

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

    if (this._socket) {
      this._socket.emit("new-score", x);
    }
  }

  get opponentScore() {
    return this._oponentScore;
  }

  set opponentScore(x: number) {
    this._oponentScore = x;
    this._opponentsScoreElement.innerHTML = `opponent's score: ${x}`;

    if (this._goOpponentScore) {
      this._goOpponentScore.innerHTML = `Opponent's score: ${x}`;
    }
  }

  public keyPressHandler(key: string) {
    const instances = this._lettersMap[key.toLowerCase()];

    if (!instances) return false;

    const id = instances.shift();
    this._engine.remove(id);
    this.score += 1;

    if (instances.length <= 0) delete this._lettersMap[key.toLowerCase()];

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
      this._fallingSpeed =
        Math.round(this._fallingSpeed * 1.005 * 10000) / 10000;
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
    this.renderGameOverMessage();
  }

  public initScorePanel() {
    const panel = document.createElement("div");
    panel.classList.add("score-panel");
    panel.style.height = `${constants.Y_HEIGHT}px`;
    root.appendChild(panel);

    const score = document.createElement("div");
    score.classList.add("score");
    panel.appendChild(score);

    if (this._socket) {
      const opponentScore = document.createElement("div");
      opponentScore.classList.add("score");
      opponentScore.innerHTML = `opponent's score: 0`;
      panel.appendChild(opponentScore);
      this._opponentsScoreElement = opponentScore;
    }

    score.innerHTML = `score: 0`;
    this._scoreElement = score;
  }

  public resetGame() {
    this._lettersMap = {};
    this._eventsQueue = [];
    this._engine.reset();
    this._bowl.reset();
    this._lastSpeedUp = 0;
    this._fallingSpeed = 1;
    this._strikes = 0;
    this.score = 0;

    this.main();
  }

  public renderGameOverMessage() {
    const msg = document.createElement("div");
    msg.classList.add("game-over-msg");
    root.appendChild(msg);

    const text = document.createElement("span");
    text.classList.add("msg-text");
    text.innerHTML = "Game over";

    const score = document.createElement("span");
    score.classList.add("msg-score");
    score.innerHTML = `Score: ${this.score}`;

    const opponentScore = document.createElement("span");
    opponentScore.classList.add("msg-score");
    opponentScore.innerHTML = `Opponent's score: ${this.opponentScore}`;
    this._goOpponentScore = opponentScore;

    const restartBtn = document.createElement("a");
    restartBtn.classList.add("button");
    restartBtn.innerHTML = "Restart";

    const resetHandler = () => {
      restartBtn.removeEventListener("click", resetHandler);
      msg.remove();
      this.resetGame();
    };
    restartBtn.addEventListener("click", resetHandler);

    msg.appendChild(text);
    msg.appendChild(score);
    msg.appendChild(opponentScore);
    msg.appendChild(restartBtn);
  }

  public main() {
    this._runnerInstance.run(this._engine);

    for (let i = 0; i < constants.LETTERS_ON_SCREEN; i++) {
      setTimeout(() => {
        this.keepLettersComming();
      }, 2000 * i);
    }
  }
}

export default Game;
