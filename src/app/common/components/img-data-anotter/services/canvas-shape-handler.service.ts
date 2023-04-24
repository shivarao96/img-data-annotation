import { Inject, Injectable } from '@angular/core';
import { CursorPos, CustomFabricEllipse, CustomFabricIText, CustomFabricLine, CustomFabricPath, CustomFabricRect, DrawingColors, DrawingThinkness } from '../model/models';
import { v4 } from 'uuid';
import { FABRIC_JS_TOKEN } from '../injection-token/fabric-token';

@Injectable({
    providedIn: 'root'
})
export class UUIDService {
    uuid(): string {
        return v4();
    }
}

const DEFAULT_OPACITY = 0.4;
@Injectable({
    providedIn: 'root'
})
export class CanvasShapeHandlerService {
    
    constructor(@Inject(FABRIC_JS_TOKEN) private fabricInstance: any, private uuidService: UUIDService) {}

    setOpacity(color: DrawingColors | string, to: number) {
        return color.replace(/rgba?(\(\s*\d+\s*,\s*\d+\s*,\s*\d+)(?:\s*,.+?)?\)/, `rgba$1,${to})`);
    }

    createCircle(
        canvas: fabric.Canvas,
        thickness: DrawingThinkness | number,
        color: DrawingColors | string,
        cursorPos: CursorPos,
        fillColor: DrawingColors | string = 'rgba(0,0,255,1)',
        opacity: number = DEFAULT_OPACITY
    ): CustomFabricEllipse {

        const circle = new this.fabricInstance.Ellipse({
            left: cursorPos.x,
            top: cursorPos.y,
            strokeWidth: thickness,
            stroke: color,
            fill: this.setOpacity(fillColor, opacity),
            originX: 'left',
            originY: 'top',
            rx: 0,
            ry: 0,
            selectable: false,
            hasRotatingPoint: false
        }) as CustomFabricEllipse;

        circle.id = this.uuidService.uuid();
        canvas.add(circle);
        return circle;
    }

    createRectangle(
        canvas: fabric.Canvas,
        thickness: DrawingThinkness | number,
        colour: DrawingColors | string,
        cursor: CursorPos,
        fillColor: DrawingColors | string = 'rgba(0,0,255, 1)',
        opacity: number = DEFAULT_OPACITY
    ): CustomFabricRect {
        const rect = new this.fabricInstance.Rect({
            left: cursor.x,
            top: cursor.y,
            strokeWidth: thickness,
            stroke: colour,
            fill: this.setOpacity(fillColor, opacity),
            width: 0,
            height: 0,
            selectable: false,
            hasRotatingPoint: false,
        }) as CustomFabricRect;
        rect.id = this.uuidService.uuid();
        canvas.add(rect);
        return rect;
    }

    createPath(
        canvas: fabric.Canvas,
        selectedThickness: DrawingThinkness | number,
        selectedColour: DrawingColors | string,
        cursor: CursorPos,
    ): CustomFabricPath {
        const path = new this.fabricInstance.Path(`M ${cursor.x} ${cursor.y}`, {
            strokeWidth: selectedThickness,
            stroke: selectedColour,
            fill: '',
            selectable: false,
            hasRotatingPoint: false,
        }) as CustomFabricPath;
        path.id = this.uuidService.uuid();
        canvas.add(path);
        return path;
    }

    createLine(
        canvas: fabric.Canvas,
        selectedThickness: DrawingThinkness | number,
        selectedColour: DrawingColors | string,
        dashArray: number[],
        cursor: CursorPos,
        fillColor: DrawingColors | string = 'rgba(0,0,255,1)',
        opacity: number = DEFAULT_OPACITY
    ): CustomFabricLine {
        const line = new this.fabricInstance.Line([cursor.x, cursor.y, cursor.x, cursor.y], {
            strokeWidth: selectedThickness,
            stroke: selectedColour,
            fill: this.setOpacity(fillColor, opacity),
            strokeDashArray: dashArray,
            selectable: false,
            hasRotatingPoint: false,
        }) as CustomFabricLine;
        line.id = this.uuidService.uuid();
        canvas.add(line);
        return line;
    }

    createIText(
        canvas: fabric.Canvas,
        opts: {
            content?: string;
            thickness?: DrawingThinkness | number;
            color?: DrawingColors | string;
            pointer: { x: number; y: number };
            fontSize?: number;
        },
    ): CustomFabricIText {
        const iText = new this.fabricInstance.IText(opts.content || 'Text', {
            strokeWidth: opts.thickness || 1,
            stroke: opts.color || 'rgba(0,0,0,1)',
            fill: opts.color || 'rgba(0,0,0,1)',
            fontSize: opts.fontSize || 18,
            left: opts.pointer.x,
            top: opts.pointer.y,
            selectable: false,
            hasRotatingPoint: false,
        }) as CustomFabricIText;
        iText.id = this.uuidService.uuid();
        canvas.add(iText);
        return iText;
    }

    formCircle(ellipse: CustomFabricEllipse, initPos: CursorPos, pointer: CursorPos) {
        ellipse.set({
            rx: Math.abs((initPos.x - pointer.x) / 2),
            ry: Math.abs((initPos.y - pointer.y) / 2),
        });
        ellipse.setCoords();
    }

    formRectangle(rect: CustomFabricRect, initPos: CursorPos, pointer: CursorPos) {
        rect.set({
            width: Math.abs(initPos.x - pointer.x),
            height: Math.abs(initPos.y - pointer.y),
        });
        rect.set({ left: Math.min(pointer.x, initPos.x) });
        rect.set({ top: Math.min(pointer.y, initPos.y) });
        rect.setCoords();
    }

    formPath(path: CustomFabricPath, pointer: CursorPos) {
        const newLine = ['L', pointer.x, pointer.y];
        /**istanbul ingore else */
        if (path.path) {
            path.path.push(newLine as any);
        }
    }

    formLine(line: CustomFabricLine, pointer: CursorPos) {
        line.set({ x2: pointer.x, y2: pointer.y });
        line.setCoords();
    }

    finishPath(canvas: fabric.Canvas, path: CustomFabricPath): CustomFabricPath {
        canvas.remove(path);
        const newPath = new this.fabricInstance.Path(path.path, {
          strokeWidth: path.strokeWidth,
          stroke: path.stroke,
          fill: '',
          selectable: false,
          hasRotatingPoint: false,
        }) as CustomFabricPath;
        newPath.id = path.id;
        canvas.add(newPath);
        return newPath;
      }


}
