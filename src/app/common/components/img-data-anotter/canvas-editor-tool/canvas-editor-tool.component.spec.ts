import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CanvasEditorToolComponent } from './canvas-editor-tool.component';
import { DrawingTools } from '../model/models';
import { CanvasHandlerService } from '../services/canvas-handler.service';

const mockCanvasShapeHandler = {
    selectedTool: DrawingTools.NONE,
    selectedColor: 'rgba(255,0,0,0.8)',
    addImageOnCanvas: function (url: string) { },
    zoomIn: function () { },
    zoomOut: function () { },
    selectedThickness: function () { },
    save: function () { }
}

describe('CanvasEditorToolComponent', () => {
    let component: CanvasEditorToolComponent;
    let fixture: ComponentFixture<CanvasEditorToolComponent>;
    let canvasHandler: CanvasHandlerService;

    beforeEach(async () => {
        TestBed.configureTestingModule({
            declarations: [
                CanvasEditorToolComponent
            ],
            providers: [
                { provide: CanvasHandlerService, useValue: mockCanvasShapeHandler }
            ]
        });
    });

    function compileComponents() {
        TestBed.compileComponents();
        fixture = TestBed.createComponent(CanvasEditorToolComponent);
        component = fixture.componentInstance;
        canvasHandler = fixture.debugElement.injector.get(CanvasHandlerService);
    }

    it('should create', () => {
        compileComponents();
        expect(component).toBeTruthy();
    });

    it('should call toolColors @Input', () => {
        compileComponents();
        const test = ['RED', 'GREEN', 'YELLOW']
        component.toolColors = test;
        expect(component.colors).toEqual(test);
        
    });

    it('should call uploadImage when URL is present', () => {
        compileComponents();
        spyOn(canvasHandler, 'addImageOnCanvas');
        const test = 'data/+123'
        component.url = test;
        component.uploadImage();
        expect(canvasHandler.addImageOnCanvas).toHaveBeenCalled();
        expect(canvasHandler.addImageOnCanvas).toHaveBeenCalledWith(test);
        expect(component.url).toBe(undefined as any);
        
    });

    it('should call uploadImage when URL is no present', () => {
        compileComponents();
        spyOn(console, 'error');
        component.url = undefined;
        component.uploadImage();
        expect(console.error).toHaveBeenCalledWith('Not image found to upload !');
        
    });

    it('should call fileReaderOnloadCallback', () => {
        compileComponents();
        component.url = 'TEST 1';
        component.fileReaderOnloadCallback({
            target: {
                result: 'TEST 2'
            }
        });
        expect(component.url).toBe('TEST 2');
        
    });

    it('should call readUrl', () => {
        compileComponents();
        const exampleTestEvent = {
            target: {
                files: [
                    {
                        test: 'OK !'
                    }
                ]
            }
        };
        const testFileReader = {
            onload: function () { },
            readAsDataURL: function (someData: any) { }
        } as any;
        spyOn(window, 'FileReader').and.returnValue(testFileReader);
        spyOn(testFileReader, 'readAsDataURL')
        spyOn(component, 'fileReaderOnloadCallback');
        component.readUrl(exampleTestEvent);
        expect(window.FileReader).toHaveBeenCalled();
        expect(testFileReader.readAsDataURL).toHaveBeenCalled();
        expect(testFileReader.readAsDataURL).toHaveBeenCalledWith({
            test: 'OK !'
        });
        // -- // @TODO:: Look into the gist how you did it in rialtic !
        // expect(component.fileReaderOnloadCallback).toHaveBeenCalled();
        // expect(component.url).toBe('HEllo') 
        
    });

    it('should set url property', () => {
        compileComponents();
        const inputElement = document.createElement('input');
        inputElement.type = 'file';
        spyOn(inputElement, 'click');
        spyOn(window, 'FileReader').and.callFake(function() {
            this.readAsDataURL = function() {
                this.onload({ target: { result: 'data:image/png;base64,iVBORw0KG' } });
            };
        } as any);
        const event = new MouseEvent('change', { bubbles: true });
        Object.defineProperty(event, 'target', { writable: false, value: { files: [new Blob([''], { type: 'image/png' })] } });
        component.readUrl(event);
        expect(component.url).toBe('data:image/png;base64,iVBORw0KG');
    });

    it('should not set url property if no file is selected', () => {
        compileComponents();
        spyOn(window, 'FileReader');
        const event = new MouseEvent('change', { bubbles: true });
        Object.defineProperty(event, 'target', { writable: false, value: { files: [] } });
        component.readUrl(event);
        expect(component.url).toBeUndefined();
    });

    it('should call cancelUpload', () => {
        compileComponents();
        component.url = 'tralalala';
        component.cancelUpload();
        expect(component.url).toEqual(undefined as any);
        
    });

    it('should call toolSelected', () => {
        compileComponents();
        component.selected = DrawingTools.RECTANGLE;
        const test = DrawingTools.CIRCLE;
        component.toolSelected(test);
        expect(canvasHandler.selectedTool).toEqual(test);
        expect(component.selected).toEqual(test)
        
    });

    it('should call zoomIn', () => {
        compileComponents();
        spyOn(canvasHandler, 'zoomIn');
        component.zoomIn();
        expect(canvasHandler.zoomIn).toHaveBeenCalled();
        
    });

    it('should call zoomOut', () => {
        compileComponents();
        spyOn(canvasHandler, 'zoomOut');
        component.zoomOut();
        expect(canvasHandler.zoomOut).toHaveBeenCalled();
        
    });

    it('should call onSelect', () => {
        compileComponents();
        component.selectedColor = 'rgba(255,0,0,0.8)';
        const test = 'rgba(255,255,0,0.8)'
        component.onSelect(test);
        expect(canvasHandler.selectedColor).toBe(test);
        expect(component.selectedColor).toBe(test);
        
    });

    it('should call saveAsImage', () => {
        compileComponents();
        spyOn(canvasHandler, 'save');
        component.saveAsImage();
        expect(canvasHandler.save).toHaveBeenCalled();
        
    });

    it('should call onSelect', () => {
        compileComponents();
        component.selectedThickness = 1;
        const test = 2
        component.changeThickNess(test);
        expect(canvasHandler.selectedThickness).toBe(test);
        expect(component.selectedThickness).toBe(test);
        
    });

    it('should call toolSelected function when actionType is toolSelected', () => {
        compileComponents();
        spyOn(component, 'toolSelected');
        component.btnActionOnClick('toolSelected', [DrawingTools.CIRCLE]);
        expect(component.toolSelected).toHaveBeenCalledWith(DrawingTools.CIRCLE);
    });

    it('should call zoomIn function when actionType is zoomIn', () => {
        compileComponents();
        spyOn(component, 'zoomIn');
        component.btnActionOnClick('zoomIn', []);
        expect(component.zoomIn).toHaveBeenCalled();
        expect(canvasHandler.selectedTool).toBe(DrawingTools.NONE)
        expect(component.selected).toBe(DrawingTools.NONE);
    });

    it('should call zoomOut function when actionType is zoomOut', () => {
        compileComponents();
        spyOn(component, 'zoomOut');
        component.btnActionOnClick('zoomOut', []);
        expect(component.zoomOut).toHaveBeenCalled();
        expect(canvasHandler.selectedTool).toBe(DrawingTools.NONE)
        expect(component.selected).toBe(DrawingTools.NONE);
    });

    it('should call saveAsImage function when actionType is saveAsImage', () => {
        compileComponents();
        spyOn(component, 'saveAsImage');
        component.btnActionOnClick('saveAsImage', []);
        expect(component.saveAsImage).toHaveBeenCalled();
        expect(canvasHandler.selectedTool).toBe(DrawingTools.NONE)
        expect(component.selected).toBe(DrawingTools.NONE);
    });

    it('should call uploadImage function when actionType is uploadImage', () => {
        compileComponents();
        spyOn(component, 'uploadImage');
        component.btnActionOnClick('uploadImage', []);
        expect(component.uploadImage).toHaveBeenCalled();
        expect(canvasHandler.selectedTool).toBe(DrawingTools.NONE)
        expect(component.selected).toBe(DrawingTools.NONE);
    });

    it('should call cancelUpload function when actionType is cancelUpload', () => {
        compileComponents();
        spyOn(component, 'cancelUpload');
        component.btnActionOnClick('cancelUpload', []);
        expect(component.cancelUpload).toHaveBeenCalled();
        expect(canvasHandler.selectedTool).toBe(DrawingTools.NONE)
        expect(component.selected).toBe(DrawingTools.NONE);
    });

    it('should not call any function when actionType is unknown', () => {
        compileComponents();
        spyOn(component, 'toolSelected');
        spyOn(component, 'zoomIn');
        spyOn(component, 'zoomOut');
        spyOn(component, 'saveAsImage');
        spyOn(component, 'uploadImage');
        spyOn(component, 'cancelUpload');
        component.btnActionOnClick('unknownActionType', []);
        expect(component.toolSelected).not.toHaveBeenCalled();
        expect(component.zoomIn).not.toHaveBeenCalled();
        expect(component.zoomOut).not.toHaveBeenCalled();
        expect(component.saveAsImage).not.toHaveBeenCalled();
        expect(component.uploadImage).not.toHaveBeenCalled();
        expect(component.cancelUpload).not.toHaveBeenCalled();
        expect(canvasHandler.selectedTool).toBe(DrawingTools.NONE)
        expect(component.selected).toBe(DrawingTools.NONE);
    });

});
