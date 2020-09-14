export interface BodyInterface {}

class Body implements BodyInterface {
  private _width: number;
  private _height: number;

  constructor(width: number, height: number) {
    this._width = width;
    this._height = height;
  }
}

export default Body;
