import { Component, Host, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatasetFolders, DatasetName } from 'src/app/models/datasets.model';
import { YoloFolderDataService } from 'src/app/services/yolo-folder-data.service';
import { fabric } from 'fabric';
import { Canvas } from 'fabric/fabric-impl';
import { ImageBrowserService } from 'src/app/services/image-browser.service';

@Component({
  selector: 'app-picture-annotator',
  templateUrl: './picture-annotator.component.html',
  styleUrls: ['./picture-annotator.component.css'],
})
export class PictureAnnotatorComponent implements OnInit {
  datasetName: DatasetName;
  datasetFolders: DatasetFolders;
  canvas: Canvas;
  currentImage: HTMLImageElement;
  currentImageSrc: string;

  constructor(
    private datasetFoldersService: YoloFolderDataService,
    private imageBrosweService: ImageBrowserService,
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
        this.imageBrosweService.initialize(
          this.datasetFolders.trainImagesFolder
        );
        this.loadImage();
      });
  }

  async loadImage() {
    try {
      this.currentImage = await this.imageBrosweService.getCurrentImage();
      this.currentImageSrc = this.currentImage.src;
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

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'ArrowRight' || event.key === 'e') {
      this.onNextImage();
    } else if (event.key === 'ArrowLeft' || event.key === 'q') {
      this.onPreviousImage();
    }
  }
}
