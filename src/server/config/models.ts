export interface Model {
  id: string;
  name: string;
  responseModalities: ('Text' | 'Image')[];
}

export const availableModels: Model[] = [
  {
    id: 'gemini-2.0-flash',
    name: 'gemini-2.0-flash',
    responseModalities: ['Text']
  },
  {
    id: 'gemini-2.0-flash-preview-image-generation',
    name: 'gemini-2.0-flash-preview-image-generation',
    responseModalities: ['Text', 'Image']
  }
]; 