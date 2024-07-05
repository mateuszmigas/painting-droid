# Painting Droid

[Try It Online](https://www.paintingdroid.com) | [Download Desktop App](https://github.com/mateuszmigas/painting-droid/releases) | [Docs](https://mateusz-migas.gitbook.io/painting-droid-docs/) | [Board](https://github.com/users/mateuszmigas/projects/2) | [Feedback Hub](https://github.com/mateuszmigas/painting-droid/discussions/56)  

![Vercel](https://vercelbadge.vercel.app/api/mateuszmigas/painting-droid) ![Validate](https://github.com/mateuszmigas/painting-droid/actions/workflows/validate.yml/badge.svg)

---

https://github.com/mateuszmigas/painting-droid/assets/54471371/6cda0fc3-1363-4a5d-a46e-6be5113b1cba

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

## Platform support

| Platform | Details | Link |
| -------- | ------------------------- | -- |
| Dekstop  | Windows/MacOS | [Github Releases](https://github.com/mateuszmigas/painting-droid/releases) |
| Browser (Desktop)  | Chrome/Safari/Firefox  | [Web](https://painting-droid-web.vercel.app/) |
| Browser (Mobile)  | Not tested | [Web](https://painting-droid-web.vercel.app/) |
| Container | Docker/Kubernetes | [Docker Hub](https://hub.docker.com/r/mateuszmigas/painting-droid) |

## Overview

![Architecture](assets/arch.svg)

## How to develop

### Web app

#### ☁️ Github Codespaces

1. [![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/mateuszmigas/painting-droid)
2. Install the dependencies using `pnpm install`
3. Run the app using `pnpm dev:web`
   
#### 🖥️ Local Machine 

1. Install [pnpm](https://pnpm.io/installation) 
2. Clone the repository
3. Install the dependencies using `pnpm install`
4. Run the app using `pnpm dev:web`

#### 🐳 Dev Container 

1. Clone the repository
2. Make sure you have Docker, Visual Studio Code and [Dev Container](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) extension installed
3. Open the repository in Visual Studio Code
4. Open the command palette and run `Dev Containers: Reopen in Container`
5. Change pnpm store dir `pnpm config set store-dir ~/.local/share/pnpm/store`
6. Install the dependencies using `pnpm install`
8. Run the app using `pnpm dev:web`

### Desktop app

1. Clone the repository
2. Install [Tauri prerequisites](https://tauri.app/v1/guides/getting-started/prerequisites/)
3. Install the dependencies using `pnpm install`
4. Run the app using `pnpm dev:desktop`


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

- [x] Integration with Stable Diffusion local server
- [x] Integration with DALL-E api
- [x] Integration with Stability.ai api

### Post MVP

- [x] Use Blob instead of base64 for storing images
- [x] Use IndexDB instead of localStorage for image data
- [x] Chat with LLM about current layer
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
