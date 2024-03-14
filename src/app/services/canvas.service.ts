import { Injectable } from '@angular/core';
import { fabric } from 'fabric';

@Injectable({
  providedIn: 'root',
})
export class CanvasService {
  private canvas: fabric.Canvas;
  private currentRect: fabric.Rect | null = null;
  private origX = 0;
  private origY = 0;
  private isDrawing = false;

  constructor() {}

  // INITIALIZATION
  public initializeCanvas(canvasElementId: string): void {
    this.canvas = new fabric.Canvas(canvasElementId, { selection: false });
    this.initializeRectangleDrawing();
  }

  private initializeRectangleDrawing(): void {
    this.canvas.on('mouse:down', (o) => this.onMouseDown(o));
    this.canvas.on('mouse:move', (o) => this.onMouseMove(o));
    this.canvas.on('mouse:up', (o) => this.onMouseUp(o));
  }

  // MOUSE EVENTS
  private onMouseDown(o: fabric.IEvent) {
    if (this.canvas.getActiveObject()) {
      this.isDrawing = false;
      return;
    }
    let pointer = this.canvas.getPointer(o.e);
    this.origX = pointer.x;
    this.origY = pointer.y;
    this.isDrawing = true;

    this.currentRect = this.createRectangle(pointer);
    this.canvas.add(this.currentRect);
    this.canvas.setActiveObject(this.currentRect);
  }

  private onMouseMove(o: fabric.IEvent) {
    if (!this.isDrawing || !this.currentRect) return;
    let pointer = this.canvas.getPointer(o.e);

    if (this.origX > pointer.x) {
      this.currentRect.set({ left: pointer.x });
    }
    if (this.origY > pointer.y) {
      this.currentRect.set({ top: pointer.y });
    }

    this.currentRect.set({ width: Math.abs(this.origX - pointer.x) });
    this.currentRect.set({ height: Math.abs(this.origY - pointer.y) });

    this.canvas.renderAll();
  }

  private onMouseUp(o: fabric.IEvent) {
    this.isDrawing = false;
    this.removeIfNoSize();
  }

  createRectangle(pointer: { x: number; y: number }): fabric.Rect {
    return new fabric.Rect({
      left: this.origX,
      top: this.origY,
      originX: 'left',
      originY: 'top',
      width: pointer.x - this.origX,
      height: pointer.y - this.origY,
      angle: 0,
      fill: 'transparent',
      stroke: 'red',
      strokeWidth: 2,
      transparentCorners: false,
    });
  }

  private removeIfNoSize() {
    if (this.currentRect && this.currentRect.width === 0) {
      this.canvas.remove(this.currentRect);
      this.currentRect = null;
    }
  }

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
