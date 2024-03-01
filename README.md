# Painting Droid

<img src="assets/logo.webp" width="200" height="200">

Painting Droid is an AI-powered cross-platform painting app. It utilizes various AI models, ranging from paid providers to self-hosted open-source models, as well as some lightweight ones built into the app.

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

## Platform support

| Platform | Supported                 |
| -------- | ------------------------- |
| Browser  | yes (limited AI features) |
| Windows  | yes                       |
| MacOS    | yes                       |
| Linux    | yes                       |

## Roadmap

### Core features

- [ ] Basic UI layout
- [ ] Canvas manipulation
- [ ] Canvas layers
- [ ] Drawing tools: brush, pencil
- [ ] Undo/Redo functionality
- [ ] Command palette
- [ ] State preservation
- [ ] Custom 'Project' file format
- [ ] Saving and loading projects
- [ ] Area selection
- [ ] WASM effects

### AI features

- [ ] Stable Diffusion Docker image for local server
- [ ] Integration with DALL-E
- [ ] Integration with Stability.ai
- [ ] Integration with Midjourney

### License

[MIT](https://choosealicense.com/licenses/mit/)

