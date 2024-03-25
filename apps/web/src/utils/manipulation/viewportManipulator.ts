import type { Position, Size } from "../common";
import { isMobile } from "../platform";
import { ThrottleHtmlManipulator } from "./throttleHtmlManipulator";
import { type Viewport, zoomAtPosition } from "./viewport";

type ViewportAction =
  | {
      type: "translate";
      offsetX: number;
      offsetY: number;
    }
  | { type: "zoomInAtPosition"; position: Position }
  | { type: "zoomOutAtPosition"; position: Position }
  | { type: "zoomAtPosition"; position: Position; zoom: number };

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
    case "zoomAtPosition": {
      return zoomAtPosition(viewport, action.zoom, action.position);
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
  private touchDistance = 0;
  private touchOffset = { width: 0, height: 0 };
  private pointerPosition = { x: 0, y: 0 };
  private isMoving = false;

  constructor(
    protected element: HTMLElement,
    protected getCurrentViewport: () => Viewport,
    private onViewportChange: (newViewport: Viewport) => void
  ) {
    super(element);

    if (isMobile()) {
      this.registerEvent("touchstart", this.onTouchStart);
      this.registerEvent("touchmove", this.onTouchMove);
      this.registerEvent("touchend", this.onTouchEnd);
    } else {
      this.registerEvent("pointerdown", this.onPointerDown);
      this.registerEvent("pointermove", this.onPointerMove);
      this.registerEvent("pointerup", this.onPointerUp);
      this.registerEvent("pointerleave", this.onPointerLeave);
      this.registerEvent("wheel", this.onWheel, { passive: true });
    }
  }

  private dispatchAction = (action: ViewportAction) => {
    const newViewport = reducer(this.getCurrentViewport(), action);
    this.onViewportChange(newViewport);
  };

  private onTouchStart = (e: TouchEvent) => {
    if (e.touches.length === 2) {
      const { x, y } = this.element.getBoundingClientRect();
      this.touchOffset = { width: x, height: y };
      this.pointerPosition = this.getTouchPosition(e, this.touchOffset);
      this.isMoving = true;
    }
  };

  private onTouchMove = (e: TouchEvent) => {
    if (this.isMoving) {
      if (e.touches.length > 1) {
        const distance = this.calculateTouchDistance(e);
        const touchPosition = this.getTouchPosition(e, this.touchOffset);

        if (this.touchDistance !== 0) {
          this.dispatchAction({
            type: "zoomAtPosition",
            position: touchPosition,
            zoom: distance / this.touchDistance,
          });
        }

        this.touchDistance = distance;
        this.dispatchAction({
          type: "translate",
          offsetX: touchPosition.x - this.pointerPosition.x,
          offsetY: touchPosition.y - this.pointerPosition.y,
        });
        this.pointerPosition = touchPosition;
      }
    }
  };

  private onTouchEnd = () => {
    this.isMoving = false;
    this.touchDistance = 0;
    this.touchOffset = { width: 0, height: 0 };
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

  private calculateTouchDistance = (e: TouchEvent) => {
    const x = e.touches[0].clientX - e.touches[1].clientX;
    const y = e.touches[0].clientY - e.touches[1].clientY;
    return Math.sqrt(x * x + y * y);
  };

  private getTouchPosition = (e: TouchEvent, offset: Size) => {
    return {
      x: (e.touches[0].clientX + e.touches[1].clientX) / 2 - offset.width,
      y: (e.touches[0].clientY + e.touches[1].clientY) / 2 - offset.height,
    };
  };
}
