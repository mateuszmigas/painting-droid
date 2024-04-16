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
    applySelection: "Apply Selection",
    deselect: "Deselect",
    drawOverlayShape: {
      rectangle: "Rectangle Select",
    },
    transformOverlayShape: {
      rectangle: "Move Rectangle",
    },
    duplicateLayer: "Duplicate Layer",
    hideLayer: "Hide Layer",
    showLayer: "Show Layer",
    moveLayerDown: "Move Layer Down",
    moveLayerUp: "Move Layer Up",
    removeLayer: "Remove Layer",
    selectLayer: "Select Layer",
    cutOverlayShape: "Cut Selection",
    cropCanvas: "Crop Canvas",
    resizeCanvas: "Resize Canvas",
  },
  adjustments: {
    name: "Adjustments",
    grayscale: { name: "Grayscale" },
    sepia: { name: "Sepia" },
  },
  models: {
    name: "Models",
    objectDetection: {
      name: "Object Detection",
      result: {
        noObjects: "No objects detected",
      },
    },
    textToImage: { name: "Text to Image" },
  },
  tools: {
    shape: {
      rectangleSelect: {
        name: "Rectangle Select",
      },
    },
    draw: {
      brush: {
        name: "Brush",
        settings: {
          color: "Color",
          size: "Size",
        },
      },
      pencil: {
        name: "Pencil",
        settings: {
          color: "Color",
        },
      },
      eraser: {
        name: "Eraser",
        settings: {
          size: "Size",
        },
      },
    },
  },
  dialogs: {
    cropCanvas: {
      title: "Crop Canvas",
      types: {
        percentage: "Percentage",
        absolute: "Absolute",
        offset: "Offset",
      },
      printCrop: (crop: Rectangle) =>
        `Crop x: ${crop.x}, y: ${crop.y}, width: ${crop.width}, height: ${crop.height}`,
      errors: {
        tooSmall: "Crop area too small",
        outOfBounds: "Crop area out of bounds",
      },
    },
    settings: {
      title: "Settings",
      types: {
        general: "General",
        models: "Models",
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
  },
  themes: {
    light: "Light",
    dark: "Dark",
    system: "System",
  },
  commands: {
    clearActiveWorkspace: "Clear Workspace",
    closeActiveWorkspace: "Close Workspace",
    newActiveWorkspace: "New Workspace",
    openCropCanvasDialog: "Crop Canvas",
    openResizeCanvasDialog: "Resize Canvas",
    openSettingsDialog: "Open Settings",
    fitCanvasToWindow: "Fit Canvas to Window",
    openCommandPalette: "Open Command Palette",
    openFile: "Open File",
    redoCanvasAction: "Redo Canvas Action",
    undoCanvasAction: "Undo Canvas Action",
    resetLayout: "Reset Layout",
    saveAsJpeg: "Save As JPEG",
    saveAsPng: "Save As PNG",
    saveAsWorkspace: "Save Workspace (PDW)",
    addLayer: "Add Layer",
    removeLayer: "Remove Layer",
    moveLayerUp: "Move Layer Up",
    moveLayerDown: "Move Layer Down",
    duplicateLayer: "Duplicate Layer",
    hideLayer: "Hide Layer",
    showLayer: "Show Layer",
    pasteImage: "Paste Image",
    copyImage: "Copy Image",
    cutImage: "Cut Image",
    checkForUpdate: "Check for Update",
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
    anchor: "Anchor",
    apply: "Apply",
    cancel: "Cancel",
    close: "Close",
    height: "Height",
    heightPercentage: "Height (%)",
    images: "Images",
    loading: "Loading",
    offsets: "Offsets",
    process: "Process",
    resize: "Resize",
    result: "Result",
    theme: "Theme",
    unknown: "Unknown",
    width: "Width",
    widthPercentage: "Width (%)",
  },
  errors: {
    noImageData: "No image data",
    processingError: "Processing error",
    copyClipboardError: "Copy to clipboard error. Operation not supported.",
  },
  updater: {
    available: "Update available",
    downloading: "Downloading update",
    notAvailable: "No updates available",
    installed: "Update installed",
    installedAndRestart: "Restart to apply changes",
    restart: "Restart",
    install: "Install",
  },
};

export const getTranslations = () => translations;

