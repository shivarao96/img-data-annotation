import { Inject, Injectable } from '@angular/core';
import { CursorPos, CustomFabricEllipse, CustomFabricIText, CustomFabricLine, CustomFabricObject, CustomFabricPath, CustomFabricRect, DrawingColors, DrawingThinkness, DrawingTools, FabricObjectType } from '../model/models';
import { CanvasShapeHandlerService } from './canvas-shape-handler.service';
import * as saveAs from 'file-saver';
import { FABRIC_JS_TOKEN } from '../injection-token/fabric-token';

@Injectable({
  providedIn: 'root'
})
export class CanvasHandlerService {
  public imageDataUrl: string | undefined;
  public canvas: fabric.Canvas | undefined;
  private _selectedThickness: number = 1;
  set selectedThickness(val: number) {
    this._selectedThickness = val;
  }
  get selectedThickness() {
    return this._selectedThickness;
  }
  // private _history: Array<any> = [];
  // set history(val) {
  //   this._history = val;
  // }
  // get history() {
  //   return this._history;
  // }

  // private _modStepIndex: number = -1;
  // set modStepIndex(val) {
  //   this._modStepIndex = val;
  // }
  // get modStepIndex() {
  //   return this._modStepIndex;
  // }

  // private _prevStateIndex: number = -1;
  
  private _isMouseDown = false;
  set isMouseDown(val: boolean) {
    this._isMouseDown = val;
  }
  get isMouseDown() {
    return this._isMouseDown;
  }

  private _initPositionOfElement!: CursorPos;
  set initPositionOfElement(pos: CursorPos) {
    this._initPositionOfElement = pos;
  }
  get initPositionOfElement(): CursorPos {
    return this._initPositionOfElement;
  }
  
  private _selectedColor: string = 'rgba(0,0,0,1)';
  set selectedColor(color: string) {
    if (this.canvas) {
      this._selectedColor = color;
      this.canvas.discardActiveObject();
      this.canvas.renderAll();
    } else {
      console.error('Console not found !')
    }
  }
  get selectedColor(): string {
    return this._selectedColor;
  }

  empty_fn_ref: Function = () => { }
  
  private _selectedTool: DrawingTools = DrawingTools.NONE;
  get selectedTool(): DrawingTools {
    return this._selectedTool;
  }
  set selectedTool(tool: DrawingTools) {
    if (this.canvas) {
      this.canvas.discardActiveObject();
      this.canvas.renderAll();
      this._selectedTool = tool;
      if (
        this._selectedTool === DrawingTools.SELECT ||
        this._selectedTool === DrawingTools.ERASE
      ) {
        this.enableObjectsSelectableFlag(true);
      } else {
        this.enableObjectsSelectableFlag(false);
      }
      if (this.selectedTool === DrawingTools.CLEARALL) {
        const backgroundImage: any = this.canvas.backgroundImage;
        this.canvas.clear();
        this.canvas.setBackgroundImage(backgroundImage, this.empty_fn_ref);
      }
    } else {
      console.error('canvas not found !')
    }
  }

  private _elementUnderDrawing:
    | CustomFabricEllipse
    | CustomFabricRect
    | CustomFabricPath
    | CustomFabricLine
    | CustomFabricIText
    | undefined;
  set elementUnderDrawing(val: any) {
    this._elementUnderDrawing = val;
  }
  get elementUnderDrawing() {
    return this._elementUnderDrawing;
  }


  constructor(private canvasShapeHandler: CanvasShapeHandlerService, @Inject(FABRIC_JS_TOKEN) private fabricInstance: any) {}

  imgOnLoadAction(img: any, rejectCallback: Function, resolveCallback: Function) {
    if (this.canvas === undefined) {
      rejectCallback('Canvas instance not found !');
    } else {
      const f_img: any = new this.fabricInstance.Image(img);
      this.canvas.setWidth(f_img.width);
      this.canvas.setHeight(f_img.height);
      this.canvas.setBackgroundImage(f_img, resolveCallback);
    }
  }

