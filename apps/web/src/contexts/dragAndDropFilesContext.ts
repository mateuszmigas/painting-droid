import { createContext, useContext } from "react";

type DropAndDropFilesContext = {
  isDragging: boolean;
  setIsDragging: (isDragging: boolean) => void;
};

export const DropAndDropFilesContext = createContext<DropAndDropFilesContext>(
  {} as DropAndDropFilesContext
);

export const useDragAndDropFilesContext = () =>
  useContext<DropAndDropFilesContext>(DropAndDropFilesContext);

