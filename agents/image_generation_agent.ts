import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });

export async function imageGenerationAgent(funnelContext: any) {
  try {
    const prompt = `Create a professional, high-converting hero image for a landing page based on this offer: ${JSON.stringify(funnelContext.intent)}. The style should match these branding guidelines: ${JSON.stringify(funnelContext.branding)}. No text in the image.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: prompt,
          },
        ],
      },
    });

    let imageUrl = null;
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          imageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
          break;
        }
      }
    }

    return {
      success: true,
      data: {
        imageUrl,
        prompt
      }
    };
  } catch (error) {
    console.error("Image generation failed:", error);
    return {
      success: false,
      error: String(error)
    };
  }
}
