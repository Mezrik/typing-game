import { EngineInterface } from "./Engine";

type RequestAnimationFrame = (callback: FrameRequestCallback) => number;
type CancelAnimationFrame = (RequestID: number) => void;
type TickCallback = (
  time: DOMHighResTimeStamp,
  engine: EngineInterface
) => void;

/**
 * Runner class for a simple game loop. Uses requestAnimationFrames
 * with fallbacks to the different implementations.
 */
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
  /**
   * Starts the game loop.
   * @param  {EngineInterface} engine
   */
  public run(engine: EngineInterface) {
    const render = (time: DOMHighResTimeStamp = 0) => {
      this._frameRequestId = this._requestAnimationFrame(render);
      this.tick(time, engine);
    };

    render();
  }

  /**
   * Stops the game loop. Doesn't affect the engine. When ran
   * again the engine starts where it stopped.
   */
  public stop() {
    this._cancelAnimationFrame(this._frameRequestId);
  }

  /**
   * Runs all the tick handlers attached to this object.
   * Used internaly.
   *
   * @param  {DOMHighResTimeStamp} time
   * @param  {EngineInterface} engine
   */
  private tick(time: DOMHighResTimeStamp, engine: EngineInterface) {
    this._callbacks.forEach((callback) => callback(time, engine));
  }

  /**
   * Attach handle to the tick event.
   * @param  {TickCallback} callback Tick handler
   */
  public onTick(callback: TickCallback) {
    this._callbacks.push(callback);
  }
}

export default Runner;
