import { TestBed } from '@angular/core/testing';
import { CanvasHandlerService } from './canvas-handler.service';
import { FABRIC_JS_TOKEN } from '../injection-token/fabric-token';
import { CustomFabricEllipse, CustomFabricRect, DrawingTools } from '../model/models';
import { CanvasShapeHandlerService } from './canvas-shape-handler.service';

const MockFabric = {
    Image: class {
        img: any = null;
        constructor(img: any) {
            this.img = img;
        }
    },
    Object: {}
}

const MockCanvasShapehandler = {
    createCircle: (a: any, b: any, c: any, d: any) => { },
    createRectangle: (a: any, b: any, c: any, d: any) => { },
    createPath: (a: any, b: any, c: any, d: any) => { },
    createLine: (a: any, b: any, c: any, d: any, e: any) => { },
    createIText: (a: any, b: any) => { },
    formCircle: (a: any, b: any, c: any) => { },
    formRectangle: (a: any, b: any, c: any) => { },
    formPath: (a: any, b: any, c: any) => { },
    formLine: (a: any, b: any, c: any) => { },
    finishPath: (a: any, b: any, c: any) => { }
}

describe('CanvasHandlerService', () => {
    let service: CanvasHandlerService;
    let fabricJsToken: any;
    let canvasShapeHandler: CanvasShapeHandlerService

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                CanvasHandlerService,
                { provide: FABRIC_JS_TOKEN, useValue: MockFabric },
                { provide: CanvasShapeHandlerService, useValue: MockCanvasShapehandler }
            ],
        });
        service = TestBed.inject(CanvasHandlerService);
        fabricJsToken = TestBed.inject(FABRIC_JS_TOKEN);
        canvasShapeHandler = TestBed.inject(CanvasShapeHandlerService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should access getter/setter for _isMouseDown', done => {
        service.isMouseDown = true;
        expect(service.isMouseDown).toEqual(true);
        done();
    })

    it('should access getter/setter for _initPositionOfElement', done => {
        service.initPositionOfElement = { x: 10, y: 20 };
        expect(service.initPositionOfElement).toEqual({ x: 10, y: 20 });
        done();
    })

    it('should access getter/setter for _selectedColor', done => {
        const mockCanvas = {
            discardActiveObject: function () {},
            renderAll: function () {}
        }
        service.canvas = mockCanvas as unknown as fabric.Canvas;
        spyOn(service.canvas, 'discardActiveObject');
        spyOn(service.canvas, 'renderAll');
        service.selectedColor = 'rgba(0,0,0,1)';
        expect(service.canvas.discardActiveObject).toHaveBeenCalled();
        expect(service.canvas.renderAll).toHaveBeenCalled();
        expect(service.selectedColor).toEqual('rgba(0,0,0,1)');
        
        done();
    });

    it('should access getter/setter for _selectedColor when canvas is undefined', done => {
        service.canvas = undefined;
        spyOn(console, 'error');
        service.selectedColor = 'rgba(0,0,0,1)';
        expect(console.error).toHaveBeenCalled();
        expect(console.error).toHaveBeenCalledWith('Console not found !');
        done();
    });

    it('should access getter/setter for _selectedTool', done => {
        service.canvas = undefined;
        spyOn(console, 'error');
        service.selectedTool = DrawingTools.ERASE;
        expect(console.error).toHaveBeenCalled();
        expect(console.error).toHaveBeenCalledWith('canvas not found !');
        done()
    });

    it('should access getter/setter for _selectedTool', done => {
        const mockCanvas = {
            discardActiveObject: function () { },
            renderAll: function () { },
        }
        service.canvas = mockCanvas as unknown as fabric.Canvas;
        spyOn(service, 'enableObjectsSelectableFlag');
        spyOn(service.canvas, 'discardActiveObject');
        spyOn(service.canvas, 'renderAll');
        service.selectedTool = DrawingTools.SELECT;
        expect(service.canvas.discardActiveObject).toHaveBeenCalled();
        expect(service.canvas.renderAll).toHaveBeenCalled();
        expect(service.enableObjectsSelectableFlag).toHaveBeenCalled();
        expect(service.enableObjectsSelectableFlag).toHaveBeenCalledWith(true);
        expect(service.selectedTool).toEqual(DrawingTools.SELECT);
        done();
    });

    it('should access getter/setter for _selectedTool', done => {
        const mockCanvas = {
            discardActiveObject: function () { },
            renderAll: function () { },
            clear: function () { },
            setBackgroundImage: function (b: any, f: Function) { },
            backgroundImage: 'data/23123123'
        }
        service.canvas = mockCanvas as unknown as fabric.Canvas;
        spyOn(service, 'enableObjectsSelectableFlag');
        spyOn(service.canvas, 'discardActiveObject');
        spyOn(service.canvas, 'renderAll');
        spyOn(service.canvas, 'clear');
        spyOn(service.canvas, 'setBackgroundImage');

        service.selectedTool = DrawingTools.CLEARALL;

        expect(service.canvas.discardActiveObject).toHaveBeenCalled();
        expect(service.canvas.renderAll).toHaveBeenCalled();
        expect(service.enableObjectsSelectableFlag).toHaveBeenCalled();
        expect(service.enableObjectsSelectableFlag).toHaveBeenCalledWith(false);
        expect(service.canvas.clear).toHaveBeenCalled();
        expect(service.canvas.setBackgroundImage).toHaveBeenCalled();
        expect(service.canvas.setBackgroundImage).toHaveBeenCalledWith('data/23123123', service.empty_fn_ref);
        expect(service.selectedTool).toEqual(DrawingTools.CLEARALL);
        done();
    });

    it('should access getter/setter for _elementUnderDrawing', done => {
        service.elementUnderDrawing = { test: 'For test' };
        expect(service.elementUnderDrawing).toEqual({ test: 'For test' });
        done();
    })

    it('should reject if imageDataUrl is not set', async () => {
        service.imageDataUrl = undefined;
        await expectAsync(service.addBGImageSrcToCanvas()).toBeRejectedWith('Image URL not found !');
    });

    it('should call imgOnLoadAction when canvas in not present', done => {
        const mockobj = {
            rejectCallback: () => { },
            resolveCallback: () => { }
        }
        service.canvas = undefined;
        spyOn(mockobj, 'rejectCallback');
        const img = new Image();
        service.imgOnLoadAction(img, mockobj.rejectCallback, mockobj.resolveCallback);
        expect(mockobj.rejectCallback).toHaveBeenCalled();
        done();
    });

    it('should call imgOnLoadAction when canvas is present', done => {
        const mockobj = {
            rejectCallback: () => { },
            resolveCallback: () => { }
        }
        service.canvas = {
            setWidth: () => { },
            setHeight: () => { },
            setBackgroundImage: () => { },
        } as unknown as fabric.Canvas;
        spyOn(service.canvas, 'setWidth');
        spyOn(service.canvas, 'setHeight');
        spyOn(service.canvas, 'setBackgroundImage');
        const mockImage = {
            width: 100,
            height: 200
        }
        spyOn(fabricJsToken, 'Image').and.returnValue(mockImage);
        const img = new Image();
        service.imgOnLoadAction(img, mockobj.rejectCallback, mockobj.resolveCallback);
        expect(fabricJsToken.Image).toHaveBeenCalled();
        expect(service.canvas.setWidth).toHaveBeenCalledWith(mockImage.width);
        expect(service.canvas.setHeight).toHaveBeenCalledWith(mockImage.height);
        expect(service.canvas.setBackgroundImage).toHaveBeenCalledWith(mockImage as any, mockobj.resolveCallback);
        done();
    });

    it('should call setupCanvasRefForImg', done => {
        const mockCanvas = {
            add: (img: any) => { },
            discardActiveObject: () => {
                return {
                    renderAll: () => { }
                }
            },
            setActiveObject: (img: any) => { }
        }
        service.canvas = mockCanvas as unknown as fabric.Canvas;
        const img = {
            set: (obj: any) => { },
            scaleToWidth: (v: number) => { },
            scaleToHeight: (v: number) => { }
        }

        spyOn(img, 'set');
        spyOn(img, 'scaleToWidth');
        spyOn(img, 'scaleToHeight');
        spyOn(service, 'extendToObjectWithId');
        spyOn(service.canvas, 'add');
        spyOn(service.canvas, 'discardActiveObject').and.callThrough();
        // spyOn(service.canvas.discardActiveObject, 'renderAll'); // @TODO: look into this part
        spyOn(service.canvas, 'setActiveObject');

        const ref = service.setupCanvasRefForImg();
        ref(img);

        expect(img.set).toHaveBeenCalled();
        expect(img.set).toHaveBeenCalledWith({
            left: 10,
            top: 10,
            angle: 0,
            padding: 10,
            cornerSize: 10,
            hasRotatingPoint: true
        });
        expect(img.scaleToWidth).toHaveBeenCalled();
        expect(img.scaleToWidth).toHaveBeenCalledWith(200);
        expect(img.scaleToHeight).toHaveBeenCalled();
        expect(img.scaleToHeight).toHaveBeenCalledWith(200);
        expect(service.extendToObjectWithId).toHaveBeenCalled();
        expect(service.canvas.add).toHaveBeenCalled();
        expect(service.canvas.add).toHaveBeenCalledWith(img as any);
        expect(service.canvas.discardActiveObject).toHaveBeenCalled();
        expect(service.canvas.setActiveObject).toHaveBeenCalled();
        expect(service.canvas.setActiveObject).toHaveBeenCalledWith(img as any);

        done();
    });

    it('should call setupCanvasRefForImg when canvas is undefined', done => {

        service.canvas = undefined;
        const img = {
            set: (obj: any) => { },
            scaleToWidth: () => { },
            scaleToHeight: () => { }
        }
        spyOn(console, 'error');
        const ref = service.setupCanvasRefForImg();
        ref(img);
        expect(console.error).toHaveBeenCalled();
        expect(console.error).toHaveBeenCalledWith('Canvas not found !');
        done();
    });

    it('should call addImageOnCanvas when url is undefined', done => {
        spyOn(console, 'error');
        service.addImageOnCanvas('');
        expect(console.error).toHaveBeenCalled();
        expect(console.error).toHaveBeenCalledWith('Unable to upload image !');
        done();
    });

    // -- @TODO :: issue with overriding provider look into different approach
    // it('should call addImageOnCanvas', done => {
    //   TestBed.overrideProvider(FABRIC_JS_TOKEN, {useValue: {
    //     Image: {
    //       fromUrl: function(a:any, b:any){}
    //     }
    //   }});
    //   const fbMock = TestBed.inject(FABRIC_JS_TOKEN) as any;
    //   spyOn(fbMock.Image, 'fromUrl');
    //   service.addImageOnCanvas('');
    //   expect(fbMock.Image.fromUrl).toHaveBeenCalled();
    //   done();
    // });

    it('should call enableObjectsSelectableFlag when canvas is undefined', done => {
        service.canvas = undefined;
        spyOn(console, 'error');
        service.enableObjectsSelectableFlag(true);
        expect(console.error).toHaveBeenCalled();
        expect(console.error).toHaveBeenCalledWith('Canvas not found !');
        done();
    });

    it('should call enableObjectsSelectableFlag', done => {
        const mockCanvas = {
            _objects: [{ selectable: false, perPixelTargetFind: false }],
            forEachObject: function (callback: Function) {
                for (let i = 0; i < this._objects.length; i++) {
                    callback(this._objects[i]);
                }
            }
        }
        service.canvas = mockCanvas as unknown as fabric.Canvas;
        spyOn(service.canvas, 'forEachObject').and.callThrough();
        service.enableObjectsSelectableFlag(true);

        expect(service.canvas.forEachObject).toHaveBeenCalled();
        expect(service.canvas._objects).toEqual([{ selectable: true, perPixelTargetFind: true }] as any);
        done();
    });

    it('should call onMouseDown when canvas is not present', done => {
        spyOn(console, 'error');
        service.canvas = undefined;
        service.onMouseDown({} as Event);
        expect(console.error).toHaveBeenCalledWith('Canvas not found !')
        done();
    });

    it('should call onMouseDown when drawing tool is circle', done => {
        const mockCanvas = {
            getPointer: function (e: any) { },
            discardActiveObject: function () { },
            renderAll: function () { },
            forEachObject: function () { }
        } as unknown as fabric.Canvas;
        service.canvas = mockCanvas;

        service.selectedTool = DrawingTools.CIRCLE;

        service.selectedThickness = 1;
        service.selectedColor = 'rgba(255, 0, 0, 0.4)'

        spyOn(canvasShapeHandler, 'createCircle').and.returnValue({ test: 'OK !' } as any);
        spyOn(service, 'enableObjectsSelectableFlag');
        spyOn(service.canvas, 'getPointer').and.returnValue({ x: 100, y: 100 } as any);
        const example: any = { e: 'something' }

        service.onMouseDown(example as unknown as Event);

        expect(service.initPositionOfElement).toEqual({ x: 100, y: 100 });
        expect(service.isMouseDown).toBe(true);
        expect(service.canvas.getPointer).toHaveBeenCalled();
        expect(canvasShapeHandler.createCircle).toHaveBeenCalled();
        // expect(service.canvas.getPointer).toHaveBeenCalledWith(example);
        expect(canvasShapeHandler.createCircle).toHaveBeenCalledWith(
            service.canvas,
            service.selectedThickness,
            service.selectedColor,
            { x: 100, y: 100 }
        );
        done();
    });

    it('should call onMouseDown when drawing tool is rectangle', done => {
        const mockCanvas = {
            getPointer: function (e: any) { },
            discardActiveObject: function () { },
            renderAll: function () { },
            forEachObject: function () { }
        } as unknown as fabric.Canvas;
        service.canvas = mockCanvas;

        service.selectedTool = DrawingTools.RECTANGLE;

        service.selectedThickness = 1;
        service.selectedColor = 'rgba(255, 0, 0, 0.4)'

        spyOn(canvasShapeHandler, 'createRectangle').and.returnValue({ test: 'OK !' } as any);
        spyOn(service, 'enableObjectsSelectableFlag');
        spyOn(service.canvas, 'getPointer').and.returnValue({ x: 100, y: 100 } as any);
        const example: any = { e: 'something' }

        service.onMouseDown(example as unknown as Event);

        expect(service.initPositionOfElement).toEqual({ x: 100, y: 100 });
        expect(service.isMouseDown).toBe(true);
        expect(service.canvas.getPointer).toHaveBeenCalled();
        expect(canvasShapeHandler.createRectangle).toHaveBeenCalled();
        // expect(service.canvas.getPointer).toHaveBeenCalledWith(example);
        expect(canvasShapeHandler.createRectangle).toHaveBeenCalledWith(
            service.canvas,
            service.selectedThickness,
            service.selectedColor,
            { x: 100, y: 100 }
        );
        done();
    });

    it('should call onMouseDown when drawing tool is path', done => {
        const mockCanvas = {
            getPointer: function (e: any) { },
            discardActiveObject: function () { },
            renderAll: function () { },
            forEachObject: function () { }
        } as unknown as fabric.Canvas;
        service.canvas = mockCanvas;

        service.selectedTool = DrawingTools.FREEHAND;

        service.selectedThickness = 1;
        service.selectedColor = 'rgba(255, 0, 0, 0.4)'

        spyOn(canvasShapeHandler, 'createPath').and.returnValue({ test: 'OK !' } as any);
        spyOn(service, 'enableObjectsSelectableFlag');
        spyOn(service.canvas, 'getPointer').and.returnValue({ x: 100, y: 100 } as any);
        const example: any = { e: 'something' }

        service.onMouseDown(example as unknown as Event);

        expect(service.initPositionOfElement).toEqual({ x: 100, y: 100 });
        expect(service.isMouseDown).toBe(true);
        expect(service.canvas.getPointer).toHaveBeenCalled();
        expect(canvasShapeHandler.createPath).toHaveBeenCalled();
        // expect(service.canvas.getPointer).toHaveBeenCalledWith(example);
        expect(canvasShapeHandler.createPath).toHaveBeenCalledWith(
            service.canvas,
            service.selectedThickness,
            service.selectedColor,
            { x: 100, y: 100 }
        );
        done();
    });

    it('should call onMouseDown when drawing tool is line', done => {
        const mockCanvas = {
            getPointer: function (e: any) { },
            discardActiveObject: function () { },
            renderAll: function () { },
            forEachObject: function () { }
        } as unknown as fabric.Canvas;
        service.canvas = mockCanvas;

        service.selectedTool = DrawingTools.LINE;

        service.selectedThickness = 1;
        service.selectedColor = 'rgba(255, 0, 0, 0.4)'

        spyOn(canvasShapeHandler, 'createLine').and.returnValue({ test: 'OK !' } as any);
        spyOn(service, 'enableObjectsSelectableFlag');
        spyOn(service.canvas, 'getPointer').and.returnValue({ x: 100, y: 100 } as any);
        const example: any = { e: 'something' }

        service.onMouseDown(example as unknown as Event);

        expect(service.initPositionOfElement).toEqual({ x: 100, y: 100 });
        expect(service.isMouseDown).toBe(true);
        expect(service.canvas.getPointer).toHaveBeenCalled();
        expect(canvasShapeHandler.createLine).toHaveBeenCalled();
        // expect(service.canvas.getPointer).toHaveBeenCalledWith(example);
        expect(canvasShapeHandler.createLine).toHaveBeenCalledWith(
            service.canvas,
            service.selectedThickness,
            service.selectedColor,
            [5, 0],
            { x: 100, y: 100 }
        );
        done();
    });

    it('should call onMouseDown when drawing tool is dashed line', done => {
        const mockCanvas = {
            getPointer: function (e: any) { },
            discardActiveObject: function () { },
            renderAll: function () { },
            forEachObject: function () { }
        } as unknown as fabric.Canvas;
        service.canvas = mockCanvas;

        service.selectedTool = DrawingTools.DASHED_LINE;

        service.selectedThickness = 1;
        service.selectedColor = 'rgba(255, 0, 0, 0.4)'

        spyOn(canvasShapeHandler, 'createLine').and.returnValue({ test: 'OK !' } as any);
        spyOn(service, 'enableObjectsSelectableFlag');
        spyOn(service.canvas, 'getPointer').and.returnValue({ x: 100, y: 100 } as any);
        const example: any = { e: 'something' }

        service.onMouseDown(example as unknown as Event);

        expect(service.initPositionOfElement).toEqual({ x: 100, y: 100 });
        expect(service.isMouseDown).toBe(true);
        expect(service.canvas.getPointer).toHaveBeenCalled();
        expect(canvasShapeHandler.createLine).toHaveBeenCalled();
        // expect(service.canvas.getPointer).toHaveBeenCalledWith(example);
        expect(canvasShapeHandler.createLine).toHaveBeenCalledWith(
            service.canvas,
            service.selectedThickness,
            service.selectedColor,
            [5, 5],
            { x: 100, y: 100 }
        );
        done();
    });

    it('should call onMouseDown when drawing tool is text', done => {
        const mockCanvas = {
            getPointer: function (e: any) { },
            discardActiveObject: function () { },
            renderAll: function () { },
            forEachObject: function () { }
        } as unknown as fabric.Canvas;
        service.canvas = mockCanvas;

        service.selectedTool = DrawingTools.TEXT;

        service.selectedThickness = 1;
        service.selectedColor = 'rgba(255, 0, 0, 0.4)'

        spyOn(canvasShapeHandler, 'createIText').and.returnValue({ test: 'OK !' } as any);
        spyOn(service, 'enableObjectsSelectableFlag');
        spyOn(service.canvas, 'getPointer').and.returnValue({ x: 100, y: 100 } as any);
        const example: any = { e: 'something' }

        service.onMouseDown(example as unknown as Event);

        expect(service.initPositionOfElement).toEqual({ x: 100, y: 100 });
        expect(service.isMouseDown).toBe(true);
        expect(service.canvas.getPointer).toHaveBeenCalled();
        expect(canvasShapeHandler.createIText).toHaveBeenCalled();
        // expect(service.canvas.getPointer).toHaveBeenCalledWith(example);
        expect(canvasShapeHandler.createIText).toHaveBeenCalledWith(
            service.canvas,
            {
                thickness: service.selectedThickness / 2,
                color: service.selectedColor,
                pointer: { x: 100, y: 100 }
            }
        );
        done();
    });

    it('should call onMouseDown none of the action matches and switch hits the default', done => {
        const mockCanvas = {
            getPointer: function (e: any) { },
            discardActiveObject: function () { },
            renderAll: function () { },
            forEachObject: function () { },
            clear: function () { },
            setBackgroundImage: function () { }
        } as unknown as fabric.Canvas;
        service.canvas = mockCanvas;

        service.selectedTool = DrawingTools.CLEARALL;

        service.selectedThickness = 1;
        service.selectedColor = 'rgba(255, 0, 0, 0.4)'

        spyOn(canvasShapeHandler, 'createIText');
        spyOn(canvasShapeHandler, 'createLine');
        spyOn(canvasShapeHandler, 'createPath');
        spyOn(canvasShapeHandler, 'createRectangle');
        spyOn(canvasShapeHandler, 'createCircle');
        spyOn(service, 'enableObjectsSelectableFlag'); // not valid step but needed to bypass the error
        spyOn(service.canvas, 'getPointer').and.returnValue({ x: 100, y: 100 } as any);
        const example: any = { e: 'something' }
        

        service.onMouseDown(example as unknown as Event);

        expect(service.initPositionOfElement).toEqual({ x: 100, y: 100 });
        expect(service.isMouseDown).toBe(true);
        expect(service.canvas.getPointer).toHaveBeenCalled();
        expect(canvasShapeHandler.createIText).not.toHaveBeenCalled();
        expect(canvasShapeHandler.createLine).not.toHaveBeenCalled();
        expect(canvasShapeHandler.createPath).not.toHaveBeenCalled();
        expect(canvasShapeHandler.createRectangle).not.toHaveBeenCalled();
        expect(canvasShapeHandler.createCircle).not.toHaveBeenCalled();
        done();
    });

    it('should call onMouseMove when selected tool is DrawingTools.CIRCLE', done => {

        const mockCanvas = {
            getPointer: function (e: any) { },
            discardActiveObject: function () { },
            renderAll: function () { },
            forEachObject: function () { },
            clear: function () { },
            setBackgroundImage: function () { }
        } as unknown as fabric.Canvas;
        service.canvas = mockCanvas;

        service.initPositionOfElement = { x: 100, y: 100 };
        service.isMouseDown = true;
        service.selectedTool = DrawingTools.CIRCLE;
        service.elementUnderDrawing = {
            test: 'TEST Ellipse'
        } as unknown as CustomFabricEllipse

        spyOn(canvasShapeHandler, 'formCircle');
        spyOn(service.canvas, 'getPointer').and.returnValue({ x: 100, y: 100 } as any);

        service.onMouseMove({} as Event);

        expect(service.canvas.getPointer).toHaveBeenCalled();
        expect(canvasShapeHandler.formCircle).toHaveBeenCalled();
        expect(canvasShapeHandler.formCircle).toHaveBeenCalledWith(
            service.elementUnderDrawing,
            service.initPositionOfElement,
            { x: 100, y: 100 }
        );
        done();
    });

    it('should call onMouseMove when selected tool is DrawingTools.RECTANGLE', done => {

        const mockCanvas = {
            getPointer: function (e: any) { },
            discardActiveObject: function () { },
            renderAll: function () { },
            forEachObject: function () { },
            clear: function () { },
            setBackgroundImage: function () { }
        } as unknown as fabric.Canvas;
        service.canvas = mockCanvas;

        service.initPositionOfElement = { x: 100, y: 100 };
        service.isMouseDown = true;
        service.selectedTool = DrawingTools.RECTANGLE;
        service.elementUnderDrawing = {
            test: 'TEST Ellipse'
        } as unknown as CustomFabricRect

        spyOn(canvasShapeHandler, 'formRectangle');
        spyOn(service.canvas, 'getPointer').and.returnValue({ x: 100, y: 100 } as any);

        service.onMouseMove({} as Event);

        expect(service.canvas.getPointer).toHaveBeenCalled();
        expect(canvasShapeHandler.formRectangle).toHaveBeenCalled();
        expect(canvasShapeHandler.formRectangle).toHaveBeenCalledWith(
            service.elementUnderDrawing,
            service.initPositionOfElement,
            { x: 100, y: 100 }
        );
        done();
    });

    it('should call onMouseMove when selected tool is DrawingTools.FREEHAND', done => {

        const mockCanvas = {
            getPointer: function (e: any) { },
            discardActiveObject: function () { },
            renderAll: function () { },
            forEachObject: function () { },
            clear: function () { },
            setBackgroundImage: function () { }
        } as unknown as fabric.Canvas;
        service.canvas = mockCanvas;

        service.initPositionOfElement = { x: 100, y: 100 };
        service.isMouseDown = true;
        service.selectedTool = DrawingTools.FREEHAND;
        service.elementUnderDrawing = {
            test: 'TEST Ellipse'
        } as unknown as CustomFabricRect

        spyOn(canvasShapeHandler, 'formPath');
        spyOn(service.canvas, 'getPointer').and.returnValue({ x: 100, y: 100 } as any);

        service.onMouseMove({} as Event);

        expect(service.canvas.getPointer).toHaveBeenCalled();
        expect(canvasShapeHandler.formPath).toHaveBeenCalled();
        expect(canvasShapeHandler.formPath).toHaveBeenCalledWith(
            service.elementUnderDrawing,
            { x: 100, y: 100 }
        );
        done();
    });

    it('should call onMouseMove when selected tool is DrawingTools.LINE', done => {

        const mockCanvas = {
            getPointer: function (e: any) { },
            discardActiveObject: function () { },
            renderAll: function () { },
            forEachObject: function () { },
            clear: function () { },
            setBackgroundImage: function () { }
        } as unknown as fabric.Canvas;
        service.canvas = mockCanvas;

        service.initPositionOfElement = { x: 100, y: 100 };
        service.isMouseDown = true;
        service.selectedTool = DrawingTools.LINE;
        service.elementUnderDrawing = {
            test: 'TEST Ellipse'
        } as unknown as CustomFabricRect

        spyOn(canvasShapeHandler, 'formLine');
        spyOn(service.canvas, 'getPointer').and.returnValue({ x: 100, y: 100 } as any);

        service.onMouseMove({} as Event);

        expect(service.canvas.getPointer).toHaveBeenCalled();
        expect(canvasShapeHandler.formLine).toHaveBeenCalled();
        expect(canvasShapeHandler.formLine).toHaveBeenCalledWith(
            service.elementUnderDrawing,
            { x: 100, y: 100 }
        );
        done();
    });

    it('should call onMouseMove when selected tool is DrawingTools.DASHED_LINE', done => {

        const mockCanvas = {
            getPointer: function (e: any) { },
            discardActiveObject: function () { },
            renderAll: function () { },
            forEachObject: function () { },
            clear: function () { },
            setBackgroundImage: function () { }
        } as unknown as fabric.Canvas;
        service.canvas = mockCanvas;

        service.initPositionOfElement = { x: 100, y: 100 };
        service.isMouseDown = true;
        service.selectedTool = DrawingTools.DASHED_LINE;
        service.elementUnderDrawing = {
            test: 'TEST Ellipse'
        } as unknown as CustomFabricRect

        spyOn(canvasShapeHandler, 'formLine');
        spyOn(service.canvas, 'getPointer').and.returnValue({ x: 100, y: 100 } as any);

        service.onMouseMove({} as Event);

        expect(service.canvas.getPointer).toHaveBeenCalled();
        expect(canvasShapeHandler.formLine).toHaveBeenCalled();
        expect(canvasShapeHandler.formLine).toHaveBeenCalledWith(
            service.elementUnderDrawing,
            { x: 100, y: 100 }
        );
        done();
    });

    it('should call onMouseMove when selected tool is not handled', done => {

        const mockCanvas = {
            getPointer: function (e: any) { },
            discardActiveObject: function () { },
            renderAll: function () { },
            forEachObject: function () { },
            clear: function () { },
            setBackgroundImage: function () { }
        } as unknown as fabric.Canvas;
        service.canvas = mockCanvas;

        service.initPositionOfElement = { x: 100, y: 100 };
        service.isMouseDown = true;
        service.selectedTool = DrawingTools.CLEARALL;
        service.elementUnderDrawing = {
            test: 'TEST Ellipse'
        } as unknown as CustomFabricRect

        spyOn(canvasShapeHandler, 'formCircle');
        spyOn(canvasShapeHandler, 'formRectangle');
        spyOn(canvasShapeHandler, 'formPath');
        spyOn(canvasShapeHandler, 'formLine');
        spyOn(service.canvas, 'getPointer').and.returnValue({ x: 100, y: 100 } as any);
        spyOn(service.canvas, 'renderAll');
        service.onMouseMove({} as Event);

        expect(service.canvas.getPointer).toHaveBeenCalled();
        expect(canvasShapeHandler.formCircle).not.toHaveBeenCalled();
        expect(canvasShapeHandler.formRectangle).not.toHaveBeenCalled();
        expect(canvasShapeHandler.formPath).not.toHaveBeenCalled();
        expect(canvasShapeHandler.formLine).not.toHaveBeenCalled();
        expect(service.canvas.renderAll).toHaveBeenCalled();
        done();
    });

    it('should call onMouseMove when canvas is undefined', done => {
        service.canvas = undefined;
        spyOn(console, 'error');
        service.onMouseMove({} as Event);
        expect(console.error).toHaveBeenCalled();
        expect(console.error).toHaveBeenCalledWith(
            'Canvas not found !'
        );
        done();
    });

    it('should call onMouseUp when canvas is undefined', done => {
        service.canvas = undefined;
        spyOn(console, 'error');
        service.onMouseUp();
        expect(console.error).toHaveBeenCalled();
        expect(console.error).toHaveBeenCalledWith(
            'Canvas not found !'
        );
        done();
    });

    it('should call onMouseUp when selected tool is DrawingTools.FREEHAND', done => {
        const mockCanvas = {
            getPointer: function (e: any) { },
            discardActiveObject: function () { },
            renderAll: function () { },
            forEachObject: function () { },
            clear: function () { },
            setBackgroundImage: function () { }
        } as unknown as fabric.Canvas;
        service.canvas = mockCanvas;
        service.selectedTool = DrawingTools.FREEHAND;
        service.isMouseDown = true;
        service.elementUnderDrawing = { test: 'TEST' };

        spyOn(canvasShapeHandler, 'finishPath').and.returnValue({ test: 'Changed' } as any);
        spyOn(service.canvas, 'renderAll');

        service.onMouseUp();

        expect(service.isMouseDown).toBe(false);
        expect(canvasShapeHandler.finishPath).toHaveBeenCalled();
        expect(canvasShapeHandler.finishPath).toHaveBeenCalledWith(
            service.canvas,
            { test: 'TEST' } as any
        );
        expect(service.elementUnderDrawing).toEqual({ test: 'Changed' } as any)
        expect(service.canvas.renderAll).toHaveBeenCalled();
        done();
    });

    it('should call onMouseUp when selected tool is DrawingTools.SELECT', done => {
        const mockCanvas = {
            getPointer: function (e: any) { },
            discardActiveObject: function () { },
            renderAll: function () { },
            forEachObject: function () { },
            clear: function () { },
            setBackgroundImage: function () { }
        } as unknown as fabric.Canvas;
        service.canvas = mockCanvas;
        service.selectedTool = DrawingTools.SELECT;
        service.isMouseDown = true;
        service.elementUnderDrawing = { test: 'TEST' };

        spyOn(canvasShapeHandler, 'finishPath');
        spyOn(service.canvas, 'renderAll');

        service.onMouseUp();

        expect(service.isMouseDown).toBe(false);
        expect(canvasShapeHandler.finishPath).not.toHaveBeenCalled();
        expect(service.elementUnderDrawing).toEqual({ test: 'TEST' } as any)
        expect(service.canvas.renderAll).not.toHaveBeenCalled();
        done();
    });

    it('should call onMouseUp when selected tool is DrawingTools.CIRCLE', done => {
        const mockCanvas = {
            getPointer: function (e: any) { },
            discardActiveObject: function () { },
            renderAll: function () { },
            forEachObject: function () { },
            clear: function () { },
            setBackgroundImage: function () { }
        } as unknown as fabric.Canvas;
        service.canvas = mockCanvas;
        service.selectedTool = DrawingTools.CIRCLE;
        service.isMouseDown = true;
        service.elementUnderDrawing = { test: 'TEST' };

        spyOn(canvasShapeHandler, 'finishPath');
        spyOn(service.canvas, 'renderAll');

        service.onMouseUp();

        expect(service.isMouseDown).toBe(false);
        expect(canvasShapeHandler.finishPath).not.toHaveBeenCalled();
        expect(service.elementUnderDrawing).toEqual({ test: 'TEST' } as any)
        expect(service.canvas.renderAll).toHaveBeenCalled();
        done();
    });

    it('should call onObjectSelected when selected tool is DrawingTools.ERASE', done => {
        const mockCanvas = {
            getPointer: function (e: any) { },
            discardActiveObject: function () { },
            renderAll: function () { },
            forEachObject: function () { },
            clear: function () { },
            setBackgroundImage: function () { },
            remove: function () { }
        } as unknown as fabric.Canvas;
        service.canvas = mockCanvas;

        service.selectedTool = DrawingTools.ERASE;

        spyOn(service.canvas, 'remove');

        service.onObjectSelected({} as any);

        expect(service.canvas.remove).toHaveBeenCalled();

        done();
    });

    it('should call onObjectSelected when canvas is undefined', done => {
        service.canvas = undefined;
        spyOn(console, 'error');
        service.onObjectSelected({} as any);
        expect(console.error).toHaveBeenCalled();
        expect(console.error).toHaveBeenCalledWith('Failed to erase item');
        done();
    });

    it('should call zoomIn when canvas is undefined', done => {
        service.canvas = undefined;
        spyOn(console, 'error');
        service.zoomIn();
        expect(console.error).toHaveBeenCalled();
        expect(console.error).toHaveBeenCalledWith('Canvas not found !');
        done();
    });

    it('should call zoomIn', done => {
        const mockCanvas = {
            getZoom: () => { },
            getHeight: () => { },
            getWidth: () => { },
            setZoom: () => { },
            setHeight: () => { },
            setWidth: () => { }
        }
        service.canvas = mockCanvas as unknown as fabric.Canvas;
        spyOn(service.canvas, 'getZoom').and.returnValue(5);
        spyOn(service.canvas, 'setZoom');
        spyOn(service.canvas, 'getHeight').and.returnValue(4);;
        spyOn(service.canvas, 'setHeight');
        spyOn(service.canvas, 'getWidth').and.returnValue(3);;
        spyOn(service.canvas, 'setWidth');
        service.zoomIn();
        expect(service.canvas.getZoom).toHaveBeenCalled();
        expect(service.canvas.getHeight).toHaveBeenCalled();
        expect(service.canvas.getWidth).toHaveBeenCalled();
        expect(service.canvas.setZoom).toHaveBeenCalled();
        expect(service.canvas.setHeight).toHaveBeenCalled();
        expect(service.canvas.setWidth).toHaveBeenCalled();
        expect(service.canvas.setZoom).toHaveBeenCalledWith(5 * 1.1);
        expect(service.canvas.setHeight).toHaveBeenCalledWith(4 * 1.1);
        expect(service.canvas.setWidth).toHaveBeenCalledWith(3 * 1.1);
        done();
    });

    it('should call zoomOut when canvas is undefined', done => {
        service.canvas = undefined;
        spyOn(console, 'error');
        service.zoomOut();
        expect(console.error).toHaveBeenCalled();
        expect(console.error).toHaveBeenCalledWith('Canvas not found !');
        done();
    });

    it('should call zoomOut', done => {
        const mockCanvas = {
            getZoom: () => { },
            getHeight: () => { },
            getWidth: () => { },
            setZoom: () => { },
            setHeight: () => { },
            setWidth: () => { }
        }
        service.canvas = mockCanvas as unknown as fabric.Canvas;
        spyOn(service.canvas, 'getZoom').and.returnValue(5);
        spyOn(service.canvas, 'setZoom');
        spyOn(service.canvas, 'getHeight').and.returnValue(4);;
        spyOn(service.canvas, 'setHeight');
        spyOn(service.canvas, 'getWidth').and.returnValue(3);;
        spyOn(service.canvas, 'setWidth');
        service.zoomOut();
        expect(service.canvas.getZoom).toHaveBeenCalled();
        expect(service.canvas.getHeight).toHaveBeenCalled();
        expect(service.canvas.getWidth).toHaveBeenCalled();
        expect(service.canvas.setZoom).toHaveBeenCalled();
        expect(service.canvas.setHeight).toHaveBeenCalled();
        expect(service.canvas.setWidth).toHaveBeenCalled();
        expect(service.canvas.setZoom).toHaveBeenCalledWith(5 / 1.1);
        expect(service.canvas.setHeight).toHaveBeenCalledWith(4 / 1.1);
        expect(service.canvas.setWidth).toHaveBeenCalledWith(3 / 1.1);
        done();
    });

});


// Image(class) -> fromURL