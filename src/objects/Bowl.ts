import constants from "../config/constants";
import Body from "../core/Body";
import { Coords } from "../core/Engine";

class Bowl extends Body {
  private _waterHeight = 0;
  private _maxStrikes;

  constructor(coords: Coords, width = 400, height = 80, maxStrikes = 12) {
    super(width, height, coords.x, coords.y);
    this._maxStrikes = maxStrikes;

    return this;
  }

  get waterLevel() {
    return (this.height / this._maxStrikes) * this._waterHeight;
  }

  public reset() {
    this._waterHeight = 0;
  }

  public add(ctx: CanvasRenderingContext2D, engineID: string): void {
    this.render(ctx);
    this._engineID = engineID;
  }

  public remove(ctx: CanvasRenderingContext2D) {
    if (this._onRemoveCallback) this._onRemoveCallback();
  }

  public addWater() {
    this._waterHeight += 1;
  }

  public render(ctx: CanvasRenderingContext2D) {
    const { x, y } = this.coords;

    ctx.strokeRect(x, y, this.width, this.height);

    ctx.fillStyle = constants.BOWL_COLOR;

    ctx.fillRect(
      x,
      y + this.height - this.waterLevel,
      this.width,
      this.waterLevel
    );
  }
}

export default Bowl;
