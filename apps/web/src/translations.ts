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
  },
  adjustments: {
    grayscale: { name: "Grayscale" },
    sepia: { name: "Sepia" },
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
    },
  },
  commands: {
    clearActiveWorkspace: "Clear Workspace",
    closeActiveWorkspace: "Close Workspace",
    createActiveWorkspace: "Create New Workspace",
    fitCanvasToWindow: "Fit Canvas to Window",
    openCommandPalette: "Open Command Palette",
    openWorkspace: "Open Workspace (PDW)",
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
  },
};

export const getTranslations = () => translations;
