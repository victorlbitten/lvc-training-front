import { Injectable } from '@angular/core';
import { fabric } from 'fabric';
import { Yolov5Rect } from '../models/general.model';

@Injectable({
  providedIn: 'root',
})
export class CanvasService {
  private canvas: fabric.Canvas;
  private currentRect: Yolov5Rect | null = null;
  private origX = 0;
  private origY = 0;
  private isDrawing = false;
  private rectId = 1;

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

    // Calculate width and height based on the original and current pointer positions
    let width = Math.abs(this.origX - pointer.x);
    let height = Math.abs(this.origY - pointer.y);

    // Calculate the rectangle's position
    let left = pointer.x < this.origX ? pointer.x : this.origX;
    let top = pointer.y < this.origY ? pointer.y : this.origY;

    // Constrain the rectangle within the canvas boundaries
    if (!this.canvas.width || !this.canvas.height) return;
    if (left + width > this.canvas.width) {
      width = this.canvas.width - left;
    }
    if (top + height > this.canvas.height) {
      height = this.canvas.height - top;
    }

    // Update the rectangle's position and size
    this.currentRect.set({
      left: left,
      top: top,
      width: width,
      height: height,
    });

    this.canvas.renderAll();
  }

  private onMouseUp(o: fabric.IEvent) {
    this.isDrawing = false;
    this.removeIfNoSize();
  }

  createRectangle(pointer: { x: number; y: number }): Yolov5Rect {
    const rect: Yolov5Rect = new fabric.Rect({
      left: this.origX,
      top: this.origY,
      originX: 'left',
      originY: 'top',
      width: pointer.x - this.origX,
      height: pointer.y - this.origY,
      angle: 0,
      fill: 'rgb(255,0,0,0.1)',
      stroke: 'red',
      strokeWidth: 2,
      transparentCorners: false,
    });
    rect.setControlsVisibility({
      mt: true, // middle top disable
      mb: true, // middle bottom disable
      ml: true, // middle left disable
      mr: true, // middle right disable
      mtr: false, // top rotate disable
    });
    rect.id = this.rectId++;
    rect.on('moving', () => {
      this.constrainRectWithinCanvas(rect);
    });

    return rect;
  }

  private removeIfNoSize() {
    if (this.currentRect && this.currentRect.width === 0) {
      this.canvas.remove(this.currentRect);
      this.currentRect = null;
    }
  }

  public removeActiveRectangle(): void {
    const activeObject = this.canvas.getActiveObject();
    if (activeObject instanceof fabric.Rect) {
      this.canvas.remove(activeObject);
    }
  }

  public clearRectangles(): void {
    this.rectId = 1;
    const objects = this.canvas.getObjects() as Yolov5Rect[];
    console.log(objects);
    for (let i = objects.length - 1; i >= 0; i--) {
      const object: Yolov5Rect = objects[i];
      if (object.text) this.canvas.remove(object.text);
      this.canvas.remove(object);
    }
  }

  public addTextToRectangle(rectangle: Yolov5Rect, textValue: string): void {
    if (!rectangle.top || !rectangle.left) return;
    const text = new fabric.Text(textValue, {
      fontSize: 18, // Example font size
      fill: 'red', // Example text color
      left: rectangle.left, // Align with the left edge of the rectangle
      top: rectangle.top - 20, // Position above the rectangle; adjust as needed
      selectable: false,
    });

    rectangle.text = text;
    this.canvas.add(text);
    this.attachTextToRectangle(rectangle, text);
    this.canvas.renderAll();
    this.canvas.discardActiveObject().renderAll();
  }

  public getActiveRectangle(): Yolov5Rect | null {
    const activeObject = this.canvas.getActiveObject();
    if (activeObject instanceof fabric.Rect) {
      return activeObject;
    }
    return null;
  }

  private attachTextToRectangle(
    rectangle: Yolov5Rect,
    text: fabric.Text
  ): void {
    rectangle.on('moving', () => {
      if (!rectangle.top) return;
      text.set({
        left: rectangle.left,
        top: rectangle.top - 20, // Adjust this value as necessary
      });
      this.canvas.renderAll();
    });
  }

  // BACKGROUND IMAGE
  public async setBackgroundImage(url: string): Promise<void> {
    this.clearRectangles();
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
      this.canvas.setWidth(1080);
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

  private constrainRectWithinCanvas(rect: Yolov5Rect) {
    if (!rect.left || !rect.top || !rect.width || !rect.height) return;
    if (!this.canvas.width || !this.canvas.height) return;

    // Constrain horizontally
    if (rect.left < 0) {
      rect.left = 0;
    } else if (rect.left + rect.width > this.canvas.width) {
      rect.left = this.canvas.width - rect.width;
    }

    // Constrain vertically
    if (rect.top < 0) {
      rect.top = 0;
    } else if (rect.top + rect.height > this.canvas.height) {
      rect.top = this.canvas.height - rect.height;
    }
  }
}
