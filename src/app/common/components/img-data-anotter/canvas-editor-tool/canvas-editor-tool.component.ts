import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { CanvasHandlerService } from '../services/canvas-handler.service';
import { DrawingColors, DrawingTools } from '../model/models';

@Component({
    selector: 'app-canvas-editor-tool',
    templateUrl: './canvas-editor-tool.component.html',
    styleUrls: ['./canvas-editor-tool.component.scss']
})
export class CanvasEditorToolComponent {

    @Input() set toolColors(val: Array<string> | undefined) {
        /**istanbul ignore else */
        if (val && val.length) {
            this.colors = val;
        }
    }
    @Input() thickessRange: ThickNessRange | undefined;
    @Input() activeTools: ActiveTools | undefined
    @Input() toolStyleHandler: ToolsStyleHandler | undefined

    public url: string | ArrayBuffer | undefined;
    public DrawingTools = DrawingTools;
    public selected = this.canvasHandler.selectedTool;
    public colors: Array<string> = Object.values(DrawingColors);
    public selectedColor: string = this.canvasHandler.selectedColor;
    public selectedThickness: number = this.canvasHandler.selectedThickness;


    constructor(private canvasHandler: CanvasHandlerService) { }

    uploadImage() {
        if (this.url) {
            this.canvasHandler.addImageOnCanvas(this.url);
            this.url = undefined;
        } else {
            console.error('Not image found to upload !')
        }
    }

    fileReaderOnloadCallback(readerEvent: any) {
        this.url = readerEvent.target.result;
    }


    readUrl(event: any) {
        /**istanbul ignore else */
        if (event.target.files && event.target.files[0]) {
            const reader = new FileReader();
            reader.onload = this.fileReaderOnloadCallback.bind(this);
            reader.readAsDataURL(event.target.files[0]);
        }
    }

    cancelUpload() {
        this.url = undefined;
    }

    toolSelected(tool: DrawingTools) {
        this.canvasHandler.selectedTool = tool;
        this.selected = tool;
    }

    zoomIn() {
        this.canvasHandler.zoomIn();
    }

    zoomOut() {
        this.canvasHandler.zoomOut();
    }

    onSelect(color: DrawingColors | string) {
        this.canvasHandler.selectedColor = color;
        this.selectedColor = color;
    }

    saveAsImage() {
        this.canvasHandler.save();
    }

    changeThickNess(e: number) {
        this.canvasHandler.selectedThickness = e;
        this.selectedThickness = e;
    }

    // redo() {
    //     this.canvasHandler.redoModification();
    // }

    // undo() {
    //     this.canvasHandler.undoModification();
    // }

    btnActionOnClick(actionType: string, passedValue: any[]) {
        switch (actionType) {
            case 'toolSelected':
                this.toolSelected(passedValue[0]);
                break;
            case 'zoomIn':
                this.zoomIn();
                break;
            case 'zoomOut':
                this.zoomOut();
                break;
            case 'saveAsImage':
                this.saveAsImage();
                break;
            case 'uploadImage':
                this.uploadImage();
                break;
            case 'cancelUpload':
                this.cancelUpload();
                break;
            default:
                break;
        }

        if(actionType !== 'toolSelected') {
            this.canvasHandler.selectedTool = DrawingTools.NONE;
            this.selected = DrawingTools.NONE;
        }
    }

}

export interface ThickNessRange {
    lowerBound: number,
    higherBound: number
}

export interface ActiveTools {
    circle?: boolean | undefined,
    rectangle?: boolean | undefined,
    freehand?: boolean | undefined,
    line?: boolean | undefined,
    dashed_line?: boolean | undefined,
    text?: boolean | undefined,
}

export interface ToolsStyleHandler {
    width?: string,
    height?: string,
    primaryColor?: string,
    secondaryColor?: string,
    button?: {
        color?: string,
        borderColor?: string,
    },
    label?: {
        fontFamily?: string,
        fontSize?: string,
        labels?: {
            uploadImageLabel?: string,
            drawingToolLabel?: string,
            actionToolLabel?: string,
            changeThicknessLabel?: string,
            changeColorLabel?: string,
            saveAsLabel?: string
        }
    },
    images?: {
        uploadAction1?: string,
        uploadAction2?: string,
        cancelUpload?: string,
        selectTool?: string,
        eraseTool?: string,
        circleDrawTool?: string,
        rectangleDrawTool?: string,
        freeHandDrawTool?: string,
        lineDrawTool?: string,
        dashedLineDrawTool?: string,
        textDrawTool?: string,
        clearAll?: string,
        zoomIn?: string,
        zoomOut?: string,
        saveAs?: string
    }
}