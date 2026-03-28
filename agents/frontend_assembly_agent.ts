import { GoogleGenAI } from "@google/genai";
import { parseJsonResponse } from "@/lib/json-utils";

const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY || "" });

export async function frontendAssemblyAgent(data: any) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Tu es FrontendAssemblyAgent.
Tu assembles un tunnel complet en HTML/CSS/JS vanilla basé sur les données suivantes: ${JSON.stringify(data)}.
Respecte strictement:
1. hiérarchie visuelle,
2. sections prévues,
3. CTA cohérents,
4. responsive,
5. accessibilité de base,
6. classes lisibles,
7. code propre et modulaire.
Retourne les trois fichiers en texte intégral dans le JSON.
Réponds uniquement en JSON valide selon le contrat fourni.

Contrat JSON:
{
  "status": "success",
  "agent": "FrontendAssemblyAgent",
  "task_id": "frontend_assembly_01",
  "confidence": 0.9,
  "summary": "Tunnel assemblé en HTML/CSS/JS",
  "data": {
    "index_html": "string",
    "styles_css": "string",
    "script_js": "string",
    "files": ["index.html", "styles.css", "script.js"]
  },
  "issues": [],
  "next_actions": []
}
`,
  });

  return parseJsonResponse(response.text);
}
