import { Injectable } from '@angular/core';
import { fabric } from 'fabric';
import { ImageBrowserService } from './image-browser.service';

@Injectable({
  providedIn: 'root',
})
export class CanvasService {
  private canvas: fabric.Canvas;

  constructor(private imageBrowserService: ImageBrowserService) {}

  // INITIALIZATION
  public initializeCanvas(canvasElementId: string): void {
    this.canvas = new fabric.Canvas(canvasElementId);
    this.initializeRectangleDrawing();
  }

  private initializeRectangleDrawing(): void {
    this.canvas.on('mouse:down', (o) => this.onMouseDown(o));
    this.canvas.on('mouse:move', (o) => this.onMouseMove(o));
    this.canvas.on('mouse:up', (o) => this.onMouseUp(o));
  }

  // MOUSE EVENTS
  private onMouseDown(o: fabric.IEvent) {}

  private onMouseMove(o: fabric.IEvent) {}

  private onMouseUp(o: fabric.IEvent) {}

  // BACKGROUND IMAGE
  public async setBackgroundImage(url: string): Promise<void> {
    try {
      const image = await new Promise<fabric.Image>((resolve, reject) => {
        fabric.Image.fromURL(url, (img) => {
          if (img.getElement()) {
            resolve(img);
          } else {
            reject('Error loading image');
          }
        });
      });

      if (
        !image.width ||
        !image.height ||
        !this.canvas.width ||
        !this.canvas.height
      )
        return;
      // Set canvas dimensions
      this.canvas.setWidth(1280);
      this.canvas.setHeight(720);

      // Adjust image scale to fit within the canvas
      const scaleX = this.canvas.width / image.width;
      const scaleY = this.canvas.height / image.height;
      image.scaleToWidth(this.canvas.width);
      image.scaleToHeight(this.canvas.height);

      this.canvas.setBackgroundImage(
        image,
        this.canvas.renderAll.bind(this.canvas),
        {
          originX: 'left',
          originY: 'top',
          scaleX: scaleX,
          scaleY: scaleY,
        }
      );
    } catch (error) {
      console.error('Error in setting canvas background', error);
    }
  }
}
