import { EngineInterface } from "./Engine";
import Letter from "../objects/Letter";

type RequestAnimationFrame = (callback: FrameRequestCallback) => number;
type CancelAnimationFrame = (RequestID: number) => void;
type TickCallback = () => void;

class Runner {
  private _requestAnimationFrame: RequestAnimationFrame;
  private _cancelAnimationFrame: CancelAnimationFrame;
  private _frameRequestId: DOMHighResTimeStamp;

  private _callbacks: TickCallback[] = [];

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
      this._frameRequestId = this._requestAnimationFrame(render);
      this.tick(time, engine);
    };

    render();
  }

  public stop() {
    this._cancelAnimationFrame(this._frameRequestId);
  }

  public tick(time: DOMHighResTimeStamp, engine: EngineInterface) {
    const newLetter = new Letter("P", 16);
    engine.add(newLetter);
  }

  public onTick(callback: TickCallback) {
    this._callbacks.push(callback);
  }
}

export default Runner;
