import { GoogleGenAI } from "@google/genai";
import { parseJsonResponse } from "@/lib/json-utils";

const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY || "" });

export async function brandContrastAgent(offerIntent: any) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Tu es BrandContrastAgent.
Tu reçois l'intention commerciale suivante: ${JSON.stringify(offerIntent)}.
Tu dois créer un système visuel cohérent.
Applique strictement les principes de conversion sur le Contraste et le Branding:
1. Contrast (Color contrast in branding, depth with shadows, layers etc)
2. Light & Dark Theme
3. Congruency
4. Consistent Branding
5. Consistent Hierarchy
Priorité à lisibilité, CTA, confiance.
Réponds uniquement en JSON valide selon le contrat fourni.

Contrat JSON:
{
  "status": "success",
  "agent": "BrandContrastAgent",
  "task_id": "brand_contrast_01",
  "confidence": 0.9,
  "summary": "Système de marque et contraste défini",
  "data": {
    "theme_mode": "light|dark|hybrid",
    "color_tokens": {
      "bg": "string",
      "surface": "string",
      "text": "string",
      "muted": "string",
      "primary": "string",
      "primary_text": "string",
      "accent": "string"
    },
    "contrast_rules": ["string"],
    "component_style_rules": ["string"]
  },
  "issues": [],
  "next_actions": []
}
`,
  });

  return parseJsonResponse(response.text);
}
