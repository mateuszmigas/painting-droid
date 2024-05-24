# Painting Droid

[Try It Online](https://painting-droid-web.vercel.app/) | [Download Desktop App](https://github.com/mateuszmigas/painting-droid/releases) | [Board](https://github.com/users/mateuszmigas/projects/2) | [Feedback Hub](https://github.com/mateuszmigas/painting-droid/discussions/56) | Progress: ▓▓▓▓▓▓▓▓░░ <span>85</span>% 

[![100 - Commitów](https://img.shields.io/badge/100-Commitów-2ea44f)](https://100commitow.pl/) ![Vercel](https://vercelbadge.vercel.app/api/mateuszmigas/painting-droid) ![Validate](https://github.com/mateuszmigas/painting-droid/actions/workflows/validate.yml/badge.svg)

---

<div align="center">

  <img src="assets/logo_big.webp" width="200" height="200">

</div>

---

Painting Droid is an AI-powered cross-platform painting app inspired by the legendary MS Paint, but expandable with plugins and open. It utilizes various AI models, from paid providers to self-hosted open-source models, as well as some lightweight ones built into the app. It works in the browser and as a desktop app on Windows, macOS, and Linux.

## Features

- Your regular painting app features (e.g., brush, annotate, fill, etc.).
- Fill selected areas with AI-generated content.
- Augment selected areas with AI-generated content (e.g., add a tree to a landscape or remove the background).
- Apply filters and effects to the entire image or a selected area.
- Resize, crop, rotate, and flip the image.
- Plugin support.
- Cross-platform compatibility.

## Overview

![Architecture](assets/arch.svg)

## How to develop

### Web app

If you don't have it, install [pnpm](https://pnpm.io/installation) (Not required for Github Codespaces).

#### Locally

1. Clone the repository
2. Install the dependencies using `pnpm install`
3. Run the app using `pnpm dev:web`

#### Using Dev Container

1. Clone the repository
2. Make sure you have Docker, Visual Studio Code and [Dev Container](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) extension installed
3. Open the repository in Visual Studio Code
4. Open the command palette and run `Dev Containers: Reopen in Container`
5. Change pnpm store dir `pnpm config set store-dir ~/.local/share/pnpm/store`
6. Install the dependencies using `pnpm install`
8. Run the app using `pnpm dev:web`

#### Using Github Codespaces

1. [![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/mateuszmigas/painting-droid)
2. Install the dependencies using `pnpm install`
3. Run the app using `pnpm dev:web`

### Desktop app

1. Clone the repository
2. Install [Tauri prerequisites](https://tauri.app/v1/guides/getting-started/prerequisites/)
3. Install the dependencies using `pnpm install`
4. Run the app using `pnpm dev:desktop`

## Platform support

| Platform | Supported                 |
| -------- | ------------------------- |
| Browser  | yes (limited AI features) |
| Windows  | yes                       |
| MacOS    | yes                       |
| Linux    | yes (not tested)          |

## Roadmap

### Core features

- [x] Basic UI layout
- [x] Canvas manipulation
- [x] Canvas layers
- [x] Drawing tools: brush, pencil
- [x] Undo/Redo functionality
- [x] Command palette
- [x] State preservation
- [x] Custom 'Project' file format
- [x] Saving and loading projects
- [x] Area selection
- [x] Responsive UI
- [x] Online Demo Model for Web
- [x] WASM adjustments mechanism
- [x] Some Offline JS Model
- [x] Image resize/crop
- [x] Clipboard support
- [x] Desktop app releases and autoupdate

### AI features (Desktop only)

- [ ] Stable Diffusion Docker image for local server
- [x] Integration with DALL-E
- [x] Integration with Stability.ai
- [ ] Integration with Midjourney

### Post MVP

- [x] Use Blob instead of base64 for storing images
- [x] Use IndexDB instead of localStorage for image data
- [ ] More image adjustments
- [x] More tools: fill, erase
- [ ] Magic Wand
- [ ] Text annotation tool
- [ ] Release notes popup
- [ ] Change renderer to webgl/webgpu
- [ ] Optimize image conversions with Rust
- [x] Custom app menu for MacOS
- [x] Shape tools: rectangle, circle
- [ ] Plugin support

### Contributions
Feel free to pick up any task from the [good first issue list](https://github.com/mateuszmigas/painting-droid/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22).
1. Create a feature branch and implement the feature.
2. Create a pull request when finished.
3. Check pipelines and for "Preview" deployment.
4. Wait for the core author to approve.

### License

[MIT](https://choosealicense.com/licenses/mit/)
