export type PenToolConfig = {
  type: "pen";
  settings: {
    color: string;
    size: number;
  };
};

export type PencilToolConfig = {
  type: "pencil";
  settings: {
    color: string;
    size: number;
  };
};

export type DrawingToolConfig = PenToolConfig | PencilToolConfig;
export type DrawingToolType = DrawingToolConfig["type"];

