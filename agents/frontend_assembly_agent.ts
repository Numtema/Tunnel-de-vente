import { GoogleGenAI } from "@google/genai";
import { parseJsonResponse } from "@/lib/json-utils";

const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY || "" });

export async function frontendAssemblyAgent(data: any) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Tu es FrontendAssemblyAgent.
Tu assembles un tunnel complet en HTML/CSS/JS vanilla basé sur les données suivantes: ${JSON.stringify(data)}.
Respecte strictement les 7 principes de conversion:
1. Layout (Section, Row, Column)
2. Size (H1/92px, H2/56px, Body/26px, Para/24px)
3. White Space (Padding 20/30/50px, Margin 30/50px)
4. Contrast (Light/Dark Theme, Congruency)
5. Direction (Arrows, graphics)
6. Numbers (Data & stats)
7. Interaction (Animations, hover effects)
Ainsi que:
8. CA.DA.CA. (Capture, Direct, Convert, Attention)
9. Consistent Hierarchy & Branding
10. Responsive et code propre.
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
