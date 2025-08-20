export interface ChangeClothesRequest {
  modelImg: string; // URL only
  garmentImg: string; // URL only
  category: 'upper_body' | 'lower_body' | 'dresses';
  garmentDesc?: string;
}

export interface ChangeClothesResponse {
  resultImgUrl: string | null;
  maskImgUrl: string | null;
  error: string | null;
}

export interface ImageUploadState {
  file: File | null;
  preview: string | null;
  isDragging: boolean;
}

export interface AppState {
  apiKey: string;
  modelImage: ImageUploadState;
  garmentImage: ImageUploadState;
  category: 'upper_body' | 'lower_body' | 'dresses';
  garmentDesc: string;
  isLoading: boolean;
  results: ChangeClothesResponse | null;
  error: string | null;
}
