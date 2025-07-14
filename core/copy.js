import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const fileNames = ["core.js", "core.d.ts", "core_bg.wasm"];

const targetDir = path.join(__dirname, "..", "apps", "web", "src", "wasm", "core");

fileNames.forEach((fileName) => {
  const source = path.join(__dirname, "pkg", fileName);
  const target = path.join(targetDir, fileName);
  fs.copyFileSync(source, target);
});
