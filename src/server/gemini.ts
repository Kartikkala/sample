import { gemini } from "@/lib/gemini";

export async function askGemini(prompt: string, modelId: string) {
    const result = await gemini.models.generateContent({ model: modelId,
        contents: prompt,
     });
  
    const response = (await result).text;
    return response;
}