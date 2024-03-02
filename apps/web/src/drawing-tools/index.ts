type PenTool = {
  type: "pen";
  settings: {
    color: string;
    size: number;
  };
};

type PencilTool = {
  type: "pencil";
  settings: {
    color: string;
    size: number;
  };
};

export type DrawingTool = PenTool | PencilTool;
export type DrawingToolType = DrawingTool["type"];

