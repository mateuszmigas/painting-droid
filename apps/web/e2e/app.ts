import type { Page } from "@playwright/test";
import { testIds } from "./testIds";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const mouseSleep = 10;

export class PaintingDroidApp {
  public static async from(page: Page) {
    const app = new PaintingDroidApp(page);
    await page.goto("/");
    return app;
  }

  constructor(private page: Page) {}

  async getLayerCanvasBuffer(index: number) {
    const canvas = await this.page
      .getByTestId(testIds.canvasLayer(index))
      .elementHandle()!;
    const dataUrl = await canvas!.evaluate((node: HTMLCanvasElement) =>
      node.toDataURL()
    );
    const base64Data = dataUrl.split(",")[1];
    return Buffer.from(base64Data, "base64");
  }

  async getLayerCanvasBoundingBox(index: number) {
    const locator = await this.page.getByTestId(testIds.canvasLayer(index));
    const canvas = await locator.elementHandle();
    return (await canvas!.boundingBox())!;
  }

  selectTool(tool: string) {
    //todo}
  }

  async moveMouse(x: number, y: number) {
    await this.page.mouse.move(x, y);
    await sleep(mouseSleep);
  }

  async mouseDown() {
    await this.page.mouse.down();
    await sleep(mouseSleep);
  }

  async mouseUp() {
    await this.page.mouse.up();
    await sleep(mouseSleep);
  }
}

