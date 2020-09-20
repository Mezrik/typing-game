import { Coords } from "./Engine";

abstract class Body {
  private _width: number;
  private _height: number;
  private _x: number;
  private _y: number;

  protected _engineID: string;
  protected _onRemoveCallback: () => void;

  constructor(width: number, height: number, x: number = 0, y: number = 0) {
    this._width = width;
    this._height = height;
    this._x = x;
    this._y = y;
  }

  get engineID() {
    return this._engineID;
  }

  get width() {
    return this._width;
  }

  get height() {
    return this._height;
  }

  get coords(): Readonly<Coords> {
    return Object.freeze({ x: this._x, y: this._y });
  }

  set coords(coords: Readonly<Coords>) {
    this._x = coords.x;
    this._y = coords.y;
  }

  abstract add(
    ctx: CanvasRenderingContext2D,
    engineID: string,
    payload?: any
  ): void;
  abstract remove(ctx: CanvasRenderingContext2D, payload?: any): void;
  abstract render(ctx: CanvasRenderingContext2D, payload?: any): void;

  public onRemove(callback: () => void) {
    this._onRemoveCallback = callback;
  }

  public offRemove() {
    this._onRemoveCallback = undefined;
  }
}

export default Body;
