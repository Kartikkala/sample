import { gemini } from "@/lib/gemini";

export async function askGemini(prompt: string) {
    const result = await gemini.models.generateContent({ model: 'gemini-2.0-flash-001',
        contents: prompt,
     });
  
    const response = (await result).text;
    return response;
}