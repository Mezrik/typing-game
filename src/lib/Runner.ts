import Engine from "./Engine";

type RequestAnimationFrame = (callback: FrameRequestCallback) => number;
type CancelAnimationFrame = (RequestID: number) => void;

class Runner {
  private _requestAnimationFrame: RequestAnimationFrame;
  private _cancelAnimationFrame: CancelAnimationFrame;

  constructor() {
    if (typeof window !== "undefined") {
      this._requestAnimationFrame =
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        (window as any).mozRequestAnimationFrame ||
        (window as any).msRequestAnimationFrame;

      this._cancelAnimationFrame =
        window.cancelAnimationFrame ||
        (window as any).mozCancelAnimationFrame ||
        window.webkitCancelAnimationFrame ||
        (window as any).msCancelAnimationFrame;
    }

    if (!this._requestAnimationFrame) {
      this._requestAnimationFrame = (callback: FrameRequestCallback) => {
        return setTimeout(() => {
          callback(new Date().getTime());
        }, 1000 / 60) as any;
      };

      this._cancelAnimationFrame = (RequestID: number) {
        clearTimeout(RequestID);
      };
    }
  }

  public tick(engine: typeof Engine) {
    return 
  }
}

export default Runner;
