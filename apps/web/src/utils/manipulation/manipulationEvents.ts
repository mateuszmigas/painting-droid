import type { Position } from "../common";
import { isMobile } from "../platform";

export const subscribeToManipulationEvents = (
  element: HTMLElement,
  onManipulationStart: (position: Position) => void,
  onManipulationUpdate: (position: Position) => void,
  onManipulationEnd: (position: Position) => void
) => {
  if (isMobile()) {
    const offset = { x: 0, y: 0 };
    const onTouchStart = (event: TouchEvent) => {
      if (event.touches.length !== 1) return;
      event.preventDefault();
      const rect = element.getBoundingClientRect();
      offset.x = rect.x;
      offset.y = rect.y;
      onManipulationStart({
        x: event.touches[0].clientX - offset.x,
        y: event.touches[0].clientY - offset.y,
      });
    };
    const onTouchMove = (event: TouchEvent) => {
      if (event.touches.length !== 1) return;
      event.preventDefault();
      onManipulationUpdate({
        x: event.touches[0].clientX - offset.x,
        y: event.touches[0].clientY - offset.y,
      });
    };
    const onTouchEnd = (event: TouchEvent) => {
      event.preventDefault();
      onManipulationEnd({
        x: event.changedTouches[0].clientX - offset.x,
        y: event.changedTouches[0].clientY - offset.y,
      });
    };
    element.addEventListener("touchstart", onTouchStart);
    element.addEventListener("touchmove", onTouchMove);
    element.addEventListener("touchend", onTouchEnd);

    return () => {
      element.removeEventListener("touchstart", onTouchStart);
      element.removeEventListener("touchmove", onTouchMove);
      element.removeEventListener("touchend", onTouchEnd);
    };
  }
  const onPointerDown = (event: PointerEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.button !== 0) return;
    onManipulationStart({
      x: event.offsetX,
      y: event.offsetY,
    });
  };
  const onPointerMove = (event: PointerEvent) => {
    event.preventDefault();
    event.stopPropagation();
    onManipulationUpdate({
      x: event.offsetX,
      y: event.offsetY,
    });
  };
  const onPointerUp = (event: PointerEvent) => {
    event.preventDefault();
    event.stopPropagation();
    onManipulationEnd({
      x: event.offsetX,
      y: event.offsetY,
    });
  };
  element.addEventListener("pointerdown", onPointerDown);
  element.addEventListener("pointermove", onPointerMove);
  element.addEventListener("pointerup", onPointerUp);

  return () => {
    element.removeEventListener("pointerdown", onPointerDown);
    element.removeEventListener("pointermove", onPointerMove);
    element.removeEventListener("pointerup", onPointerUp);
  };
};
