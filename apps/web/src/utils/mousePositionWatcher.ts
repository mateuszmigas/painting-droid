import type { Position } from "./common";
import { Observable } from "./observable";

document.addEventListener(
  "pointermove",
  (event) =>
    observableMousePosition.setValue({ x: event.clientX, y: event.clientY }),
  { capture: true }
);

export const observableMousePosition = new Observable<Position>({
  x: 0,
  y: 0,
});

