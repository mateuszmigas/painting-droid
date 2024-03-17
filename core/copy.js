const path = require("path");
const fs = require("fs");

const fileNames = [
    'core.js',
    'core.d.ts',
    'core_bg.wasm',
];

const targetDir = path.join(__dirname, "..", "apps", "web", "src", "wasm", "core");

fileNames.forEach(fileName => {
    const source = path.join(__dirname, "pkg", fileName);
    const target = path.join(targetDir, fileName);
    fs.copyFileSync(source, target);
});