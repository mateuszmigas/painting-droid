import { Position } from "../common";
import { ThrottleHtmlManipulator } from "./throttleHtmlManipulator";
import { Viewport, zoomAtPosition } from "./viewport";

type ViewportAction =
  | {
      type: "translate";
      offsetX: number;
      offsetY: number;
    }
  | { type: "zoomInAtPosition"; position: Position }
  | { type: "zoomOutAtPosition"; position: Position };

const reducer = (viewport: Viewport, action: ViewportAction): Viewport => {
  switch (action.type) {
    case "translate": {
      return {
        ...viewport,
        position: {
          x: viewport.position.x + action.offsetX,
          y: viewport.position.y + action.offsetY,
        },
      };
    }
    case "zoomInAtPosition": {
      return zoomAtPosition(viewport, 1.1, action.position);
    }
    case "zoomOutAtPosition": {
      return zoomAtPosition(viewport, 0.9, action.position);
    }
    default:
      return viewport;
  }
};

export class ViewportManipulator extends ThrottleHtmlManipulator {
  private pointerPosition = { x: 0, y: 0 };
  private isMoving = false;
  // private actionReducer: (actions: Action[]) => Viewport;

  constructor(
    protected element: HTMLElement,
    protected viewport: () => Viewport,
    private onViewportChange: (newViewport: Viewport) => void
  ) {
    super(element);

    this.registerEvent("mousedown", this.onMouseDown);
    this.registerEvent("mousemove", this.onMouseMove);
    this.registerEvent("mouseup", this.onMouseUp);
    this.registerEvent("mouseleave", this.onMouseLeave);
    this.registerEvent("wheel", this.onWheel);
  }

  private dispatchAction = (action: ViewportAction) => {
    const newViewport = reducer(this.viewport(), action);
    this.onViewportChange(newViewport);
  };

  private onMouseDown = (e: MouseEvent) => {
    if (e.button === 0 && e.shiftKey) {
      this.pointerPosition = { x: e.offsetX, y: e.offsetY };
      this.isMoving = true;
    }
  };

  private onMouseMove = (e: MouseEvent) => {
    if (this.isMoving) {
      this.dispatchAction({
        type: "translate",
        offsetX: e.offsetX - this.pointerPosition.x,
        offsetY: e.offsetY - this.pointerPosition.y,
      });
    }

    this.pointerPosition = { x: e.offsetX, y: e.offsetY };
  };

  private onMouseUp = () => {
    this.isMoving = false;
  };

  private onMouseLeave = () => {
    this.isMoving = false;
  };

  private onWheel = (e: WheelEvent) => {
    const action = e.deltaY < 0 ? "zoomInAtPosition" : "zoomOutAtPosition";

    this.dispatchAction({
      type: action,
      position: { x: e.offsetX, y: e.offsetY },
    });
  };
}

