import "./assets/main.scss";
import Game from "./Game";

import * as io from "socket.io-client";
import constants from "./config/constants";
import environment from "./config/environment";

const root = document.getElementById(constants.APP_ROOT_ELEMENT_ID);

const startOnePlayer = () => {
  const game = new Game();
  game.main();
};

const startTwoPlayers = (roomID?: string) => {
  let socket: SocketIOClient.Socket;

  if (roomID) {
    socket = io(environment.SOCKET_SERVER, {
      query: {
        roomID,
      },
    });
  } else {
    socket = io(environment.SOCKET_SERVER);
  }

  const container = document.createElement("div");
  socket.on("room-created", (id: string) => {
    container.classList.add("modal");

    const text = document.createElement("div");
    text.innerHTML = `Send link to friend: ${window.location.href}?roomID=${id}`;

    container.appendChild(text);
    root.appendChild(container);
  });

  socket.on("players-connected", (id: string) => {
    container.remove();
    const game = new Game(socket, id);
    game.main();
  });
};

const gameSelect = () => {
  if (location.search) {
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.has("roomID")) {
      startTwoPlayers(searchParams.get("roomID"));
      return;
    }
  }

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
