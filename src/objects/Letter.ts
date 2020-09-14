import Body from "../core/Body";

class Letter extends Body {
  public char: string;

  constructor(character: string, size: number = 16) {
    super(size, size);
    this.char = character;

    return this;
  }
}
