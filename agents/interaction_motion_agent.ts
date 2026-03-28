import { GoogleGenAI } from "@google/genai";
import { parseJsonResponse } from "@/lib/json-utils";

const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY || "" });

export async function interactionMotionAgent(layoutSpec: any) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Tu es InteractionMotionAgent.
Tu reçois la spécification de layout suivante: ${JSON.stringify(layoutSpec)}.
Applique le principe Interaction.
Ne propose que des interactions utiles à la conversion:
1. claires,
2. légères,
3. non distrayantes,
4. faciles à coder en JS vanilla.
Réponds uniquement en JSON valide selon le contrat fourni.

Contrat JSON:
{
  "status": "success",
  "agent": "InteractionMotionAgent",
  "task_id": "interaction_motion_01",
  "confidence": 0.9,
  "summary": "Interactions JS définies",
  "data": {
    "interactions": ["string"],
    "motion_rules": ["string"],
    "js_requirements": ["string"]
  },
  "issues": [],
  "next_actions": []
}
`,
  });

  return parseJsonResponse(response.text);
}
