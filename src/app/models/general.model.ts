export interface NodeHttpResponse {
    success: boolean;
    message: string;
    data?: any;
}

export interface Yolov5Rect extends fabric.Rect {
    id?: number | string;
    class?: string;    
}