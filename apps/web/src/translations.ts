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
  commands: {
    clearActiveWorkspace: "Clear Workspace",
    closeActiveWorkspace: "Close Workspace",
    newActiveWorkspace: "New Workspace",
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
    apply: "Apply",
    cancel: "Cancel",
    unknown: "Unknown",
    process: "Process",
    result: "Result",
    loading: "Loading",
    images: "Images",
  },
  errors: {
    noImageData: "No image data",
    processingError: "Processing error",
    copyClipboardError: "Copy to clipboard error. Operation not supported.",
  },
  updater: {
    available: "Update available",
    installed: "Update installed",
    restart: "Restart",
    install: "Install",
  },
};

export const getTranslations = () => translations;