  // --  @TODO :: look into resource to mock Image class actions: [onload, onerror]
  addBGImageSrcToCanvas(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (!this.imageDataUrl) {
        reject('Image URL not found !');
      } else {
        const img = new Image();
        img.onload = async () => {
          this.imgOnLoadAction(img, reject, resolve);
        }
        img.onerror = () => {
          reject('Image loading failed !');
        };
        img.src = this.imageDataUrl;
      }
    });
  }

  // -- @TODO :: break this function to ease unit test case
  extendToObjectWithId(): void {
    this.fabricInstance.Object.prototype.toObject = (function (toObject) {
      return function (this: any) {
        return this.fabricInstance.util.object.extend(toObject.call(this), {
          id: this.id,
        });
      };
    })(this.fabricInstance.Object.prototype.toObject);
  }

  setupCanvasRefForImg() {
    const currentRef = this;
    return function(image: any) {
      image.set({
        left: 10,
        top: 10,
        angle: 0,
        padding: 10,
        cornerSize: 10,
        hasRotatingPoint: true
      });
      image.scaleToWidth(200);
      image.scaleToHeight(200);
      if (currentRef.canvas) {
        currentRef.canvas.add(image);
        currentRef.extendToObjectWithId.call(currentRef);
        currentRef.canvas.discardActiveObject().renderAll();
        currentRef.canvas.setActiveObject(image);
      } else {
        console.error('Canvas not found !')
      }
    }
  }

  addImageOnCanvas(url: string | ArrayBuffer) {
    if (url) {
      this.fabricInstance.Image.fromURL(url as string, this.setupCanvasRefForImg());
    } else {
      console.error('Unable to upload image !');
    }
  }

  enableObjectsSelectableFlag(flag: boolean) {
    if (this.canvas) {
      this.canvas.forEachObject(obj => {
        obj.selectable = flag;
        obj.perPixelTargetFind = flag
      });
    } else {
      console.error('Canvas not found !');
    }
  }

  onMouseDown(e: Event) {
    if (this.canvas) {
      this._isMouseDown = true;
      const currentPointer = this.canvas.getPointer(e) || { x: 0, y: 0 };
      /**istanbul ignore else */
      if (currentPointer) {
        this._initPositionOfElement = { x: currentPointer?.x, y: currentPointer?.y };
      }
      switch (this._selectedTool) {
        case DrawingTools.CIRCLE:
          this._elementUnderDrawing = this.canvasShapeHandler.createCircle(
            this.canvas,
            this.selectedThickness,
            this._selectedColor,
            currentPointer
          )
          break;
        case DrawingTools.RECTANGLE:
          this._elementUnderDrawing = this.canvasShapeHandler.createRectangle(
            this.canvas,
            this.selectedThickness,
            this._selectedColor,
            currentPointer
          );
          break;
        case DrawingTools.FREEHAND:
          this._elementUnderDrawing = this.canvasShapeHandler.createPath(
            this.canvas,
            this.selectedThickness,
            this._selectedColor,
            currentPointer
          )
          break;
        case DrawingTools.LINE:
          this._elementUnderDrawing = this.canvasShapeHandler.createLine(
            this.canvas,
            this.selectedThickness,
            this._selectedColor,
            [5, 0],
            currentPointer
          );
          break;
        case DrawingTools.DASHED_LINE:
          this._elementUnderDrawing = this.canvasShapeHandler.createLine(
            this.canvas,
            this.selectedThickness,
            this._selectedColor,
            [5, 5],
            currentPointer
          );
          break;
        case DrawingTools.TEXT:
          this._elementUnderDrawing = this.canvasShapeHandler.createIText(
            this.canvas,
            {
              thickness: this.selectedThickness / 2,
              color: this._selectedColor,
              pointer: currentPointer
            }
          )
          break;
        default:
          break;
      }
    } else {
      console.error('Canvas not found !');
    }
  }

  onMouseMove(e: Event) {
    if (this.canvas) {
      /**istanbul ignore else */
      if (this._initPositionOfElement && this._isMouseDown) {
        const currentPointer = this.canvas.getPointer(e);
        switch (this._selectedTool) {
          case DrawingTools.CIRCLE:
            this.canvasShapeHandler.formCircle(
              this._elementUnderDrawing as CustomFabricEllipse,
              this._initPositionOfElement,
              currentPointer
            )
            break;
          case DrawingTools.RECTANGLE:
            this.canvasShapeHandler.formRectangle(
              this._elementUnderDrawing as CustomFabricRect,
              this._initPositionOfElement,
              currentPointer
            )
            break;
          case DrawingTools.FREEHAND:
            this.canvasShapeHandler.formPath(this._elementUnderDrawing as CustomFabricPath, currentPointer);
            break;
          case DrawingTools.LINE:
          case DrawingTools.DASHED_LINE:
            this.canvasShapeHandler.formLine(this._elementUnderDrawing as CustomFabricLine, currentPointer);
            break;
          default:
            break;
        }
  
        this.canvas.renderAll();
      }
    } else {
      console.error('Canvas not found !')
    }
  }

  onMouseUp() {
    if (this.canvas) {
      this._isMouseDown = false;
      /**istanbul ignore else */
      if (this._selectedTool === DrawingTools.FREEHAND) {
        this._elementUnderDrawing = this.canvasShapeHandler.finishPath(this.canvas, this._elementUnderDrawing as CustomFabricPath);
      }
      /**istanbul ignore else */
      if (this._selectedTool !== DrawingTools.SELECT) {
        this.canvas.renderAll();
      }
    } else {
      console.error('Canvas not found !')
    }
  }

  onObjectSelected(obj: CustomFabricObject): void {
    if (obj && this.canvas) {
      /**istanbul ignore else */
      if (this._selectedTool === DrawingTools.ERASE) {
        this.canvas.remove(obj);
      }
    } else {
      console.error('Failed to erase item')
    }
  }

  zoomIn() {
    if (this.canvas) {
      this.canvas.setZoom(this.canvas.getZoom() * 1.1);
      this.canvas.setHeight(this.canvas.getHeight() * 1.1);
      this.canvas.setWidth(this.canvas.getWidth() * 1.1);
    } else {
      console.error('Canvas not found !')
    }
  }

  zoomOut() {
    if (this.canvas) {
      this.canvas.setZoom(this.canvas.getZoom() / 1.1);
      this.canvas.setHeight(this.canvas.getHeight() / 1.1);
      this.canvas.setWidth(this.canvas.getWidth() / 1.1);
    } else {
      console.error('Canvas not found !')
    }
  }

  // -- @TODO 
  save() {
    if (this.canvas) {
      const src = this.canvas.toDataURL({
        format: 'png'
      });
      saveAs(src, "screenshot.png");
    } else {
      console.error('Canvas not found !')
    }
  }

  // logModification() {
  //   /**istanbul ignore else */
  //   if (this._history.length > 9) {  // will store only 10 changes
  //     this._history.shift();
  //   }
  //   /**istanbul ignore else */
  //   if (this._modStepIndex >= 0 && this._modStepIndex !== this._history.length - 1) {
  //     this._history = this._history.splice(0, this._modStepIndex);
  //   }
  //   const canvasJson = this.canvas?.toJSON();
  //   this._history.push(canvasJson)
  //   this._modStepIndex = this._history.length - 1;
  // }

  // redoModification() {
  //   if (this.canvas) {
  //     /**istanbul ignore else */
  //     if (this._modStepIndex < this._history.length) {
  //       this._prevStateIndex = this._modStepIndex;
  //       this.canvas.clear().renderAll();
  //       const json = 
  //           this._history[this._modStepIndex];
  //       this.canvas.loadFromJSON(json, () => {
  //         this.canvas?.renderAll();
  //         this._modStepIndex = Math.min(this._history.length - 1, this._modStepIndex + 1);
  //       });
  //     }
  //   } else {
  //     console.error('Canvas not found !')
  //   }
  // }

  // undoModification() {
  //   if (this.canvas) {
  //     /**istanbul ignore else */
  //     if(this._modStepIndex >= 0) {
  //       this._prevStateIndex = this._modStepIndex;
  //       this.canvas.clear().renderAll();
  //         const json = 
  //           this._history[this._modStepIndex - 1];
  //         this.canvas.loadFromJSON(json, ()=>{
  //           this.canvas?.renderAll();
  //           this._modStepIndex = Math.max(0, this._modStepIndex - 1); 
  //         });
  //     }
  //   } else {
  //     console.error('Canvas not found !')
  //   }
  // }

}
