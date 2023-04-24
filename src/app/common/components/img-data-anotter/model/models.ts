interface CustomFabricProps {
  id: string;
}
export type CustomFabricObject = fabric.Object & CustomFabricProps;
export type CustomFabricEllipse = fabric.Ellipse & CustomFabricProps;
export type CustomFabricRect = fabric.Rect & CustomFabricProps;
export type CustomFabricPath = fabric.Path & CustomFabricProps;
export type CustomFabricLine = fabric.Line & CustomFabricProps;
export type CustomFabricIText = fabric.IText & CustomFabricProps;

export enum DrawingTools {
  SELECT = 'SELECT',
  ERASE = 'ERASE',
  CIRCLE = 'CIRCLE',
  RECTANGLE = 'RECTANGLE',
  FREEHAND = 'FREEHAND',
  LINE = 'LINE',
  DASHED_LINE = 'DASHED_LINE',
  TEXT = 'TEXT',
  CLEARALL = 'CLEARALL',
  NONE='NONE'
}

export enum ErrorMessages {
  CANVAS_NOT_FOUND = 'Canvas not found !',
  UNABLE_TO_UPLOAD_IMAGE = 'Unable to upload image !',
    
}

//-- these should be handled from client side
export enum DrawingColors {
  BLACK = 'rgba(0,0,0,1)',
  WHITE = 'rgba(255,255,255,1)',
  RED = 'rgba(255,0,0,1)',
  GREEN = 'rgba(0,255,0,1)',
  BLUE = 'rgba(0,0,255,1)',
  YELLOW = 'rgba(255,255,0,1)',
}

//-- these should be handled from client side
export enum DrawingThinkness {
  THIK_NESS_1 = 1,
  THIK_NESS_2 = 2,
  THIK_NESS_3 = 3,
  THIK_NESS_4 = 4,
  THIK_NESS_5 = 5
}

export interface CursorPos {
  x: number;
  y: number;
}

export enum FabricObjectType {
  RECT = 'rect',
  ELLIPSE = 'ellipse', // using ellipse as circle right now
  I_TEXT = 'i-text',
  LINE = 'line',
  PATH = 'path',
}
