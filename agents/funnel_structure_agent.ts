import { GoogleGenAI } from "@google/genai";
import { parseJsonResponse } from "@/lib/json-utils";

const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY || "" });

export async function funnelStructureAgent(offerIntent: any) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Tu es FunnelStructureAgent.
Tu reçois l'intention commerciale suivante: ${JSON.stringify(offerIntent)}.
Applique la logique du document Funnel Designer:
1. 3 points of focus,
2. une seule direction vers l’offre,
3. hiérarchie claire,
4. ordre narratif cohérent.
Propose la structure la plus convertible.
Réponds uniquement en JSON valide selon le contrat fourni.

Contrat JSON:
{
  "status": "success",
  "agent": "FunnelStructureAgent",
  "task_id": "funnel_structure_01",
  "confidence": 0.9,
  "summary": "Architecture du tunnel définie",
  "data": {
    "funnel_goal": "string",
    "page_model": "single_page|multi_step",
    "sections": ["hero", "proof", "problem", "benefits", "offer", "faq", "cta_final"],
    "section_objectives": { "hero": "string" },
    "cta_path": ["string"],
    "focus_hierarchy": {
      "main": "string",
      "secondary": "string",
      "tertiary": "string"
    }
  },
  "issues": [],
  "next_actions": []
}
`,
  });

  return parseJsonResponse(response.text);
}
