import type { Page } from "@playwright/test";
import { testIds } from "../src/utils/testIds";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const mouseSleep = 10;
const keyboardSleep = 10;

export class TestApp {
  public static async from(page: Page) {
    const app = new TestApp(page);
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

  async selectTool(tool: string) {
    await this.page.getByTestId(testIds.toolButton(tool)).click();
  }

  async setToolSetting(settingKey: string, value: string) {
    const setting = await this.page.getByTestId(
      testIds.toolSetting(settingKey)
    );

    if (settingKey === "color") {
      await setting.click();
      const input = await this.page.getByTestId(testIds.colorPickerHexInput);
      await input.fill(value);
      await setting.click();
      await this.page.getByRole("dialog").waitFor({ state: "detached" });
    }

    if (settingKey === "size") {
      await setting.click();
      const select = await this.page.getByTestId(testIds.selectContent);
      await select.getByLabel(value).click();
    }
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

  async pressKey(key: string) {
    await this.page.keyboard.press(key);
  }

  async waitForCanvasApply() {
    await sleep(500);
  }
}

