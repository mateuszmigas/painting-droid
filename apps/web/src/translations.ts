export const getTranslations = () => {
  return translations_;
};

export const translations_ = {
  panels: {
    tools: { title: "Tools" },
    effects: { title: "Effects (Rust/WASM)" },
    layers: { title: "Layers" },
    history: { title: "History" },
    metadata: { title: "Metadata" },
  },
  effects: {
    grayscale: "Grayscale",
    sepia: "Sepia",
  },
  canvasActions: {
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
  layers: {
    defaultName: (index: number) => `Layer ${index}`,
    defaultCopyName: (name: string) => `${name} copy`,
  },
  unknown: "Unknown",
};
