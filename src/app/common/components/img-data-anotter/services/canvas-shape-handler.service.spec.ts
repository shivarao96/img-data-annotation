import { TestBed } from '@angular/core/testing';
import { CanvasShapeHandlerService, UUIDService } from './canvas-shape-handler.service';
import { CustomFabricEllipse, CustomFabricPath, DrawingColors, DrawingThinkness } from '../model/models';
import { FABRIC_JS_TOKEN } from '../injection-token/fabric-token';

const MockFabric = {
  Ellipse: class {
    id: string = '';
    settings: any = {}
    constructor(settings: any) {
      settings = settings
    } // to check whether createEllipse being called with settings !
  },
  IText: class {
    id: string = '';
    content: string = '';
    settings: any = {}
    constructor(content: string, settings: any) {
      this.content = content;
      settings = settings;
    } // to check whether createEllipse being called with settings !
  },
  Rect: class {
    id: string = '';
    settings: any = {}
    constructor(settings: any) {
      this.settings = settings;
    } // to check whether createEllipse being called with settings !
  },
  Path: class {
    id: string = '';
    mPath: string = '';
    settings: any = {}
    constructor(mPath: string, settings: any) {
      this.mPath = mPath
      this.settings = settings;
    } // to check whether createEllipse being called with settings !
  },
  Line: class {
    id: string = '';
    points: number[] = [];
    settings: any = {}
    constructor(points: number[], settings: any) {
      this.points = points;
      this.settings = settings;
    } // to check whether createEllipse being called with settings !
  }
}

const MockedUUID = '123456-789-91234';

const MockUUIDService = {
  uuid: () => MockedUUID
}


