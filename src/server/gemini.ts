import { GoogleGenAI } from '@google/genai';
import { availableModels } from './config/models';

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not defined in .env.local");
}

export const gemini = new GoogleGenAI({ apiKey });

type GeminiResponse =
  | { type: 'text'; text: string }
  | { type: 'image'; mimeType: string; base64Data: string }
  | { type: 'multimodal'; text: string; mimeType: string; base64Data: string };

type GeminiPart =
  | { text: string }
  | { inlineData: { mimeType: string; data: string } };

// Type guards
function isTextPart(part: GeminiPart): part is { text: string } {
  return 'text' in part;
}

function isImagePart(part: GeminiPart): part is { inlineData: { mimeType: string; data: string } } {
  return 'inlineData' in part;
}

export async function generateChatTitle(prompt: string): Promise<string> {
  const result = await gemini.models.generateContent({
    model: availableModels[0].id,
    contents: [
      {
        role: "user",
        parts: [{ text: `Generate a sentence of 5 words for this message: "${prompt}"` }]
      }
    ]
  });

  const parts = result?.candidates?.[0]?.content?.parts as GeminiPart[] | undefined;
  const textPart = parts?.find(isTextPart);
  return textPart?.text?.trim() || "New Chat";
}

export async function askGemini(prompt: string, modelId: string): Promise<GeminiResponse> {
  const model = availableModels.find(m => m.id === modelId);
  if (!model) {
    throw new Error(`Model ${modelId} not found`);
  }

  const result = await gemini.models.generateContent({
    model: modelId,
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }]
      }
    ],
    config: {
      responseModalities: model.responseModalities
    }
  });

  const parts = result?.candidates?.[0]?.content?.parts as GeminiPart[] | undefined;

  if (!parts || parts.length === 0) {
    return { type: "text", text: "No response from Gemini." };
  }

  const textPart = parts.find(isTextPart);
  const imagePart = parts.find(isImagePart);

  if (textPart && imagePart?.inlineData?.mimeType?.startsWith("image")) {
    return {
      type: "multimodal",
      text: textPart.text || '',
      mimeType: imagePart.inlineData.mimeType,
      base64Data: imagePart.inlineData.data || ''
    };
  }

  if (imagePart?.inlineData?.mimeType?.startsWith("image")) {
    return {
      type: "image",
      mimeType: imagePart.inlineData.mimeType,
      base64Data: imagePart.inlineData.data || ''
    };
  }

  if (textPart?.text) {
    return {
      type: "text",
      text: textPart.text
    };
  }

  return { type: "text", text: "No valid response from Gemini." };
}
