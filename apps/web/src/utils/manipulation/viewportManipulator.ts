import type { Position } from "../common";
import { ThrottleHtmlManipulator } from "./throttleHtmlManipulator";
import { type Viewport, zoomAtPosition } from "./viewport";

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

  constructor(
    protected element: HTMLElement,
    protected getCurrentViewport: () => Viewport,
    private onViewportChange: (newViewport: Viewport) => void
  ) {
    super(element);

    this.registerEvent("pointerdown", this.onPointerDown);
    this.registerEvent("pointermove", this.onPointerMove);
    this.registerEvent("pointerup", this.onPointerUp);
    this.registerEvent("pointerleave", this.onPointerLeave);
    this.registerEvent("wheel", this.onWheel, { passive: true });
  }

  private dispatchAction = (action: ViewportAction) => {
    const newViewport = reducer(this.getCurrentViewport(), action);
    this.onViewportChange(newViewport);
  };

  private onPointerDown = (e: PointerEvent) => {
    if (e.button === 1) {
      this.pointerPosition = { x: e.offsetX, y: e.offsetY };
      this.isMoving = true;
    }
  };

  private onPointerMove = (e: PointerEvent) => {
    if (this.isMoving) {
      this.dispatchAction({
        type: "translate",
        offsetX: e.offsetX - this.pointerPosition.x,
        offsetY: e.offsetY - this.pointerPosition.y,
      });
    }

    this.pointerPosition = { x: e.offsetX, y: e.offsetY };
  };

  private onPointerUp = () => {
    this.isMoving = false;
  };

  private onPointerLeave = () => {
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
