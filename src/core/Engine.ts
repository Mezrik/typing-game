import Body from "./Body";

export interface EngineInterface {
  add: (body: Body) => number;
  remove: (position: number) => void;
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
  private _bodies: Body[] = [];

  constructor(opts: EngineOptions) {
    const { options = {}, element } = opts;
    this._rootEl = element;

    if (!this._rootEl) {
      throw new Error("No element provided for Engine instance.");
    }

    const canvas = document.createElement("canvas");
    canvas.width = options.width || 400;
    canvas.height = options.height || 300;

    element.appendChild(canvas);

    this._canvas = canvas;

    this._ctx = this._canvas.getContext("2d");
  }

  get ctx() {
    return this._ctx;
  }

  get bodiesCount() {
    return this._bodies.length;
  }

  public add(body: Body) {
    const position = this._bodies.length;

    this._bodies.push(body);
    body.add(this._ctx);

    return position;
  }

  public remove(pos: number) {
    const body = this._bodies[pos];
    body.remove(this._ctx);
    this._bodies.splice(pos, 1);
  }
}

export default Engine;
