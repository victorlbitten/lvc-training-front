import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatasetFolders, DatasetName } from 'src/app/models/datasets.model';
import { YoloFolderDataService } from 'src/app/services/yolo-folder-data.service';
import { fabric } from 'fabric';
import { Canvas } from 'fabric/fabric-impl';

@Component({
  selector: 'app-picture-annotator',
  templateUrl: './picture-annotator.component.html',
  styleUrls: ['./picture-annotator.component.css'],
})
export class PictureAnnotatorComponent implements OnInit {
  datasetName: DatasetName;
  datasetFolders: DatasetFolders;
  canvas: Canvas;

  private isDrawing = false;
  private origX = 0;
  private origY = 0;
  private rect: fabric.Rect;
  private isInteracting = false;

  constructor(
    private datasetFoldersService: YoloFolderDataService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.getRouteParams();
    this.getDatasetFolders();
  }

  getRouteParams() {
    this.datasetName = this.route.snapshot.params['datasetname'];
  }

  getDatasetFolders() {
    this.datasetFoldersService
      .getDatasetFolders(this.datasetName)
      .subscribe((folders) => {
        this.datasetFolders = folders;
        this.initializeCanvas();
        console.log(this.datasetFolders);
      });
  }

  private initializeCanvas() {
    const url: string = this.datasetFolders.trainImagesFolder[0];
    this.canvas = new fabric.Canvas('imgAnnotator', {
      width: 1280,
      height: 720,
    });

    fabric.Image.fromURL(url, (img) => {
      if (
        !this.canvas.width ||
        !this.canvas.height ||
        !img.width ||
        !img.height
      )
        return;

      this.canvas.setBackgroundImage(
        img,
        this.canvas.renderAll.bind(this.canvas),
        {
          scaleX: this.canvas.width / img.width,
          scaleY: this.canvas.height / img.height,
        }
      );
    });
    this.canvas.on('mouse:down', (o) => {
      if (this.canvas.getActiveObject()) {
        this.isInteracting = true;
        return;
      }
      let pointer = this.canvas.getPointer(o.e);
      this.origX = pointer.x;
      this.origY = pointer.y;
      this.isDrawing = true;
      this.rect = this.createCustomRectangle(this.origX, this.origY, 0, 0); // Use custom rectangle creation
      this.canvas.add(this.rect);

      // this.rect = new fabric.Rect({
      //   left: this.origX,
      //   top: this.origY,
      //   originX: 'left',
      //   originY: 'top',
      //   width: pointer.x - this.origX,
      //   height: pointer.y - this.origY,
      //   angle: 0,
      //   fill: 'rgba(255,0,0,0.5)',
      //   transparentCorners: false,
      // });
      // this.canvas.add(this.rect);
    });

    this.canvas.on('mouse:wheel', (event) => {
      const delta = event.e.deltaY;
      const isShiftKeyPressed = event.e.shiftKey;

      if (isShiftKeyPressed) {
        this.scaleRectangle(delta, true); // Vertical scaling
      } else {
        this.scaleRectangle(delta, false); // Horizontal scaling
      }
    });

    this.canvas.on('mouse:move', (o) => {
      if (this.isInteracting) return;
      if (!this.isDrawing) return;

      let pointer = this.canvas.getPointer(o.e);
      if (this.origX > pointer.x) {
        this.rect.set({ left: Math.abs(pointer.x) });
      }
      if (this.origY > pointer.y) {
        this.rect.set({ top: Math.abs(pointer.y) });
      }

      this.rect.set({ width: Math.abs(this.origX - pointer.x) });
      this.rect.set({ height: Math.abs(this.origY - pointer.y) });

      this.canvas.renderAll();
    });

    this.canvas.on('mouse:up', () => {
      this.isDrawing = false;
      this.isInteracting = false;
    });
    this.canvas.on('selection:created', (e) => {
      if (e.selected) {
        this.displayProperties(e.selected);
      }
    });
    this.canvas.on('selection:updated', (e) => {
      if (e.selected) {
        this.displayProperties(e.selected);
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'x' && this.canvas.getActiveObject() !== null) {
        this.canvas.remove(this.canvas.getActiveObject() as fabric.Object);
        this.listRectangles();
      }
    });

    document.addEventListener('keydown', (event) => {
      const activeObject = this.canvas.getActiveObject();
      if (activeObject instanceof fabric.Object) {
        if (!activeObject.left || !activeObject.top) return;
        const step = 5; // Set the movement step
        switch (event.key) {
          case 'w':
            activeObject.top -= step;
            break;
          case 'a':
            activeObject.left -= step;
            break;
          case 's':
            activeObject.top += step;
            break;
          case 'd':
            activeObject.left += step;
            break;
        }
        this.canvas.renderAll();
      }
    });
  }

  private displayProperties(selectedObjects: fabric.Object[]) {
    // Assuming single selection for simplicity
    if (selectedObjects.length > 0) {
      let selectedObject = selectedObjects[0];
      if (selectedObject.type === 'rect') {
        let rect = selectedObject as fabric.Rect;
        console.log('Rectangle Properties:', {
          left: rect.left,
          top: rect.top,
          width: rect.width,
          height: rect.height,
        });
      }
    }
  }

  private createCustomRectangle(
    left: number,
    top: number,
    width: number,
    height: number
  ): fabric.Rect {
    let rect = new fabric.Rect({
      left,
      top,
      width,
      height,
      fill: 'transparent',
      strokeWidth: 2,
      stroke: 'rgba(255,0,0)',
      transparentCorners: false,
    });

    rect.setControlsVisibility({
      mt: true,
      mb: true,
      ml: true,
      mr: true,
      mtr: false,
    });

    return rect;
  }

  private listRectangles(): fabric.Rect[] {
    const rectangles: fabric.Rect[] = this.canvas.getObjects().filter((obj) => {
      return obj instanceof fabric.Rect;
    }) as fabric.Rect[];
    console.log(rectangles);
    return rectangles;
  }

  private scaleRectangle(delta: number, isVertical: boolean) {
    const activeObject = this.canvas.getActiveObject();
    if (activeObject instanceof fabric.Rect) {
      const scaleFactor = -delta * 0.0002;
      if (
        !activeObject.scaleY ||
        !activeObject.top ||
        !activeObject.height ||
        !activeObject.scaleX ||
        !activeObject.width ||
        !activeObject.left
      )
        return;
      if (isVertical) {
        activeObject.scaleY += scaleFactor;
        activeObject.top -= (scaleFactor * activeObject.height) / 2;
      } else {
        activeObject.scaleX += scaleFactor;
        activeObject.left -= (scaleFactor * activeObject.width) / 2;
      }
      this.canvas.renderAll();
    }
  }
}
