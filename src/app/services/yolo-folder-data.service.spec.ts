import { TestBed } from '@angular/core/testing';

import { YoloFolderDataService } from './yolo-folder-data.service';

describe('YoloFolderDataService', () => {
  let service: YoloFolderDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(YoloFolderDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
