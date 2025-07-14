/* @jsxImportSource solid-js */
import type { Viewport } from "@/utils/manipulation";
import { assertNever } from "@/utils/typeGuards";
import { Circle, type CircleProps } from "./circle.solid";
import { Ellipse, type EllipseProps } from "./ellipse.solid";
import { ImageRectangle, type ImageRectangleProps } from "./imageRectangle.solid";
import { Rectangle, type RectangleProps } from "./rectangle.solid";
import { SelectionCircle, type SelectionCircleProps } from "./selectionCircle.solid";
import { SelectionGrip, type SelectionGripProps } from "./selectionGrip.solid";
import { SelectionRectangle, type SelectionRectangleProps } from "./selectionRectangle.solid";

export type Shape2d =
  | ({ type: "circle" } & CircleProps)
  | ({ type: "rectangle" } & RectangleProps)
  | ({ type: "selection-circle" } & SelectionCircleProps)
  | ({ type: "selection-rectangle" } & SelectionRectangleProps)
  | ({ type: "selection-grip" } & SelectionGripProps)
  | ({ type: "image-rectangle" } & ImageRectangleProps)
  | ({ type: "ellipse" } & EllipseProps);

export const Shape = (props: { shape: Shape2d; viewport: Viewport }) => {
  switch (props.shape.type) {
    case "circle":
      return <Circle {...props.shape} viewport={props.viewport} />;
    case "rectangle":
      return <Rectangle {...props.shape} viewport={props.viewport} />;
    case "ellipse":
      return <Ellipse {...props.shape} viewport={props.viewport} />;
    case "selection-circle":
      return <SelectionCircle {...props.shape} viewport={props.viewport} />;
    case "selection-rectangle":
      return <SelectionRectangle {...props.shape} viewport={props.viewport} />;
    case "selection-grip":
      return <SelectionGrip {...props.shape} viewport={props.viewport} />;
    case "image-rectangle":
      return <ImageRectangle {...props.shape} viewport={props.viewport} />;
    default:
      return assertNever(props.shape);
  }
};
