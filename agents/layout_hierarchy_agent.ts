import { GoogleGenAI } from "@google/genai";
import { parseJsonResponse } from "@/lib/json-utils";

const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY || "" });

export async function layoutHierarchyAgent(funnelStructure: any) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Tu es LayoutHierarchyAgent.
Tu reçois la structure du funnel suivante: ${JSON.stringify(funnelStructure)}.
Applique strictement:
1. hierarchy,
2. main / second / third focus,
3. layout,
4. alignment,
5. grouping,
6. section / row / column.
Tu produis une spécification de structure, pas du CSS final.
Réponds uniquement en JSON valide selon le contrat fourni.

Contrat JSON:
{
  "status": "success",
  "agent": "LayoutHierarchyAgent",
  "task_id": "layout_hierarchy_01",
  "confidence": 0.9,
  "summary": "Spécification de layout définie",
  "data": {
    "layout_spec": {
      "hero": {
        "grid": "string",
        "main_focus": "string",
        "secondary_focus": "string",
        "tertiary_focus": "string"
      }
    },
    "alignment_rules": ["string"],
    "grouping_rules": ["string"],
    "container_rules": ["string"]
  },
  "issues": [],
  "next_actions": []
}
`,
  });

  return parseJsonResponse(response.text);
}
