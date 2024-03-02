export type Position = {
  x: number;
  y: number;
};

export type Size = {
  width: number;
  height: number;
};

export type Rectangle = Position & Size;

export const scaleRectangle = (
  rectangle: Rectangle,
  scale: number
): Rectangle => ({
  x: rectangle.x * scale,
  y: rectangle.y * scale,
  width: rectangle.width * scale,
  height: rectangle.height * scale,
});

