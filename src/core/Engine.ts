export interface EngineInterface {}

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

  public add() {}
}

export default Engine;
