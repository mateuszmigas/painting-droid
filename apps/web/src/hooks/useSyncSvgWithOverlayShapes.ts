import type { CanvasOverlayShape } from "@/canvas/canvasState";
import { useEffect, type RefObject } from "react";

export const useSyncSvgWithOverlayShape = (
  svgElementRef: RefObject<SVGSVGElement>,
  overlayShape: CanvasOverlayShape | null
) => {
  //todo
  useEffect(() => {
    if (svgElementRef.current === null) return;

    if (!overlayShape) {
      svgElementRef.current.innerHTML = "";
      return;
    }

    const rectangle = overlayShape;
    //optimize get or update
    const svgRect = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "rect"
    );
    svgRect.setAttribute("x", rectangle.position.x.toString());
    svgRect.setAttribute("y", rectangle.position.y.toString());
    svgRect.setAttribute("width", rectangle.size.width.toString());
    svgRect.setAttribute("height", rectangle.size.height.toString());
    svgRect.setAttribute("fill", "none");
    svgRect.setAttribute("stroke", "black");
    svgRect.setAttribute("stroke-width", "2");
    svgElementRef.current.appendChild(svgRect);
  }, [svgElementRef, overlayShape]);
};
