import { Component } from '@angular/core';
import { ImgDataAnnoterConfig } from './common/components/img-data-anotter/img-data-anotter.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  imageDataAnnotationSetup: ImgDataAnnoterConfig = {
    colors: Object.values(Colors),
    thicknessRange: {
      lowerBound: 1,
      higherBound: 10
    },
    tools: {
      circle: true,
      rectangle: true,
      freehand: true,
      line: true,
      dashed_line: true,
      text: true,
    },
    style: {
      editor: {
        width: '70vw',
        height: '100vh'
      },
      tool: {
        width: '30vw',
        height: '100vh',
        primaryColor: 'rgba(232, 106, 51, 0.8)',
        secondaryColor: '#FDA65D',
        button: {
          color: '#FED2AA',
          borderColor: '#f4f4f4',
        },
        label: {
          fontFamily: 'sans-serif',
          fontSize: '16px',
          labels: {
            uploadImageLabel: 'Upload Image',
            drawingToolLabel: 'Drawing tools',
            actionToolLabel: 'Action tools',
            changeThicknessLabel: 'Change thickness',
            changeColorLabel: 'Change color',
            saveAsLabel: 'Save as image'
          }
        },
        images: {
          uploadAction1: 'assets/images/gallery.png',
          uploadAction2: 'assets/images/upload.png',
          cancelUpload: 'assets/images/cancel.png',
          selectTool: 'assets/images/selection-main.png',
          eraseTool: 'assets/images/eraser-main.png',
          circleDrawTool: 'assets/images/circle-main.png',
          rectangleDrawTool: 'assets/images/rectangle.png',
          freeHandDrawTool: 'assets/images/pencil.png',
          lineDrawTool: 'assets/images/straight-line.png',
          dashedLineDrawTool: 'assets/images/dashed-line.png',
          textDrawTool: 'assets/images/text.png',
          clearAll: 'assets/images/trash-can.png',
          zoomIn: 'assets/images/maximize.png',
          zoomOut: 'assets/images/minimize.png',
          saveAs: 'assets/images/download.png'
        }
      }
    }
  }
}

export enum Colors {
  BLACK = 'rgba(0,0,0,1)',
  WHITE = 'rgba(255,255,255,1)',
  RED = 'rgba(255,0,0,1)',
  GREEN = 'rgba(0,255,0,1)',
  BLUE = 'rgba(0,0,255,1)',
  YELLOW = 'rgba(255,255,0,1)',
}
