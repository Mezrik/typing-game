import "./assets/main.scss";
import Game from "./Game";

import * as io from "socket.io-client";
import constants from "./config/constants";

const root = document.getElementById(constants.APP_ROOT_ELEMENT_ID);

const startOnePlayer = () => {
  const game = new Game();
  game.main();
};

const startTwoPlayers = () => {};

const gameSelect = () => {
  const onePlayerBtn = document.createElement("a");
  onePlayerBtn.classList.add("button");
  onePlayerBtn.innerHTML = "One player";
  const onePHandler = () => {
    onePlayerBtn.removeEventListener("click", onePHandler);
    container.remove();
    startOnePlayer();
  };
  onePlayerBtn.addEventListener("click", onePHandler);

  const twoPlayersBtn = document.createElement("a");
  twoPlayersBtn.classList.add("button");
  twoPlayersBtn.innerHTML = "Two players";
  const twoPHandler = () => {
    twoPlayersBtn.removeEventListener("click", twoPHandler);
    container.remove();
    startTwoPlayers();
  };
  twoPlayersBtn.addEventListener("click", twoPHandler);

  const container = document.createElement("div");
  container.classList.add("select-mode");

  container.innerHTML = "TYPE GAME";

  const btnContainer = document.createElement("div");
  btnContainer.classList.add("btn-container");

  btnContainer.appendChild(onePlayerBtn);
  btnContainer.appendChild(twoPlayersBtn);
  container.appendChild(btnContainer);
  root.appendChild(container);
};

gameSelect();

const socket = io("http://localhost:8080/");

socket.on("connect", () => {
  console.log("connected");
});

socket.on("initial", (config: any) => {
  console.log(config);
});
