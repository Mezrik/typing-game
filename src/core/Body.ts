import { Coords } from "./Engine";

abstract class Body {
  private _width: number;
  private _height: number;
  private _gravitation: number;
  private _x: number;
  private _y: number;

  protected _onRemoveCallback: () => void;

  constructor(width: number, height: number, x: number = 0, y: number = 0) {
    this._width = width;
    this._height = height;
    this._x = x;
    this._y = y;
  }

  public get coords(): Readonly<Coords> {
    return Object.freeze({ x: this._x, y: this._y });
  }

  abstract add(ctx: CanvasRenderingContext2D, payload?: any): void;
  abstract remove(ctx: CanvasRenderingContext2D, payload?: any): void;

  public onRemove(callback: () => void) {
    this._onRemoveCallback = callback;
  }

  public offRemove() {
    this._onRemoveCallback = undefined;
  }
}

export default Body;
