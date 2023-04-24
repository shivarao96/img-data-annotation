import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ImgDataAnotterComponent } from './common/components/img-data-anotter/img-data-anotter.component';
import { CanvasEditiorComponent } from './common/components/img-data-anotter/canvas-editior/canvas-editior.component';
import { CanvasEditorToolComponent } from './common/components/img-data-anotter/canvas-editor-tool/canvas-editor-tool.component';
import { CommonModule } from '@angular/common';
import { FABRIC_JS_TOKEN, fabricProvider } from './common/components/img-data-anotter/injection-token/fabric-token';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    ImgDataAnotterComponent,
    CanvasEditiorComponent,
    CanvasEditorToolComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule
  ],
  exports: [
  ],
  providers: [
    { provide: FABRIC_JS_TOKEN, useFactory: fabricProvider }
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
