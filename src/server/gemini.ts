import { GoogleGenAI } from '@google/genai';

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not defined in .env.local");
}

export const gemini = new GoogleGenAI({ apiKey });

type GeminiResponse = 
  | { type: 'text'; text: string }
  | { type: 'image'; mimeType: string; base64Data: string }
  | { type: 'multimodal'; text: string; mimeType: string; base64Data: string };

export async function askGemini(prompt: string, modelId: string): Promise<GeminiResponse> {
  const result = await gemini.models.generateContent({
    model: modelId,
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }]
      }
    ],
    config: {
      responseModalities: ['Image', 'Text']
    }
  });

  const parts = result?.candidates?.[0]?.content?.parts;

  if (!parts || parts.length === 0) {
    return { type: "text", text: "No response from Gemini." };
  }

  // Check if we have both text and image
  const textPart = parts.find((p: any) => p.text);
  const imagePart = parts.find((p: any) => p.inlineData);

  if (textPart && imagePart?.inlineData?.mimeType?.startsWith("image")) {
    return {
      type: "multimodal",
      text: textPart.text || '',
      mimeType: imagePart.inlineData.mimeType,
      base64Data: imagePart.inlineData.data || ''
    };
  }

  // If we have an image
  if (imagePart?.inlineData?.mimeType?.startsWith("image")) {
    return {
      type: "image",
      mimeType: imagePart.inlineData.mimeType,
      base64Data: imagePart.inlineData.data || ''
    };
  }

  // If we have text
  if (textPart?.text) {
    return {
      type: "text",
      text: textPart.text
    };
  }

  return { type: "text", text: "No valid response from Gemini." };
}
