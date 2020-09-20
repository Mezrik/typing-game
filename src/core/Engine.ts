import Body from "./Body";
import { v4 as uuidv4 } from "uuid";

export interface EngineInterface {
  add: (body: Body) => number;
  remove: (id: string) => void;
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

class Engine implements EngineInterface {
  private _rootEl: HTMLElement;
  private _ctx: CanvasRenderingContext2D;
  private _canvas: HTMLCanvasElement;
  private _bodies: { [key: string]: Body } = {};

  constructor(opts: EngineOptions) {
    const { options = {}, element } = opts;
    this._rootEl = element;

    if (!this._rootEl) {
      throw new Error("No element provided for Engine instance.");
    }

    const canvas = document.createElement("canvas");
    canvas.classList.add("game-canvas");
    canvas.width = options.width || 400;
    canvas.height = options.height || 300;

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

  public clearCanvas() {
    this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
  }

  public renderBodies() {
    for (const [id, body] of Object.entries(this._bodies)) {
      body.render(this._ctx);
    }
  }

  public applyOnBodies(callback: (body: Body) => void) {
    for (const [id, body] of Object.entries(this._bodies)) {
      callback(body);
    }
  }

  public add(body: Body) {
    const id = uuidv4();

    this._bodies[id] = body;
    body.add(this._ctx, id);

    return id;
  }

  public remove(id: string) {
    const body = this._bodies[id];
    if (!body) return;

    body.remove(this._ctx);
    delete this._bodies[id];
  }
}

export default Engine;
