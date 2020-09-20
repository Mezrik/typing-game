import Body from "../core/Body";
import { Coords } from "../core/Engine";

class Letter extends Body {
  private _char: string;
  private _size: number;

  constructor(character: string, coords: Coords, size: number = 22) {
    super(size, size, coords.x, coords.y);
    this._char = character;
    this._size = size;

    return this;
  }

  public size() {
    return this._size;
  }

  public add(ctx: CanvasRenderingContext2D, engineID: string): void {
    this.render(ctx);
    this._engineID = engineID;
  }

  public remove(ctx: CanvasRenderingContext2D) {
    this._onRemoveCallback();
  }

  public render(ctx: CanvasRenderingContext2D) {
    const { x, y } = this.coords;

    ctx.fillStyle = "#000000";
    ctx.font = `${this._size}px Arial`;
    ctx.fillText(this._char, x, y);
  }
}

export default Letter;
