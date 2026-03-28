import { GoogleGenAI } from "@google/genai";
import { parseJsonResponse } from "@/lib/json-utils";

const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY || "" });

export async function imageDirectionAgent(offerIntent: any) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Tu es ImageDirectionAgent.
Tu reçois l'intention commerciale suivante: ${JSON.stringify(offerIntent)}.
Les images ne sont pas décoratives.
Applique strictement les principes de conversion sur la Direction:
1. Direction (Arrows, graphics and people guiding attention)
2. Renforcer la hiérarchie
3. Guider l’attention vers le CTA
4. Soutenir la crédibilité
5. Respecter la marque
Tu produis des briefs image et non les fichiers finaux.
Réponds uniquement en JSON valide selon le contrat fourni.

Contrat JSON:
{
  "status": "success",
  "agent": "ImageDirectionAgent",
  "task_id": "image_direction_01",
  "confidence": 0.9,
  "summary": "Brief visuel défini",
  "data": {
    "hero_visual_type": "mockup|person|dashboard|illustration|product_packshot",
    "visual_roles": [
      {
        "section": "string",
        "purpose": "string",
        "direction_goal": "string"
      }
    ],
    "image_prompts": ["string"],
    "asset_manifest": ["string"]
  },
  "issues": [],
  "next_actions": []
}
`,
    config: {
      responseMimeType: "application/json"
    }
  });

  return parseJsonResponse(response.text);
}
