import Body from "./Body";
// @ts-ignore
import { v4 as uuidv4 } from "uuid";
import constants from "../config/constants";

export interface EngineInterface {
  add: (body: Body) => string;
  remove: (id: string) => void;
  addToScene: (body: Body) => string;
  reset: () => void;
}

export type Coords = {
  x: number;
  y: number;
};

export interface EngineOptions {
  element: HTMLElement;
  options?: {
    width?: number;
    height?: number;
  };
}

/**
 * Engine class which represents game canvas.
 */
class Engine implements EngineInterface {
  private _rootEl: HTMLElement;
  private _ctx: CanvasRenderingContext2D;
  private _canvas: HTMLCanvasElement;
  private _bodies: { [key: string]: Body } = {};
  private _scene: { [key: string]: Body } = {};

  /**
   * Attaches canvas element to provided element.
   * @param  {EngineOptions} opts
   */
  constructor(opts: EngineOptions) {
    const { options = {}, element } = opts;
    this._rootEl = element;

    if (!this._rootEl) {
      throw new Error("No element provided for Engine instance.");
    }

    const canvas = document.createElement("canvas");
    canvas.classList.add("game-canvas");
    canvas.width = options.width || constants.DEFAULT_CANVAS_WIDTH;
    canvas.height = options.height || constants.DEFAULT_CANVAS_HEIGHT;

    element.appendChild(canvas);

    this._canvas = canvas;

    this._ctx = this._canvas.getContext("2d");
  }

  get ctx() {
    return this._ctx;
  }

  get width() {
    return this._canvas.width;
  }

  get height() {
    return this._canvas.height;
  }

  get bodies() {
    return Object.values(this._bodies);
  }

  get bodiesCount() {
    return Object.keys(this._bodies).length;
  }

  /**
   * Resets the engine (not scene)
   */
  public reset() {
    this._bodies = {};
    this.clearCanvas();
  }
  /**
   * Simply clears the canvas
   */
  public clearCanvas() {
    this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
  }

  /**
   * Renders moving bodies on canvas
   */
  public renderBodies() {
    for (const [id, body] of Object.entries(this._bodies)) {
      body.render(this._ctx);
    }
  }

  /**
   * Renders static scene on canvas
   */
  public renderScene() {
    for (const [id, body] of Object.entries(this._scene)) {
      body.render(this._ctx);
    }
  }

  /**
   * Runs callback with all bodies
   */
  public applyOnBodies(callback: (body: Body) => void) {
    for (const [id, body] of Object.entries(this._bodies)) {
      callback(body);
    }
  }

  /**
   * Add body to the canvas
   */
  public add(body: Body) {
    const id = uuidv4();

    this._bodies[id] = body;
    body.add(this._ctx, id);

    return id;
  }

  /**
   * Remove body from the canvas
   */
  public remove(id: string) {
    const body = this._bodies[id];
    if (!body) return;

    body.remove(this._ctx);
    delete this._bodies[id];
  }

  /**
   * Add body to the static scene
   */
  public addToScene(body: Body) {
    const id = uuidv4();

    this._scene[id] = body;
    body.add(this._ctx, id);

    return id;
  }
}

export default Engine;
