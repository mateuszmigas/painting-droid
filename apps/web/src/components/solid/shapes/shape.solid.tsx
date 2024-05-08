/* @jsxImportSource solid-js */
import type { Viewport } from "@/utils/manipulation";
import { Circle, type CircleProps } from "./circle.solid";
import { Rectangle, type RectangleProps } from "./rectangle.solid";
import {
  SelectionCircle,
  type SelectionCircleProps,
} from "./selectionCircle.solid";

export type CanvasShape =
  | ({ type: "circle" } & CircleProps)
  | ({ type: "rectangle" } & RectangleProps)
  | ({ type: "selection-circle" } & SelectionCircleProps);

export const Shape = (props: { shape: CanvasShape; viewport: Viewport }) => {
  switch (props.shape.type) {
    case "circle":
      return <Circle {...props.shape} viewport={props.viewport} />;
    case "rectangle":
      return <Rectangle {...props.shape} viewport={props.viewport} />;
    case "selection-circle":
      return <SelectionCircle {...props.shape} viewport={props.viewport} />;
    default:
      return null;
  }
};

