import { useListener, useStableCallback } from "@/hooks";
import { useResizeObserver } from "@/hooks/useResizeObserver";
import type { Viewport } from "@/utils/manipulation";
import type { Observable } from "@/utils/observable";
import { type RefObject, useEffect, useRef } from "react";

const rulerConfig = {
  dpi: window.devicePixelRatio,
  offset: 20,
  shortLine: 12,
  longLine: 30,
  lineThickness: 1,
  cellSizeDefault: 50,
  subCellsCount: 5,
  font: `${10 * window.devicePixelRatio}px Consolas, monospace`,
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
  context.textBaseline = "top";
  context.font = font;
  const isHorizontal = orientation === "horizontal";

  const cellSize = calculateCellSize(viewport.zoom) * dpi;

  const total =
    (isHorizontal ? context.canvas.width : context.canvas.height) * dpi;

  const position =
    (isHorizontal ? viewport.position.x : viewport.position.y) * dpi;

  let start = (position % cellSize) - cellSize;

  while (start < total) {
    const pos = ~~(start - offset * dpi);

    if (isHorizontal) {
      context.fillRect(pos, 0, lineThickness, longLine);

      for (let i = 0; i < subCellsCount; i++) {
        const subCellPos = ~~(pos + i * (cellSize / subCellsCount));
        context.fillRect(subCellPos, 0, lineThickness, shortLine);
      }

      const canvasPos = ~~Math.round((start - position) / viewport.zoom / dpi);
      context.fillText(canvasPos.toString(), pos + 4, longLine / 2 - 3 / dpi);
    } else {
      context.fillRect(0, pos, longLine, lineThickness);

      for (let i = 0; i < subCellsCount; i++) {
        const subCellPos = ~~(pos + i * (cellSize / subCellsCount));
        context.fillRect(0, subCellPos, shortLine, lineThickness);
      }

      const canvasPos = ~~Math.round((start - position) / viewport.zoom / dpi);
      context.save();
      context.textAlign = "right";
      context.translate(longLine / 2 - 3 / dpi, pos + 4);
      context.rotate(-Math.PI / 2);
      context.fillText(canvasPos.toString(), 0, 0);
      context.restore();
    }

    start += cellSize;
  }
};

const color = "#64748B";

export const CanvasRulers = (props: {
  observableViewport: Observable<Viewport>;
}) => {
  const { observableViewport } = props;
  const canvasHorizontalRef = useRef<HTMLCanvasElement>(
    null
  ) as RefObject<HTMLCanvasElement>;
  const canvasVerticalRef = useRef<HTMLCanvasElement>(
    null
  ) as RefObject<HTMLCanvasElement>;
  const canvasHorizontalContextRef = useRef<CanvasRenderingContext2D | null>(
    null
  );
  const canvasVerticalContextRef = useRef<CanvasRenderingContext2D | null>(
    null
  );

  const drawHorizontalRuler = useStableCallback((viewport: Viewport) => {
    if (canvasHorizontalContextRef.current) {
      drawRuler(
        canvasHorizontalContextRef.current,
        viewport,
        color,
        "horizontal"
      );
    }
  });
  const drawVerticalRuler = useStableCallback((viewport: Viewport) => {
    if (canvasVerticalContextRef.current) {
      drawRuler(canvasVerticalContextRef.current, viewport, color, "vertical");
    }
  });
  const drawRulers = useStableCallback((viewport: Viewport) => {
    drawHorizontalRuler(viewport);
    drawVerticalRuler(viewport);
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
  }, [canvasVerticalRef.current, canvasHorizontalRef.current]);

  useListener(observableViewport, drawRulers, {
    triggerOnMount: true,
  });

  useResizeObserver(canvasHorizontalRef, (rectangle) => {
    if (canvasHorizontalRef.current) {
      canvasHorizontalRef.current.width = rectangle.width * rulerConfig.dpi;
      drawHorizontalRuler(observableViewport.getValue());
    }
  });

  useResizeObserver(canvasVerticalRef, (rectangle) => {
    if (canvasVerticalRef.current) {
      canvasVerticalRef.current.height = rectangle.height * rulerConfig.dpi;
      drawVerticalRuler(observableViewport.getValue());
    }
  });

  return (
    <div className="absolute size-full pointer-events-none overflow-hidden z-1">
      <canvas
        ref={canvasHorizontalRef}
        height={rulerConfig.offset * rulerConfig.dpi}
        className="bg-background pixelated-canvas absolute left-[20px] h-[20px] w-full"
      />
      <canvas
        ref={canvasVerticalRef}
        width={rulerConfig.offset * rulerConfig.dpi}
        className="bg-background pixelated-canvas absolute top-[20px] w-[20px] h-full"
      />
      <div className="size-[20px] border-r border-b flex justify-center text-xs items-center bg-background">
        PX
      </div>
    </div>
  );
};

