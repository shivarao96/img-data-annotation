import { AfterContentChecked, AfterContentInit, AfterViewInit, Component, ElementRef, Inject, Input, ViewChild } from '@angular/core';
import { CanvasHandlerService } from '../services/canvas-handler.service';
import { CustomFabricObject } from '../model/models';
import { FABRIC_JS_TOKEN } from '../injection-token/fabric-token';

@Component({
    selector: 'app-canvas-editior',
    templateUrl: './canvas-editior.component.html',
    styleUrls: ['./canvas-editior.component.scss']
})
export class CanvasEditiorComponent implements AfterContentInit, AfterViewInit {

    canvas: fabric.Canvas | undefined;

    @Input() set imageDataURL(v: string) {
        /**istanbul ignore else */
        if (v) {
            this.canvashandler.imageDataUrl = v;
        }
    }

    constructor(private canvashandler: CanvasHandlerService, @Inject(FABRIC_JS_TOKEN) private fabricInstance: any) { }

    ngAfterContentInit() {
        this.setupCanvas()
    }

    ngAfterViewInit() {
        this.canvashandler.addBGImageSrcToCanvas()
    }

    setupCanvas() {
        this.cleanUpCanvas();
        this.canvas = new this.fabricInstance.Canvas('canvas', {
            selection: false,
            preserveObjectStacking: true
        }) as fabric.Canvas;
        this.canvashandler.canvas = this.canvas;
        this.setCanvasWidthAndHeight();
        this.canvashandler.extendToObjectWithId();
        this.fabricInstance.Object.prototype.objectCaching = false;
        this.addCanvasEventListners();
    }

    setCanvasWidthAndHeight(width=1280, height=800) {
        if(this.canvas) {
            this.canvas.setWidth(width);
            this.canvas.setHeight(height);
        } else {
            console.error('Canvas not found !');
        }
    }

    cleanUpCanvas() {
        /**istanbul ignore else */
        if (this.canvashandler.canvas) {
            this.canvashandler.canvas.dispose();
        }
    }

    addCanvasEventListners() {
        if (this.canvas) {
            this.canvas.on('mouse:down', this.canvasListnerMouseDown.bind(this));
            this.canvas.on('mouse:move', this.canvasListnerMouseMove.bind(this));
            this.canvas.on('mouse:up', this.canvasListnerMouseUp.bind(this));
            this.canvas.on('selection:created', this.canvasListnerSelectionCreated.bind(this));
        } else {
            console.error('Canvas not found !');
        }
    }

    canvasListnerMouseDown(e: any) {
        this.onCanvasMouseDown(e);
    }

    canvasListnerMouseMove(e: any) {
        this.onCanvasMouseMove(e)
    }

    canvasListnerMouseUp(e:any) {
        this.onCanvasMouseUp();
    }

    canvasListnerSelectionCreated(e:any) {
        this.onSelectionCreated(e);
    }

    onCanvasMouseDown(event: EventRef) {
        this.canvashandler.onMouseDown(event.e);
        event.e.stopPropagation();
    }

    onCanvasMouseMove(event: EventRef) {
        this.canvashandler.onMouseMove(event.e);
    }

    onCanvasMouseUp() {
        this.canvashandler.onMouseUp();
    }

    onSelectionCreated(event: any) {
        if (this.canvas) {
            if (!event.target && event.e) {
                var target = this.canvas.findTarget(<MouseEvent>(event.e), true);
                this.canvashandler.onObjectSelected(target as any)
            }
        } else {
            console.error('Canvas not found !')
        }
    }

    // saveChangeHistory() {
    //     this.canvashandler.logModification();
    // }

}


export interface EventRef {
    e: Event
}

// src/app/common/components/img-data-anotter/canvas-editior