describe('CanvasShapeHandlerService', () => {
  let service: CanvasShapeHandlerService;
  let fabricJsToken: any;
  let uuidService: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CanvasShapeHandlerService,
        { provide: FABRIC_JS_TOKEN, useValue: MockFabric },
        { provide: UUIDService, useValue: MockUUIDService }
      ],
    });
    service = TestBed.inject(CanvasShapeHandlerService);
    fabricJsToken = TestBed.inject(FABRIC_JS_TOKEN);
    uuidService = TestBed.inject(UUIDService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call setOpacity', done => {
    const tesVal = 'rgba(0,0,0,1)';
    const color = service.setOpacity('rgba(0,0,0,1)', 0.8);
    expect(color).toBe(tesVal.replace(/rgba?(\(\s*\d+\s*,\s*\d+\s*,\s*\d+)(?:\s*,.+?)?\)/, `rgba$1,0.8)`));
    done();
  });

  it('should call createCircle', done => {
    const circleMockUUID = 'circle_uuid_example';
    const canvas = {
      circle: null,
      add: function (circle: any) {
        this.circle = circle;
      }
    }
    const thickness = 1;
    const color = 'rgba(0,0,0,1)';
    const curPos = { x: 100, y: 100 };
    const fillColor = 'rgba(0,0,255,1)'
    const opacity = 0.8

    const mockedEllipseInstance = new fabricJsToken.Ellipse({
      left: 100,
      top: 100,
      strokeWidth: thickness,
      stroke: color,
      fill: 'rgba(0,0,255,0.8)',
      originX: 'left',
      originY: 'top',
      rx: 0,
      ry: 0,
      selectable: false,
      hasRotatingPoint: false
    });
    mockedEllipseInstance.id = circleMockUUID;

    spyOn(service, 'setOpacity').and.callThrough();
    spyOn(uuidService, 'uuid').and.returnValue(circleMockUUID);
    spyOn(canvas, 'add').and.callThrough();

    const serviceCircleInstance: any = service.createCircle(
      canvas as unknown as fabric.Canvas,
      thickness,
      color,
      curPos,
      fillColor,
      opacity
    )
    expect(uuidService.uuid).toHaveBeenCalled();
    expect(service.setOpacity).toHaveBeenCalled();
    expect(canvas.add).toHaveBeenCalledWith(serviceCircleInstance);
    expect(canvas.circle).toEqual(serviceCircleInstance);
    expect(serviceCircleInstance.id).toBe(mockedEllipseInstance.id);
    expect(serviceCircleInstance.settings).toEqual(mockedEllipseInstance.settings);
    done();
  });

  it('should call createCircle with default value', done => {
    const circleMockUUID = 'circle_uuid_example';
    const canvas = {
      circle: null,
      add: function (circle: any) {
        this.circle = circle;
      }
    }
    const thickness = 1;
    const color = 'rgba(0,0,0,1)';
    const curPos = { x: 100, y: 100 };
    const fillColor = 'rgba(0,0,255,1)'
    const opacity = 0.8

    const mockedEllipseInstance = new fabricJsToken.Ellipse({
      left: 100,
      top: 100,
      strokeWidth: thickness,
      stroke: color,
      fill: 'rgba(0,0,255,0.4)',
      originX: 'left',
      originY: 'top',
      rx: 0,
      ry: 0,
      selectable: false,
      hasRotatingPoint: false
    });
    mockedEllipseInstance.id = circleMockUUID;

    spyOn(service, 'setOpacity').and.callThrough();
    spyOn(uuidService, 'uuid').and.returnValue(circleMockUUID);
    spyOn(canvas, 'add').and.callThrough();

    const serviceCircleInstance: any = service.createCircle(
      canvas as unknown as fabric.Canvas,
      thickness,
      color,
      curPos
    )
    expect(uuidService.uuid).toHaveBeenCalled();
    expect(service.setOpacity).toHaveBeenCalled();
    expect(canvas.add).toHaveBeenCalledWith(serviceCircleInstance);
    expect(canvas.circle).toEqual(serviceCircleInstance);
    expect(serviceCircleInstance.id).toBe(mockedEllipseInstance.id);
    expect(serviceCircleInstance.settings).toEqual(mockedEllipseInstance.settings);
    done();
  });

  it('should call createRectangle', done => {
    const rectMockUUID = 'rectangle_uuid_example';
    const canvas = {
      rectangle: null,
      add: function (rectangle: any) {
        this.rectangle = rectangle;
      }
    }
    const thickness = 1;
    const color = 'rgba(0,0,0,1)';
    const curPos = { x: 100, y: 100 };
    const fillColor = 'rgba(0,0,255,1)'
    const opacity = 0.8

    const mockedRectInstance = new fabricJsToken.Rect({
      left: curPos.x,
      top: curPos.y,
      strokeWidth: thickness,
      stroke: color,
      fill: 'rgba(0,0,255,0.8)',
      width: 0,
      height: 0,
      selectable: false,
      hasRotatingPoint: false,
    });
    mockedRectInstance.id = rectMockUUID;

    spyOn(service, 'setOpacity').and.callThrough();
    spyOn(uuidService, 'uuid').and.returnValue(rectMockUUID);
    spyOn(canvas, 'add').and.callThrough();

    const serviceRectInstance: any = service.createRectangle(
      canvas as unknown as fabric.Canvas,
      thickness,
      color,
      curPos,
      fillColor,
      opacity
    )
    expect(uuidService.uuid).toHaveBeenCalled();
    expect(service.setOpacity).toHaveBeenCalled();
    expect(canvas.add).toHaveBeenCalledWith(serviceRectInstance);
    expect(canvas.rectangle).toEqual(serviceRectInstance);
    expect(serviceRectInstance.id).toBe(mockedRectInstance.id);
    expect(serviceRectInstance.settings).toEqual(mockedRectInstance.settings);
    done();
  });

  it('should call createRectangle with default value', done => {
    const rectMockUUID = 'rectangle_uuid_example';
    const canvas = {
      rectangle: null,
      add: function (rectangle: any) {
        this.rectangle = rectangle;
      }
    }
    const thickness = 1;
    const color = 'rgba(0,0,0,1)';
    const curPos = { x: 100, y: 100 };

    const mockedRectInstance = new fabricJsToken.Rect({
      left: curPos.x,
      top: curPos.y,
      strokeWidth: thickness,
      stroke: color,
      fill: 'rgba(0,0,255,0.4)',
      width: 0,
      height: 0,
      selectable: false,
      hasRotatingPoint: false,
    });
    mockedRectInstance.id = rectMockUUID;

    spyOn(service, 'setOpacity').and.callThrough();
    spyOn(uuidService, 'uuid').and.returnValue(rectMockUUID);
    spyOn(canvas, 'add').and.callThrough();

    const serviceRectInstance: any = service.createRectangle(
      canvas as unknown as fabric.Canvas,
      thickness,
      color,
      curPos
    )
    expect(uuidService.uuid).toHaveBeenCalled();
    expect(service.setOpacity).toHaveBeenCalled();
    expect(canvas.add).toHaveBeenCalledWith(serviceRectInstance);
    expect(canvas.rectangle).toEqual(serviceRectInstance);
    expect(serviceRectInstance.id).toBe(mockedRectInstance.id);
    expect(serviceRectInstance.settings).toEqual(mockedRectInstance.settings);
    done();
  });

  it('should call createPath', done => {
    const pathMockUUID = 'path_uuid_example';
    const canvas = {
      path: null,
      add: function (path: any) {
        this.path = path;
      }
    }
    const selectedThickness = 1;
    const selectedColour = 'rgba(0,0,0,1)';
    const curPos = { x: 100, y: 100 };
    const Mpath = 'M 100 100'

    const mockedPathInstance = new fabricJsToken.Path(Mpath, {
      strokeWidth: selectedThickness,
      stroke: selectedColour,
      fill: '',
      selectable: false,
      hasRotatingPoint: false,
    });
    mockedPathInstance.id = pathMockUUID;
    spyOn(uuidService, 'uuid').and.returnValue(pathMockUUID);
    spyOn(canvas, 'add').and.callThrough();

    const servicePathInstance: any = service.createPath(
      canvas as unknown as fabric.Canvas,
      selectedThickness,
      selectedColour,
      curPos
    )
    expect(uuidService.uuid).toHaveBeenCalled();
    expect(canvas.add).toHaveBeenCalledWith(servicePathInstance);
    expect(canvas.path).toEqual(servicePathInstance);
    expect(servicePathInstance.id).toBe(mockedPathInstance.id);
    expect(servicePathInstance.mPath).toBe(mockedPathInstance.mPath);
    expect(servicePathInstance.settings).toEqual(mockedPathInstance.settings);
    done();
  });

  it('should call createIText', done => {
    const pathMockUUID = 'text_uuid_example';
    const canvas = {
      text: null,
      add: function (text: any) {
        this.text = text;
      }
    }
    const textOPtions = {
      content: 'text',
      thickness: 1,
      color: 'rgba(0,0,255,1)',
      pointer: { x: 0, y: 0 },
      fontSize: 24
    };

    const mockedTextInstance = new fabricJsToken.IText(textOPtions.content, {
      strokeWidth: textOPtions.thickness,
      stroke: textOPtions.color,
      fill: textOPtions.color,
      fontSize: textOPtions.fontSize,
      left: textOPtions.pointer.x,
      top: textOPtions.pointer.y,
      selectable: false,
      hasRotatingPoint: false,
    });
    mockedTextInstance.id = pathMockUUID;
    spyOn(uuidService, 'uuid').and.returnValue(pathMockUUID);
    spyOn(canvas, 'add').and.callThrough();

    const serviceTextInstance: any = service.createIText(
      canvas as unknown as fabric.Canvas,
      textOPtions
    )
    expect(uuidService.uuid).toHaveBeenCalled();
    expect(canvas.add).toHaveBeenCalledWith(serviceTextInstance);
    expect(canvas.text).toEqual(serviceTextInstance);
    expect(serviceTextInstance.id).toBe(mockedTextInstance.id);
    expect(serviceTextInstance.content).toBe(mockedTextInstance.content);
    expect(serviceTextInstance.settings).toEqual(mockedTextInstance.settings);
    done();
  });

  it('should call createIText with default', done => {
    const pathMockUUID = 'text_uuid_example';
    const canvas = {
      text: null,
      add: function (text: any) {
        this.text = text;
      }
    }
    const textOPtions = {
      pointer: { x: 0, y: 0 }
    };

    const mockedTextInstance = new fabricJsToken.IText('Text', {
      strokeWidth: 1,
      stroke: 'rgba(0,0,0,1)',
      fill: 'rgba(0,0,0,1)',
      fontSize: 18,
      left: textOPtions.pointer.x,
      top: textOPtions.pointer.y,
      selectable: false,
      hasRotatingPoint: false,
    });
    mockedTextInstance.id = pathMockUUID;
    spyOn(uuidService, 'uuid').and.returnValue(pathMockUUID);
    spyOn(canvas, 'add').and.callThrough();

    const serviceTextInstance: any = service.createIText(
      canvas as unknown as fabric.Canvas,
      textOPtions
    )
    expect(uuidService.uuid).toHaveBeenCalled();
    expect(canvas.add).toHaveBeenCalledWith(serviceTextInstance);
    expect(canvas.text).toEqual(serviceTextInstance);
    expect(serviceTextInstance.id).toBe(mockedTextInstance.id);
    expect(serviceTextInstance.content).toBe(mockedTextInstance.content);
    expect(serviceTextInstance.settings).toEqual(mockedTextInstance.settings);
    done();
  });

  it('should call createLine', done => {
    const pathMockUUID = 'text_uuid_example';
    const canvas = {
      line: null,
      add: function (line: any) {
        this.line = line;
      }
    }

    const selectedThickNess = 1;
    const selectedColour = 'rgba(0,0,255,1)';
    const dashArray = [5, 0];
    const cursor = { x: 0, y: 0 };
    const fillColor = 'rgba(0,0,255,1)';
    const opacity = 0.4;

    const mockedLineInstance = new fabricJsToken.Line([cursor.x, cursor.y, cursor.x, cursor.y], {
      strokeWidth: selectedThickNess,
      stroke: selectedColour,
      fill: 'rgba(0,0,255,0.4)',
      strokeDashArray: dashArray,
      selectable: false,
      hasRotatingPoint: false,
    });
    mockedLineInstance.id = pathMockUUID;
    spyOn(service, 'setOpacity').and.callThrough();
    spyOn(uuidService, 'uuid').and.returnValue(pathMockUUID);
    spyOn(canvas, 'add').and.callThrough();

    const serviceLineInstance: any = service.createLine(
      canvas as unknown as fabric.Canvas,
      selectedThickNess,
      selectedColour,
      dashArray,
      cursor,
      fillColor,
      opacity
    )
    expect(uuidService.uuid).toHaveBeenCalled();
    expect(canvas.add).toHaveBeenCalledWith(serviceLineInstance);
    expect(canvas.line).toEqual(serviceLineInstance);
    expect(serviceLineInstance.id).toBe(mockedLineInstance.id);
    expect(serviceLineInstance.content).toBe(mockedLineInstance.content);
    expect(serviceLineInstance.settings).toEqual(mockedLineInstance.settings);
    done();
  });

  it('should call createLine with default value', done => {
    const pathMockUUID = 'text_uuid_example';
    const canvas = {
      line: null,
      add: function (line: any) {
        this.line = line;
      }
    }

    const selectedThickNess = 1;
    const selectedColour = 'rgba(0,0,255,1)';
    const dashArray = [5, 0];
    const cursor = { x: 0, y: 0 };
    const fillColor = 'rgba(0,0,255,1)';
    const opacity = 0.4;

    const mockedLineInstance = new fabricJsToken.Line([cursor.x, cursor.y, cursor.x, cursor.y], {
      strokeWidth: selectedThickNess,
      stroke: selectedColour,
      fill: 'rgba(0,0,255,0.4)',
      strokeDashArray: dashArray,
      selectable: false,
      hasRotatingPoint: false,
    });
    mockedLineInstance.id = pathMockUUID;
    spyOn(service, 'setOpacity').and.callThrough();
    spyOn(uuidService, 'uuid').and.returnValue(pathMockUUID);
    spyOn(canvas, 'add').and.callThrough();

    const serviceLineInstance: any = service.createLine(
      canvas as unknown as fabric.Canvas,
      selectedThickNess,
      selectedColour,
      dashArray,
      cursor
    )
    expect(uuidService.uuid).toHaveBeenCalled();
    expect(canvas.add).toHaveBeenCalledWith(serviceLineInstance);
    expect(canvas.line).toEqual(serviceLineInstance);
    expect(serviceLineInstance.id).toBe(mockedLineInstance.id);
    expect(serviceLineInstance.content).toBe(mockedLineInstance.content);
    expect(serviceLineInstance.settings).toEqual(mockedLineInstance.settings);
    done();
  });

  it('should call formCircle', done => {
    const mockEllipse: any = {
      set: () => {},
      setCoords: () => {}
    }
    spyOn(mockEllipse, 'set');
    spyOn(mockEllipse, 'setCoords');

    service.formCircle(mockEllipse, {x: 100, y: 100}, {x: 200, y: 200});

    expect(mockEllipse.set).toHaveBeenCalled();
    expect(mockEllipse.set).toHaveBeenCalledWith({
      rx: 50,
      ry: 50,
    });
    expect(mockEllipse.setCoords).toHaveBeenCalled();
    done();
  });

  it('should call formRectangle', done => {
    const mockRect: any = {
      set: () => {},
      setCoords: () => {}
    }
    spyOn(mockRect, 'set');
    spyOn(mockRect, 'setCoords');

    service.formRectangle(mockRect, {x: 100, y: 100}, {x: 200, y: 200});

    expect(mockRect.set).toHaveBeenCalled();
    expect(mockRect.set).toHaveBeenCalledTimes(3);
    expect(mockRect.set).toHaveBeenCalledWith({
      width: 100,
      height: 100,
    });
    expect(mockRect.set).toHaveBeenCalledWith({
      left: 100,
    });
    expect(mockRect.set).toHaveBeenCalledWith({
      top: 100
    });
    expect(mockRect.setCoords).toHaveBeenCalled();
    done();
  });

  it('should call formPath', done => {
    const mockPath: any = {
      path: []
    }
    service.formPath(mockPath, {x: 100, y: 200});
    expect(mockPath.path).toEqual([
      ['L', 100, 200]
    ]);
    done();
  });

  it('should call formPath', done => {
    const mockLine: any = {
      set: (point: any) => {},
      setCoords: () => {}
    }
    spyOn(mockLine, 'set');
    spyOn(mockLine, 'setCoords');
    service.formLine(mockLine, {x: 100, y: 200});
    expect(mockLine.set).toHaveBeenCalled();
    expect(mockLine.set).toHaveBeenCalledWith({
      x2: 100,
      y2: 200,
    });
    expect(mockLine.setCoords).toHaveBeenCalled();
    done();
  });

  it('should call finishPath', done => {
    const pathMockUUID = 'path_uuid_example';
    const canvas = {
      add: function (path: any) {},
      remove: function(path: any) {}
    }
    const path = {
      path: 'M 100 100',
      strokeWidth: 1,
      stroke: 'rgba(0,0,0,1)',
      fill: '',
      selectable: false,
      hasRotatingPoint: false,
      id: pathMockUUID
    }

    const mockedPathInstance = new fabricJsToken.Path(path.path, {
      strokeWidth: path.strokeWidth,
      stroke: path.stroke,
      fill: '',
      selectable: false,
      hasRotatingPoint: false,
    });
    mockedPathInstance.id = pathMockUUID;
    spyOn(canvas, 'add').and.callThrough();
    spyOn(canvas, 'remove').and.callThrough();

    const servicePathInstance: any = service.finishPath(
      canvas as unknown as fabric.Canvas,
      path as unknown as CustomFabricPath
    )
    expect(canvas.remove).toHaveBeenCalledWith(path);
    expect(canvas.add).toHaveBeenCalledWith(servicePathInstance);
    expect(servicePathInstance.id).toBe(mockedPathInstance.id);
    expect(servicePathInstance.mPath).toBe(mockedPathInstance.mPath);
    expect(servicePathInstance.settings).toEqual(mockedPathInstance.settings);
    done();
  });

  it('should call uuid function of UUIDService', done => {
    const uuidServiceInstance = new UUIDService();
    const uuid = uuidServiceInstance.uuid();
    expect(uuid).toBeDefined();
    expect(typeof uuid).toBe('string');
    expect(uuid).toMatch(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[4][0-9a-fA-F]{3}-[8-9a-bA-B][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/);
    done();
  })

});

// src/app/common/components/img-data-anotter/services/canvas-shape-handler.service.spec.ts
