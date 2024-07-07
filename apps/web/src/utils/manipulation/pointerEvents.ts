import type { Position } from "../common";
import { isMobile } from "../platform";

export const subscribeToPointerEvents = (
  element: HTMLElement,
  onPointerDown: (position: Position) => void,
  onPointerMove: (position: Position) => void,
  onPointerUp: (position: Position) => void,
  onPointerLeave: () => void
) => {
  if (isMobile()) {
    const offset = { x: 0, y: 0 };
    const touchStart = (event: TouchEvent) => {
      if (event.touches.length !== 1) return;
      event.preventDefault();
      const rect = element.getBoundingClientRect();
      offset.x = rect.x;
      offset.y = rect.y;
      onPointerDown({
        x: event.touches[0].clientX - offset.x,
        y: event.touches[0].clientY - offset.y,
      });
    };
    const touchMove = (event: TouchEvent) => {
      if (event.touches.length !== 1) return;
      event.preventDefault();
      onPointerMove({
        x: event.touches[0].clientX - offset.x,
        y: event.touches[0].clientY - offset.y,
      });
    };
    const touchEnd = (event: TouchEvent) => {
      event.preventDefault();
      onPointerUp({
        x: event.changedTouches[0].clientX - offset.x,
        y: event.changedTouches[0].clientY - offset.y,
      });
    };
    element.addEventListener("touchstart", touchStart);
    element.addEventListener("touchmove", touchMove);
    element.addEventListener("touchend", touchEnd);
    element.addEventListener("pointerleave", onPointerLeave);

    return () => {
      element.removeEventListener("touchstart", touchStart);
      element.removeEventListener("touchmove", touchMove);
      element.removeEventListener("touchend", touchEnd);
      element.removeEventListener("pointerleave", onPointerLeave);
    };
  }
  const pointerDown = (event: PointerEvent) => {
    event.preventDefault();
    if (event.button !== 0) return;
    onPointerDown({
      x: event.offsetX,
      y: event.offsetY,
    });
  };
  const pointerMove = (event: PointerEvent) => {
    event.preventDefault();
    onPointerMove({
      x: event.offsetX,
      y: event.offsetY,
    });
  };
  const pointerUp = (event: PointerEvent) => {
    event.preventDefault();
    if (event.button !== 0) return;
    onPointerUp({
      x: event.offsetX,
      y: event.offsetY,
    });
  };
  element.addEventListener("pointerdown", pointerDown);
  element.addEventListener("pointermove", pointerMove);
  element.addEventListener("pointerleave", onPointerLeave);
  document.addEventListener("pointerup", pointerUp);

  return () => {
    element.removeEventListener("pointerdown", pointerDown);
    element.removeEventListener("pointermove", pointerMove);
    element.removeEventListener("pointerleave", onPointerLeave);
    document.removeEventListener("pointerup", pointerUp);
  };
};

