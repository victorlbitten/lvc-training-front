import { NodeHttpResponse } from "./general.model";

type FileList = string[];

export interface DatasetFolders {
  [key: string]: FileList;
  trainImagesFolder: FileList;
  trainLabelsFolder: FileList;
  validImagesFolder: FileList;
  validLabelsFolder: FileList;
}

export type DatasetName = string;

export interface Dataset {
  name: DatasetName;
  folders: DatasetFolders;
}


export interface GetAllDatasetsResponse extends NodeHttpResponse {
    data: DatasetName[];
}

export interface CreateDatasetResponse extends NodeHttpResponse {
    data: DatasetName;
}