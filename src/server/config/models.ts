export interface Model {
  id: string;
  name: string;
}

export const availableModels: Model[] = [
  {
    id: 'gemini-pro',
    name: 'Gemini Pro',
  },
  {
    id: 'gemini-pro-vision',
    name: 'Gemini Pro Vision'
  }
]; 