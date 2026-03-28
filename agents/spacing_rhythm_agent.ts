import { GoogleGenAI } from "@google/genai";
import { parseJsonResponse } from "@/lib/json-utils";

const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY || "" });

export async function spacingRhythmAgent(layoutSpec: any) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Tu es SpacingRhythmAgent.
Tu reçois la spécification de layout suivante: ${JSON.stringify(layoutSpec)}.
Tu appliques strictement les principes de conversion sur le White Space:
1. Padding (utiliser 20px, 30px, 50px)
2. Margin (utiliser 30px, 50px)
3. Line Height
4. Letter Spacing
5. Give your design space to "Breath"
Tu proposes des tokens cohérents et réalistes pour desktop + mobile.
Réponds uniquement en JSON valide selon le contrat fourni.

Contrat JSON:
{
  "status": "success",
  "agent": "SpacingRhythmAgent",
  "task_id": "spacing_rhythm_01",
  "confidence": 0.9,
  "summary": "Tokens de spacing et typo définis",
  "data": {
    "spacing_tokens": {
      "section_y": "number",
      "block_gap": "number",
      "card_padding": "number",
      "button_padding_x": "number",
      "button_padding_y": "number"
    },
    "typography_scale": {
      "h1": "number",
      "h2": "number",
      "body": "number",
      "small": "number",
      "line_height_body": "number",
      "line_height_heading": "number",
      "letter_spacing_caps": "number"
    }
  },
  "issues": [],
  "next_actions": []
}
`,
  });

  return parseJsonResponse(response.text);
}
