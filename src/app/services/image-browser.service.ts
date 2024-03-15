import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ImageBrowserService {
  private imageUrls: string[] = [];
  private currentIndex: number = 0;
  private numberOfImages: number = 0;

  constructor() {}

  public initialize(imageUrls: string[]) {
    this.imageUrls = imageUrls;
    this.currentIndex = 0;
    this.numberOfImages = imageUrls.length;
  }

  getNumberOfImages(): number {
    return this.numberOfImages;
  }

  getCurrentIndex(): number {
    return this.currentIndex;
  }

  private async loadImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = reject;
      image.src = url;
    });
  }

  public async getCurrentImage(): Promise<HTMLImageElement> {
    const url = this.imageUrls[this.currentIndex];
    return this.loadImage(url);
  }

  public nextImage(): Promise<HTMLImageElement> {
    this.currentIndex = (this.currentIndex + 1) % this.imageUrls.length;
    return this.getCurrentImage();
  }

  public previousImage(): Promise<HTMLImageElement> {
    this.currentIndex =
      (this.currentIndex - 1 + this.imageUrls.length) % this.imageUrls.length;
    return this.getCurrentImage();
  }
}
