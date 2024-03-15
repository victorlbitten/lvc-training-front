import { Component, Host, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatasetFolders, DatasetName } from 'src/app/models/datasets.model';
import { YoloFolderDataService } from 'src/app/services/yolo-folder-data.service';
import { ImageBrowserService } from 'src/app/services/image-browser.service';
import { CanvasService } from 'src/app/services/canvas.service';
import { Yolov5Rect } from 'src/app/models/general.model';

@Component({
  selector: 'app-picture-annotator',
  templateUrl: './picture-annotator.component.html',
  styleUrls: ['./picture-annotator.component.css'],
})
export class PictureAnnotatorComponent implements OnInit {
  datasetName: DatasetName;
  datasetFolders: DatasetFolders;
  currentImage: HTMLImageElement;
  currentImageSrc: string;

  annotations: Map<string, Yolov5Rect> = new Map();

  constructor(
    private datasetFoldersService: YoloFolderDataService,
    private imageBrosweService: ImageBrowserService,
    private canvasService: CanvasService,
    private route: ActivatedRoute
  ) {}

  // INITIALIZATION
  ngOnInit() {
    this.getRouteParams();
    this.getDatasetFolders();
    this.canvasService.initializeCanvas('annotationCanvas');
  }

  getRouteParams() {
    this.datasetName = this.route.snapshot.params['datasetname'];
  }

  getDatasetFolders() {
    this.datasetFoldersService
      .getDatasetFolders(this.datasetName)
      .subscribe((folders) => {
        this.datasetFolders = folders;
        this.imageBrosweService.initialize(
          this.datasetFolders.trainImagesFolder
        );
        this.loadImage();
      });
  }

  // IMAGE HANDLING
  async loadImage() {
    try {
      this.currentImage = await this.imageBrosweService.getCurrentImage();
      this.currentImageSrc = this.currentImage.src;
      this.canvasService.setBackgroundImage(this.currentImageSrc);
    } catch (err) {
      console.error(err);
    }
  }

  async onPreviousImage() {
    await this.imageBrosweService.previousImage();
    this.loadImage();
  }

  async onNextImage() {
    await this.imageBrosweService.nextImage();
    this.loadImage();
  }

  // SHORTCUTS
  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    // Navigation
    if (event.key === 'ArrowRight' || event.key === 'e') {
      this.onNextImage();
    } else if (event.key === 'ArrowLeft' || event.key === 'q') {
      this.onPreviousImage();
    }
    // Deletion
    if (event.key === 'x') {
      this.canvasService.removeActiveRectangle();
    }
  }

  addAnnotation(category: string) {
    const activeRectangle =
      this.canvasService.getActiveRectangle() as Yolov5Rect;
    if (activeRectangle && activeRectangle.id) {
      activeRectangle.class = category;
      this.annotations.set(activeRectangle.id.toString(), activeRectangle);
      console.log(this.annotations);
    }
  }
}
