import { test, expect } from "@playwright/test";
import { TestApp } from "./testApp";

const drawRectangle = async (app: TestApp) => {
  const box = await app.getLayerCanvasBoundingBox(0);
  await app.moveMouse(box.x + 50, box.y + 50);
  await app.mouseDown();
  await app.moveMouse(box.x + box.width - 50, box.y + 50);
  await app.moveMouse(box.x + box.width - 50, box.y + box.height - 50);
  await app.moveMouse(box.x + 50, box.y + box.height - 50);
  await app.moveMouse(box.x + 50, box.y + 50);
  await app.mouseUp();
};

const drawTriangle = async (app: TestApp) => {
  const box = await app.getLayerCanvasBoundingBox(0);
  await app.moveMouse(box.x + box.width / 2, box.y + 50);
  await app.mouseDown();
  await app.moveMouse(box.x + box.width - 50, box.y + box.height - 50);
  await app.moveMouse(box.x + 50, box.y + box.height - 50);
  await app.moveMouse(box.x + box.width / 2, box.y + 50);
  await app.mouseUp();
};

test.describe("tools", () => {
  test("draws blue rectangle with brush", async ({ page }) => {
    const app = await TestApp.from(page);
    await app.selectTool("brush");
    await app.setToolSetting("color", "#0000ff");
    await app.setToolSetting("size", "10");
    await drawRectangle(app);
    const buffer = await app.getLayerCanvasBuffer(0);
    await expect(buffer).toMatchSnapshot(["tool-brush.png"]);
  });

  test("draws yellow triangle with pencil", async ({ page }) => {
    const app = await TestApp.from(page);
    await app.selectTool("pencil");
    await app.setToolSetting("color", "#ffff00");
    await drawTriangle(app);
    const buffer = await app.getLayerCanvasBuffer(0);
    await expect(buffer).toMatchSnapshot(["tool-pencil.png"]);
  });

  test("draw rectangle and erase part of it", async ({ page }) => {
    const app = await TestApp.from(page);
    await app.selectTool("brush");
    await drawRectangle(app);
    await app.selectTool("eraser");
    await app.setToolSetting("size", "20");
    await drawTriangle(app);
    const buffer = await app.getLayerCanvasBuffer(0);
    await expect(buffer).toMatchSnapshot(["tool-eraser.png"]);
  });

  test("fills triangle", async ({ page }) => {
    const app = await TestApp.from(page);
    await app.selectTool("pencil");
    await app.setToolSetting("color", "#ffff00");
    await drawTriangle(app);
    await app.selectTool("fill");
    await app.setToolSetting("color", "#ff0000");
    const box = await app.getLayerCanvasBoundingBox(0);
    await app.moveMouse(box.x + box.width / 2, box.y + box.height / 2);
    await app.mouseDown();
    const buffer = await app.getLayerCanvasBuffer(0);
    await expect(buffer).toMatchSnapshot(["tool-fill.png"]);
  });
});

