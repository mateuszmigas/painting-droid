import type { Rectangle, Size } from "./utils/common";

const translations = {
  panels: {
    layers: { title: "Layers" },
    history: { title: "History" },
    metadata: { title: "Metadata" },
  },
  canvasActions: {
    init: "New Image",
    addLayer: "Add Layer",
    applyShape: "Apply Shape",
    deselect: "Deselect",
    addCapturedArea: {
      rectangle: "Rectangle Select",
    },
    transformShape: {
      capturedRectangle: "Transform Rectangle",
    },
    duplicateLayer: "Duplicate Layer",
    mergeLayerDown: "Merge Layer Down",
    hideLayer: "Hide Layer",
    showLayer: "Show Layer",
    moveLayerDown: "Move Layer Down",
    moveLayerUp: "Move Layer Up",
    removeLayer: "Remove Layer",
    selectLayer: "Select Layer",
    cutCapturedArea: "Cut Selection",
    cropCanvas: "Crop Canvas",
    resizeCanvas: "Resize Canvas",
  },
  adjustments: {
    name: "Adjustments",
    grayscale: { name: "Grayscale" },
    sepia: { name: "Sepia" },
  },
  models: {
    name: "Model",
    prompt: "Prompt",
    labelObjects: {
      name: "Label Objects",
      result: {
        noObjects: "No objects detected",
      },
    },
    removeBackground: {
      name: "Remove Background",
    },
    chat: {
      name: "Chat",
    },
    textToImage: { name: "Text to Image" },
    imageToImage: { name: "Image to Image" },
    smartCrop: {
      name: "Smart Crop",
      result: {
        noObjects: "No objects detected",
      },
    },
    errors: {
      429: "Rate limit exceeded",
      401: "API key invalid",
      403: "API key unauthorized",
      500: "Internal server error",
      default: "Failed to process request",
    },
    options: {
      size: "Size",
      steps: "Steps",
      imageStrength: "Image Strength",
      quality: {
        name: "Quality",
        standard: "Standard",
        high: "High",
      },
    },
    config: {
      server: "Server",
    },
  },
  shapesTransform: {
    "generated-image": {
      add: "Generate Image",
      transform: "Transform Image",
      apply: "Apply Image",
    },
    "dropped-image": {
      add: "Drop Image",
      transform: "Transform Image",
      apply: "Apply Image",
    },
    "captured-rectangle": {
      add: "Select Rectangle",
      transform: "Transform Selection",
      apply: "Apply Selection",
    },
    "captured-area": {
      add: "Select Area",
      transform: "Transform Area",
      apply: "Apply Area",
    },
    "drawn-rectangle": {
      add: "Draw Rectangle",
      transform: "Transform Rectangle",
      apply: "Apply Rectangle",
    },
    "drawn-ellipse": {
      add: "Draw Ellipse",
      transform: "Transform Ellipse",
      apply: "Apply Ellipse",
    },
  },
  tools: {
    rectangleSelect: {
      name: "Rectangle Select",
    },
    magicWandSelect: {
      name: "Magic Wand Select",
      settings: {
        tolerance: "Tolerance",
      },
    },
    shapeDraw: {
      name: "Shape",
      settings: {
        type: {
          name: "Shape",
          options: {
            rectangle: "Rectangle",
            ellipse: "Ellipse",
          },
        },
        fillColor: "Fill",
        strokeColor: "Stroke",
        strokeWidth: "Stroke Width",
      },
    },
    brushDraw: {
      name: "Brush",
      settings: {
        color: "Color",
        size: "Size",
      },
    },
    pencilDraw: {
      name: "Pencil",
      settings: {
        color: "Color",
      },
    },
    eraserDraw: {
      name: "Eraser",
      settings: {
        size: "Size",
      },
    },
    fillDraw: {
      name: "Fill",
      settings: {
        color: "Color",
        tolerance: "Tolerance",
      },
    },
    sprayDraw: {
      name: "Spray",
      settings: {
        color: "Color",
        range: "Range",
        density: "Density",
      },
    },
  },
  alerts: {
    clearData: {
      title: "Clear Data",
      message: `Are you sure you want to clear all stored data? This will delete:
      
•	workspaces and images
•	settings
•	API keys
      
This action cannot be undone.`,
      confirm: "Clear",
    },
  },
  chat: {
    welcomeMessage: "Hello! I am your creative assistant. How can I assist you with your image?",
    errors: {
      noModels: "No chat models available. Go to settings to add some.",
    },
    suggestions: ["What objects are in this image?", "Suggest a filter for this image.", "Suggest image enhancements."],
  },
  dialogs: {
    settings: {
      title: "Settings",
      tabs: {
        general: {
          title: "General",
        },
        models: {
          title: "AI Models",
          addModel: "Add Model",
          message: "Models using API keys need a desktop version for secure storage",
        },
      },
    },
    welcome: {
      pages: {
        welcome: {
          title: "Welcome",
          message:
            "Hello! Welcome to Painting Droid. Let’s configure a few settings to get you started on your creative journey.",
        },
        theme: {
          title: "Theme",
          message: "Set your preferred theme. I can adapt to the system theme, or you can choose light or dark.",
        },
        models: {
          title: "Models",
          message:
            "I can use various AI models to assist you. This is the default list, but you can add your own. API key models are desktop-only. Check the documentation for self-hosting.",
        },
      },
    },
    editWorkspace: {
      title: "Edit Workspace",
      fields: {
        name: "Name",
        size: "Size",
        background: {
          name: "Background",
          title: "Background Color",
          options: {
            none: "None",
            solid: "Solid",
          },
        },
      },
    },
    createWorkspace: {
      title: "New Workspace",
      fields: {
        name: "Name",
        size: "Size",
        background: {
          name: "Background",
          title: "Background Color",
          options: {
            none: "None",
            solid: "Solid",
          },
        },
      },
    },
    cropCanvas: {
      title: "Crop Canvas",
      types: {
        percentage: "Percentage",
        absolute: "Absolute",
        offset: "Offset",
      },
      printCrop: (crop: Rectangle) => `Crop x: ${crop.x}, y: ${crop.y}, width: ${crop.width}, height: ${crop.height}`,
      errors: {
        tooSmall: "Crop area too small",
        outOfBounds: "Crop area out of bounds",
      },
    },
    resizeCanvas: {
      title: "Resize Canvas",
      types: {
        percentage: "Percentage",
        absolute: "Absolute",
      },
      printSize: (size: Size) => `Width: ${size.width}, Height: ${size.height}`,
      errors: {
        tooBig: "Canvas size too big",
        tooSmall: "Canvas size too small",
      },
    },
    imageToImage: {
      title: "Image to Image",
      defaultPrompt: "A beautiful landscape with a sunset behind",
      errors: {
        layerIsEmpty: "Layer is empty",
      },
    },
    removeBackground: {
      title: "Remove Background",
      errors: {
        layerIsEmpty: "Layer is empty",
      },
    },
    textToImage: {
      title: "Text to Image",
      defaultPrompt: "A cat in a hat",
    },
  },
  themes: {
    light: "Light",
    dark: "Dark",
    system: "System",
  },
  commandPalette: {
    placeholder: "Type a command or search...",
    noResults: "No results found",
  },
  commands: {
    clearActiveWorkspace: "Clear Workspace",
    closeActiveWorkspace: "Close Workspace",
    createActiveWorkspace: "New Workspace",
    openCropCanvasDialog: "Crop Canvas",
    openResizeCanvasDialog: "Resize Canvas",
    openSettingsDialog: "Open Settings",
    fitCanvasToWindow: "Fit Canvas to Window",
    openCommandPalette: "Open Command Palette",
    openChatPopup: "Open Chat",
    openFile: "Open File",
    redoCanvasAction: "Redo Canvas Action",
    undoCanvasAction: "Undo Canvas Action",
    editWorkspace: "Edit Workspace",
    editLayer: "Edit Layer",
    resetLayout: "Reset Layout",
    saveAsJpeg: "Save As JPEG",
    saveAsPng: "Save As PNG",
    saveAsWorkspace: "Save Workspace (PDW)",
    shareWorkspace: "Share Workspace (PNG)",
    addLayer: "Add Layer",
    removeLayer: "Remove Layer",
    moveLayerUp: "Move Layer Up",
    moveLayerDown: "Move Layer Down",
    duplicateLayer: "Duplicate Layer",
    mergeLayerDown: "Merge Layer Down",
    hideLayer: "Hide Layer",
    showLayer: "Show Layer",
    pasteImage: "Paste Image",
    copyImage: "Copy Image",
    cutImage: "Cut Image",
    checkForUpdate: "Check for Update",
    dropFiles: {
      createNewWorkspace: "Create New Workspace",
      addNewLayer: "Paste onto New Layer",
      pasteOntoActiveLayer: "Paste onto Active Layer",
    },
  },
  layers: {
    defaultBaseName: "Background",
    defaultNewName: (index: number) => `Layer ${index}`,
    defaultCopyName: (name: string) => `${name} copy`,
  },
  workspace: {
    defaultName: "Untitled",
  },
  general: {
    models: "Models",
    remove: "Remove",
    anchor: "Anchor",
    apply: "Apply",
    cancel: "Cancel",
    clear: "Clear",
    close: "Close",
    create: "Create",
    edit: "Edit",
    color: "Color",
    continue: "Continue",
    download: "Download",
    favorite: "Favorite",
    generate: "Generate",
    height: "Height",
    heightPercentage: "Height (%)",
    images: "Images",
    loading: "Loading",
    name: "Name",
    next: "Next",
    offsets: "Offsets",
    previous: "Previous",
    process: "Process",
    recent: "Recent",
    regenerate: "Regenerate",
    resize: "Resize",
    result: "Result",
    secret: "Secret (API Key)",
    theme: "Theme",
    unknown: "Unknown",
    update: "Update",
    untitled: "Untitled",
    width: "Width",
    widthPercentage: "Width (%)",
  },
  color: {
    hex: "Hex",
    rgba: {
      r: "Red",
      g: "Green",
      b: "Blue",
      a: "Alpha",
    },
  },
  info: {
    noModels: "No models configured",
  },
  errors: {
    noFilesDropped: "No files dropped. The file type is not supported.",
    noImageData: "No image data",
    processingError: "Processing error",
    copyClipboardError: "Copy to clipboard error. Operation not supported.",
    sharingNotSupported: "Sharing is not supported or allowed on this device",
  },
  updater: {
    updatedTo: (version: string) => `App updated to version ${version}`,
    available: "Update available",
    downloading: "Downloading update",
    notAvailable: "No updates available",
    installed: "Update installed",
    installedAndRestart: "Restart to apply changes",
    restart: "Restart",
    install: "Install",
    notifyDesktop: "Try desktop app for custom AI models",
  },
  links: {
    help: "Help",
    reportIssue: "Report Issue",
    viewSource: "View Source",
  },
};

export const getTranslations = () => translations;
