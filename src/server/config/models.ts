export interface Model {
  id: string;
  name: string;
}

export const availableModels: Model[] = [
  {
    id: 'gemini-2.0-flash',
    name: 'gemini-2.0-flash',
  },
  {
    id: 'gemini-2.0-flash-preview-image-generation',
    name: 'gemini-2.0-flash-preview-image-generation'
  }
]; 