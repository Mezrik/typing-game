import { EngineInterface } from "./Engine";

type RequestAnimationFrame = (callback: FrameRequestCallback) => number;
type CancelAnimationFrame = (RequestID: number) => void;

class Runner {
  private _requestAnimationFrame: RequestAnimationFrame;
  private _cancelAnimationFrame: CancelAnimationFrame;
  private frameRequestId: DOMHighResTimeStamp;

  constructor() {
    if (typeof window !== "undefined") {
      this._requestAnimationFrame =
        window.requestAnimationFrame.bind(window) ||
        window.webkitRequestAnimationFrame.bind(window) ||
        (window as any).mozRequestAnimationFrame.bind(window) ||
        (window as any).msRequestAnimationFrame.bind(window);

      this._cancelAnimationFrame =
        window.cancelAnimationFrame.bind(window) ||
        (window as any).mozCancelAnimationFrame.bind(window) ||
        window.webkitCancelAnimationFrame.bind(window) ||
        (window as any).msCancelAnimationFrame.bind(window);
    }

    if (!this._requestAnimationFrame) {
      this._requestAnimationFrame = (callback: FrameRequestCallback) => {
        return setTimeout(() => {
          callback(new Date().getTime());
        }, 1000 / 60) as any;
      };

      this._cancelAnimationFrame = (RequestID: number) => {
        clearTimeout(RequestID);
      };
    }
  }

  public run(engine: EngineInterface) {
    const render = (time: DOMHighResTimeStamp = 0) => {
      this.frameRequestId = this._requestAnimationFrame(render);
      this.tick(time, engine);
    };

    render();
  }

  public stop() {
    this._cancelAnimationFrame(this.frameRequestId);
  }

  public tick(time: DOMHighResTimeStamp, engine: EngineInterface) {
    console.log(time, engine);
  }
}

export default Runner;
