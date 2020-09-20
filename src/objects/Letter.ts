import Body from "../core/Body";
import { Coords } from "../core/Engine";

class Letter extends Body {
  private _char: string;
  private _size: number;

  constructor(character: string, size: number = 28) {
    super(size, size);
    this._char = character;
    this._size = size;

    return this;
  }

  public add(ctx: CanvasRenderingContext2D): void {
    const { x, y } = this.coords;

    ctx.fillStyle = "#000000";
    ctx.font = `${this._size}px Arial`;
    ctx.fillText(this._char, x, y);
  }

  public remove(ctx: CanvasRenderingContext2D) {
    const { x, y } = this.coords;

    ctx.fillStyle = "#ffffff";
    ctx.font = `${this._size}px Arial`;
    ctx.fillText(this._char, x, y);

    this._onRemoveCallback();
  }
}

export default Letter;
