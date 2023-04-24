import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CanvasEditiorComponent } from './canvas-editior.component';
import { CanvasHandlerService } from '../services/canvas-handler.service';
import { FABRIC_JS_TOKEN } from '../injection-token/fabric-token';

const mockCanvasHandler = {
    canvas: {
        dispose: function(){}
    },
    extendToObjectWithId: function() { },
    addBGImageSrcToCanvas: function() { 
        return Promise.resolve();
    },
    onMouseDown: function(e: any) { },
    onMouseMove: function(e: any) { },
    onMouseUp: function() { },
    onObjectSelected: function(e: any) { }
}

const MockFabric = {
    Canvas: function() {
        return {
            setWidth : function(n:any) {},
            setHeight : function(n:any) {},
            on: function(event: string, callback: Function) {},
            findTarget: function() {},
            dispose: function(){}
        }
    },
    Object: {
        prototype: {
            objectCaching: true
        }
    }
}


describe('CanvasEditiorComponent', () => {
    let component: CanvasEditiorComponent;
    let fixture: ComponentFixture<CanvasEditiorComponent>;
    let canvashandler: CanvasHandlerService;
    let fabricInstance: any;

    beforeEach(async () => {
        TestBed.configureTestingModule({
            declarations: [
                CanvasEditiorComponent
            ],
            providers: [
                { provide: CanvasHandlerService, useValue: mockCanvasHandler },
                { provide: FABRIC_JS_TOKEN, useValue: MockFabric}
            ]
        })
    });
    
    function compileComponents() {
        TestBed.compileComponents();
        fixture = TestBed.createComponent(CanvasEditiorComponent);
        component = fixture.componentInstance;
        canvashandler = fixture.debugElement.injector.get(CanvasHandlerService);
        fabricInstance = fixture.debugElement.injector.get(FABRIC_JS_TOKEN);
    }

    it('should create', () => {
        compileComponents();
        expect(component).toBeTruthy();
    });

    it('should call imageDataURL', () => {
        compileComponents();
        canvashandler.imageDataUrl = undefined;
        component.imageDataURL = 'data+/test1234'
        expect(canvashandler.imageDataUrl).toBe('data+/test1234' as any);
    });

    it('should call setCanvasWidthAndHeight with default', () => {
        compileComponents();
        component.canvas = {
            setWidth: function() {},
            setHeight: function() {},
            dispose: function() {}
        } as any;
        if(component.canvas) {
            spyOn(component.canvas, 'setWidth');
            spyOn(component.canvas, 'setHeight');
            component.setCanvasWidthAndHeight();
            expect(component.canvas.setWidth).toHaveBeenCalledWith(1280);
            expect(component.canvas.setHeight).toHaveBeenCalledWith(800);
        }
    });

    it('should call setCanvasWidthAndHeight', () => {
        compileComponents();
        component.canvas = {
            setWidth: function() {},
            setHeight: function() {},
            dispose: function() {}
        } as any;
        if(component.canvas) {
            spyOn(component.canvas, 'setWidth');
            spyOn(component.canvas, 'setHeight');
            component.setCanvasWidthAndHeight(600, 400);
            expect(component.canvas.setWidth).toHaveBeenCalledWith(600);
            expect(component.canvas.setHeight).toHaveBeenCalledWith(400);
        }
    });

    it('should call setCanvasWidthAndHeight when canvas not found', () => {
        compileComponents();
        component.canvas = undefined;
        spyOn(console, 'error');
        component.setCanvasWidthAndHeight();
        expect(console.error).toHaveBeenCalledWith('Canvas not found !');
        
    });

    it('should call ngAfterContentInit', () => {
        compileComponents();
        spyOn(component, 'setupCanvas');
        component.ngAfterContentInit();
        expect(component.setupCanvas).toHaveBeenCalled();
        
    });

    it('should call cleanUpCanvas', () => {
        TestBed.overrideProvider(CanvasHandlerService, {useValue: { canvas: {dispose: function () {}}}} as any)
        compileComponents();
        const mockCanvasHandlerTest = fixture.debugElement.injector.get(CanvasHandlerService);
        if(mockCanvasHandlerTest && mockCanvasHandlerTest.canvas) {
            spyOn(mockCanvasHandlerTest.canvas, 'dispose');
            component.cleanUpCanvas();
            expect(mockCanvasHandlerTest.canvas.dispose).toHaveBeenCalled();
        }
    });

    it('should call setupCanvas', () => {
        compileComponents();
        spyOn(fabricInstance, 'Canvas').and.returnValue({});
        spyOn(canvashandler, 'extendToObjectWithId');
        spyOn(component, 'addCanvasEventListners');
        spyOn(component, 'cleanUpCanvas');
        spyOn(component, 'setCanvasWidthAndHeight');
        component.setupCanvas();
        expect(fabricInstance.Canvas).toHaveBeenCalledWith('canvas', {
            selection: false,
            preserveObjectStacking: true
        });
        expect(component.setCanvasWidthAndHeight).toHaveBeenCalled();
        expect(canvashandler.extendToObjectWithId).toHaveBeenCalled();
        expect(fabricInstance.Object.prototype.objectCaching).toBe(false);
        expect(canvashandler.canvas).toEqual(component.canvas);
        expect(component.addCanvasEventListners).toHaveBeenCalled();
        expect(component.cleanUpCanvas).toHaveBeenCalled();
        
    });

    it('should call addBGImageSrcToCanvas method of canvashandler after view init', () => {
        compileComponents();
        spyOn(canvashandler, 'addBGImageSrcToCanvas');
        component.ngAfterViewInit();
        expect(canvashandler.addBGImageSrcToCanvas).toHaveBeenCalled();
        
    });

    it('should attach event listeners to canvas', () => {
        compileComponents();
        component.canvas = {
            on: function(event: string, callback: Function) {},
        } as any;
        if (component.canvas) {
            spyOn(component.canvas, 'on').and.callThrough();
            component.addCanvasEventListners();
            expect(component.canvas.on).toHaveBeenCalledTimes(4);
            expect(component.canvas.on).toHaveBeenCalledWith('mouse:down', jasmine.any(Function));
            expect(component.canvas.on).toHaveBeenCalledWith('mouse:move', jasmine.any(Function));
            expect(component.canvas.on).toHaveBeenCalledWith('mouse:up', jasmine.any(Function));
            expect(component.canvas.on).toHaveBeenCalledWith('selection:created', jasmine.any(Function));
        }
        
    });

    it('should call addCanvasEventListners when not canvas found ', () => {
        compileComponents();
        component.canvas = undefined;
        spyOn(console, 'error');
        component.addCanvasEventListners();
        expect(console.error).toHaveBeenCalledWith('Canvas not found !');
        
    });

    it('should call canvasListnerMouseDown function', () => {
        compileComponents();
        const mockEvent = { target: {} };
        spyOn(component, 'onCanvasMouseDown');
        component.canvasListnerMouseDown(mockEvent);
        expect(component.onCanvasMouseDown).toHaveBeenCalledWith(mockEvent as any);
        
    });

    it('should call canvasListnerMouseMove function', () => {
        compileComponents();
        const mockEvent = { target: {} };
        spyOn(component, 'onCanvasMouseMove');
        component.canvasListnerMouseMove(mockEvent);
        expect(component.onCanvasMouseMove).toHaveBeenCalledWith(mockEvent as any);
        
    });

    it('should call canvasListnerMouseUp function', () => {
        compileComponents();
        const mockEvent = { target: {} };
        spyOn(component, 'onCanvasMouseUp');
        component.canvasListnerMouseUp(mockEvent);
        expect(component.onCanvasMouseUp).toHaveBeenCalled();
        
    });

    it('should call canvasListnerSelectionCreated function', () => {
        compileComponents();
        const mockEvent = { target: {} };
        spyOn(component, 'onSelectionCreated');
        component.canvasListnerSelectionCreated(mockEvent);
        expect(component.onSelectionCreated).toHaveBeenCalledWith(mockEvent);
        
    });

    it('should call onCanvasMouseDown function', () => {
        compileComponents();
        const mockEvent = { e: { stopPropagation: () => {} } };
        spyOn(canvashandler, 'onMouseDown');
        component.onCanvasMouseDown(mockEvent as any);
        expect(canvashandler.onMouseDown).toHaveBeenCalledWith(mockEvent.e as any);
        
    });

    it('should call onCanvasMouseMove function', () => {
        compileComponents();
        const mockEvent = { e: { stopPropagation: () => {} } };
        spyOn(canvashandler, 'onMouseMove');
        component.onCanvasMouseMove(mockEvent as any);
        expect(canvashandler.onMouseMove).toHaveBeenCalledWith(mockEvent.e as any);
        
    });

    it('should call onCanvasMouseUp onMouseUp function', () => {
        compileComponents();
        const mockEvent = { e: { stopPropagation: () => {} } };
        spyOn(canvashandler, 'onMouseUp');
        component.onCanvasMouseUp();
        expect(canvashandler.onMouseUp).toHaveBeenCalled();
        
    });

    it('should call stopPropagation method on onCanvasMouseDown function', () => {
        compileComponents();
        const mockEvent = { e: { stopPropagation: () => {} } };
        spyOn(mockEvent.e, 'stopPropagation');
        component.onCanvasMouseDown(mockEvent as any);
        expect(mockEvent.e.stopPropagation).toHaveBeenCalled();
        
    });

    it('should call onSelectionCreated function', () => {
        compileComponents();
        component.canvas = {
            findTarget: function(a: any, b: boolean) {}
        } as any;
        if(component.canvas) {
            spyOn(component.canvas, 'findTarget').and.returnValue({test: 'OK'} as any);
            spyOn(canvashandler, 'onObjectSelected');

            component.onSelectionCreated({e: {}, target: undefined});

            expect(component.canvas.findTarget).toHaveBeenCalled();
            expect(component.canvas.findTarget).toHaveBeenCalledWith({} as any, true);
            expect(canvashandler.onObjectSelected).toHaveBeenCalled();
            expect(canvashandler.onObjectSelected).toHaveBeenCalledWith({test: 'OK'} as any);
        }
        
    });

    it('should call onSelectionCreated function when canvas is undefined', () => {
        compileComponents();
        component.canvas = undefined;
        spyOn(console, 'error');
        component.onSelectionCreated({});
        expect(console.error).toHaveBeenCalled();
        expect(console.error).toHaveBeenCalledWith('Canvas not found !');
        
    });
});
