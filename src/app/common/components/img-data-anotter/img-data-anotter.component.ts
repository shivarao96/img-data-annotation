import { Component, Input } from '@angular/core';
import { ActiveTools, ThickNessRange, ToolsStyleHandler } from './canvas-editor-tool/canvas-editor-tool.component';

@Component({
  selector: 'app-img-data-anotter',
  templateUrl: './img-data-anotter.component.html',
  styleUrls: ['./img-data-anotter.component.scss']
})
export class ImgDataAnotterComponent {
  bgImage = "../../../../assets/images/canvas-bg.png";
  @Input() mainSetup: ImgDataAnnoterConfig | undefined;

  constructor() {}
}

export interface ImgDataAnnoterConfig {
  colors?: Array<string>,
  thicknessRange?: ThickNessRange,
  tools?: ActiveTools,
  style?: {
    editor?: {
      width?: string, // example '70vw' 
      height?: string // example '100vh'
    },
    tool?: ToolsStyleHandler
  }
}