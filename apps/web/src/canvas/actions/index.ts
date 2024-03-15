import { createCanvasAction as removeLayer } from "./removeLayer";
import { createCanvasAction as addLayer } from "./addLayer";
import { createCanvasAction as updateLayerData } from "./updateLayerData";
import { createCanvasAction as selectLayer } from "./selectLayer";
// duplicateLayer: (layerId: LayerId) => void;
// moveLayerUp: (layerId: LayerId) => void;
// moveLayerDown: (layerId: LayerId) => void;
// showLayer: (layerId: LayerId) => void;
// hideLayer: (layerId: LayerId) => void;

export const canvasActions = {
  removeLayer,
  addLayer,
  updateLayerData,
  selectLayer,
};

// duplicateLayer: (layerId: LayerId) => {
//   return set((state) =>
//     mapCanvasData(state, (canvasData) => {
//       const newLayerId = uuid();
//       const index = canvasData.layers.findIndex(
//         (layer) => layer.id === layerId
//       );
//       return {
//         ...canvasData,
//         layers: [
//           ...canvasData.layers.slice(0, index + 1),
//           {
//             ...canvasData.layers[index],
//             id: newLayerId,
//             name: `${canvasData.layers[index].name} copy`,
//           },
//           ...canvasData.layers.slice(index + 1),
//         ],
//         activeLayerIndex: index + 1,
//         history: [
//           ...canvasData.history,
//           { type: "duplicate", id: layerId, newLayerId },
//         ],
//       };
//     })
//   );
// },
// moveLayerUp: (layerId: LayerId) => {
//   return set((state) =>
//     mapCanvasData(state, (canvasData) => {
//       const currentIndex = canvasData.layers.findIndex(
//         (layer) => layer.id === layerId
//       );
//       const targetIndex = currentIndex + 1;
//       if (currentIndex === canvasData.layers.length - 1) {
//         return canvasData;
//       }
//       const layers = [...canvasData.layers];
//       const layer = layers[currentIndex];
//       layers[currentIndex] = layers[targetIndex];
//       layers[targetIndex] = layer;
//       return { ...canvasData, layers, activeLayerIndex: targetIndex };
//     })
//   );
// },
// moveLayerDown: (layerId: LayerId) => {
//   return set((state) =>
//     mapCanvasData(state, (canvasData) => {
//       const currentIndex = canvasData.layers.findIndex(
//         (layer) => layer.id === layerId
//       );
//       const targetIndex = currentIndex - 1;
//       if (currentIndex === 0) {
//         return canvasData;
//       }
//       const layers = [...canvasData.layers];
//       const layer = layers[currentIndex];
//       layers[currentIndex] = layers[targetIndex];
//       layers[targetIndex] = layer;
//       return { ...canvasData, layers, activeLayerIndex: targetIndex };
//     })
//   );
// },
// showLayer: (layerId: LayerId) => {
//   return set((state) =>
//     mapCanvasData(state, (canvasData) => ({
//       ...canvasData,
//       layers: canvasData.layers.map((layer) =>
//         layer.id === layerId ? { ...layer, visible: true } : layer
//       ),
//     }))
//   );
// },
// hideLayer: (layerId: LayerId) => {
//   return set((state) =>
//     mapCanvasData(state, (canvasData) => ({
//       ...canvasData,
//       layers: canvasData.layers.map((layer) =>
//         layer.id === layerId ? { ...layer, visible: false } : layer
//       ),
//     }))
//   );

