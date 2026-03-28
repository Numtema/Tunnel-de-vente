import { GoogleGenAI } from "@google/genai";
import { parseJsonResponse } from "@/lib/json-utils";

const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY || "" });

export async function headlineCopyAgent(funnelStructure: any) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Tu es HeadlineCopyAgent.
Tu reçois la structure du funnel suivante: ${JSON.stringify(funnelStructure)}.
Le headline doit être orienté outcome.
Le subheadline doit clarifier sans diluer.
Le CTA doit être spécifique.
Évite les généralités.
Pas de jargon inutile.
Réponds uniquement en JSON valide selon le contrat fourni.

Contrat JSON:
{
  "status": "success",
  "agent": "HeadlineCopyAgent",
  "task_id": "headline_copy_01",
  "confidence": 0.9,
  "summary": "Copywriting du hero défini",
  "data": {
    "preheadline": "string",
    "headline": "string",
    "subheadline": "string",
    "primary_cta": "string",
    "secondary_cta": "string",
    "microcopy": {
      "trust_line": "string",
      "form_help": "string",
      "footer_note": "string"
    }
  },
  "issues": [],
  "next_actions": []
}
`,
  });

  return parseJsonResponse(response.text);
}
