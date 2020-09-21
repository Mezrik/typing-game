import "./assets/main.scss";
import Game from "./Game";

import * as io from "socket.io-client";

const game = new Game();
game.main();

const socket = io("http://localhost:8080/");
socket.on("connect", () => {
  console.log("connected");
});
