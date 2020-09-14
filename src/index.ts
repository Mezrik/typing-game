import Runner from "./core/Runner";
import Engine from "./core/Engine";

const engine = new Engine({ element: document.getElementById("app") });

const runnerInstance = new Runner();
runnerInstance.run(engine);

// import { Engine, Render, World, Bodies } from "matter-js";

// // create an engine
// const engine = Engine.create();

// // create a renderer
// const render = Render.create({
//   element: document.getElementById("app"),
//   engine,
//   options: {
//     width: window.innerWidth,
//     height: window.innerHeight,
//     wireframes: false,
//   },
// });

// // create two boxes and a ground
// const boxA = Bodies.rectangle(400, 200, 80, 80);
// const boxB = Bodies.rectangle(450, 50, 80, 80);
// const ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true });

// // add all of the bodies to the world
// World.add(engine.world, [boxA, boxB, ground]);

// // run the engine
// Engine.run(engine);

// // run the renderer
// Render.run(render);
