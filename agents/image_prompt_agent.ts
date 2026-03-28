import { GoogleGenAI } from "@google/genai";
import { parseJsonResponse } from "@/lib/json-utils";

const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY || "" });

export async function imagePromptAgent(funnelData: any) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Tu es ImagePromptAgent. Ta mission est de générer des prompts précis pour des images de haute qualité qui seront utilisées dans le tunnel de vente.

Voici les données du tunnel: ${JSON.stringify(funnelData)}.

Génère des prompts pour les images suivantes:
1. HERO_IMAGE: Image principale qui capture l'attention et illustre le résultat désiré.
2. PRODUCT_MOCKUP: Image montrant le produit ou service (si applicable).
3. TESTIMONIAL_AVATARS: Prompts pour des visages de clients satisfaits (diversité, réalisme).
4. BONUS_IMAGES: Prompts pour illustrer les bonus.
5. ABOUT_IMAGE: Image de l'expert ou de l'équipe (professionnel, inspirant).

Réponds uniquement en JSON valide selon ce contrat:
{
  "status": "success",
  "agent": "ImagePromptAgent",
  "data": {
    "hero_image": { "prompt": "string", "style": "string", "aspect_ratio": "string" },
    "product_mockup": { "prompt": "string", "style": "string" },
    "testimonial_avatars": [{ "prompt": "string" }],
    "bonus_images": [{ "prompt": "string" }],
    "about_image": { "prompt": "string", "style": "string" }
  }
}
`,
    config: {
      responseMimeType: "application/json"
    }
  });

  return parseJsonResponse(response.text);
}
