import type { TestApp } from "./testApp";

export const mouseActionBetweenRectangleCorners = async (
  app: TestApp,
  rectangle: { x: number; y: number; width: number; height: number },
) => {
  await app.moveMouse(rectangle.x, rectangle.y);
  await app.mouseDown();
  await app.moveMouse(rectangle.x + rectangle.width, rectangle.y);
  await app.moveMouse(rectangle.x + rectangle.width, rectangle.y + rectangle.height);
  await app.moveMouse(rectangle.x, rectangle.y + rectangle.height);
  await app.moveMouse(rectangle.x, rectangle.y);
  await app.mouseUp();
};

export const mouseActionBetweenPoints = async (app: TestApp, points: { x: number; y: number }[]) => {
  await app.moveMouse(points[0].x, points[0].y);
  await app.mouseDown();

  for (let i = 1; i < points.length; i++) {
    await app.moveMouse(points[i].x, points[i].y);
  }

  await app.mouseUp();
};
