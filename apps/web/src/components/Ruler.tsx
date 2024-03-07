import { useListener, useStableCallback } from "@/hooks";
import { useResizeObserver } from "@/hooks/useResizeObserver";
import { Viewport } from "@/utils/manipulation";
import { Observable } from "@/utils/observable";
import { useEffect, useRef } from "react";

const rulerConfig = {
  dpi: window.devicePixelRatio,
  offset: 30,
  shortLine: 15,
  longLine: 30,
  lineThickness: 1,
  cellSizeDefault: 50,
  subCellsCount: 5,
  font: "16px Arial",
};

const calculateCellSize = (zoom: number) => {
  const { cellSizeDefault, subCellsCount: subCells } = rulerConfig;
  let cellSize = cellSizeDefault * zoom;

  while (cellSize > cellSizeDefault * subCells) {
    cellSize = cellSize / subCells;
  }

  while (cellSize < cellSizeDefault) {
    cellSize = cellSize * subCells;
  }

  return cellSize;
};

const drawRuler = (
  context: CanvasRenderingContext2D,
  viewport: Viewport,
  color: string,
  orientation: "horizontal" | "vertical"
) => {
  const {
    dpi,
    offset,
    shortLine,
    longLine,
    lineThickness,
    subCellsCount,
    font,
  } = rulerConfig;

  context.clearRect(0, 0, context.canvas.width, context.canvas.height);
  context.fillStyle = color;
  context.lineWidth = 1;
  context.font = font;

  const cellSize = calculateCellSize(viewport.zoom) * dpi;

  const total =
    (orientation === "horizontal"
      ? context.canvas.width
      : context.canvas.height) * dpi;

  const position =
    (orientation === "horizontal" ? viewport.position.x : viewport.position.y) *
    dpi;

  let start = (position % cellSize) - cellSize;

  while (start < total) {
    const pos = ~~(start - offset * dpi);

    if (orientation === "horizontal") {
      context.fillRect(pos, 0, lineThickness, longLine);

      for (let i = 0; i < subCellsCount; i++) {
        const subCellPos = ~~(pos + i * (cellSize / subCellsCount));
        context.fillRect(subCellPos, 0, lineThickness, shortLine);
      }

      const canvasPos = ~~Math.round((start - position) / viewport.zoom / dpi);
      context.fillText(canvasPos.toString(), pos + 4, longLine);
    } else {
      context.fillRect(0, pos, longLine, lineThickness);

      for (let i = 0; i < subCellsCount; i++) {
        const subCellPos = ~~(pos + i * (cellSize / subCellsCount));
        context.fillRect(0, subCellPos, shortLine, lineThickness);
      }

      const canvasPos = ~~Math.round((start - position) / viewport.zoom / dpi);
      context.save();
      context.textAlign = "right";
      context.translate(longLine, pos + 4);
      context.rotate(-Math.PI / 2);
      context.fillText(canvasPos.toString(), 0, 0);
      context.restore();
    }

    start += cellSize;
  }
};

export const Ruler = (props: { viewport: Observable<Viewport> }) => {
  const { viewport } = props;
  const canvasHorizontalRef = useRef<HTMLCanvasElement>(null);
  const canvasVerticalRef = useRef<HTMLCanvasElement>(null);
  const canvasHorizontalContextRef = useRef<CanvasRenderingContext2D | null>(
    null
  );
  const canvasVerticalContextRef = useRef<CanvasRenderingContext2D | null>(
    null
  );

  const drawRulers = useStableCallback((viewport: Viewport) => {
    const color = "grey";
    canvasHorizontalContextRef.current &&
      drawRuler(
        canvasHorizontalContextRef.current!,
        viewport,
        color,
        "horizontal"
      );
    canvasVerticalRef.current &&
      drawRuler(canvasVerticalContextRef.current!, viewport, color, "vertical");
  });

  useEffect(() => {
    if (canvasHorizontalRef.current) {
      const rectangle = canvasHorizontalRef.current.getBoundingClientRect();
      canvasHorizontalRef.current.width = rectangle.width;
      canvasHorizontalContextRef.current =
        canvasHorizontalRef.current.getContext("2d");
    }
    if (canvasVerticalRef.current) {
      const rectangle = canvasVerticalRef.current.getBoundingClientRect();
      canvasVerticalRef.current.height = rectangle.height;
      canvasVerticalContextRef.current =
        canvasVerticalRef.current.getContext("2d");
    }
  }, []);

  useListener(viewport, drawRulers);

  useResizeObserver(canvasHorizontalRef, (rectangle) => {
    if (canvasHorizontalRef.current) {
      canvasHorizontalRef.current.width = rectangle.width * rulerConfig.dpi;
    }
  });

  useResizeObserver(canvasVerticalRef, (rectangle) => {
    if (canvasVerticalRef.current) {
      canvasVerticalRef.current.height = rectangle.height * rulerConfig.dpi;
    }
  });

  return (
    <div className="absolute size-full pointer-events-none">
      <canvas
        ref={canvasHorizontalRef}
        height={rulerConfig.offset * rulerConfig.dpi}
        className="pixelated-canvas absolute left-[30px] h-[30px] w-full"
      ></canvas>
      <canvas
        ref={canvasVerticalRef}
        width={rulerConfig.offset * rulerConfig.dpi}
        className="pixelated-canvas absolute top-[30px] w-[30px] h-full"
      ></canvas>
      <div className=" size-[30px] border-r border-b flex justify-center items-center">
        PX
      </div>
    </div>
  );
};
