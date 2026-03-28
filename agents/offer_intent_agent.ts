import { GoogleGenAI } from "@google/genai";
import { parseJsonResponse } from "@/lib/json-utils";

const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY || "" });

export async function offerIntentAgent(rawRequest: string) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Tu es OfferIntentAgent.
Tu reçois une demande utilisateur pour créer un tunnel de vente: "${rawRequest}".
Ta mission est de produire une compréhension business exploitable.
Tu dois:
identifier l’offre,
déduire le type de funnel,
identifier la cible probable,
formuler la promesse centrale,
lister les manques critiques,
ne jamais écrire de HTML.
Réponds uniquement en JSON valide selon le contrat fourni.

Contrat JSON:
{
  "status": "success",
  "agent": "OfferIntentAgent",
  "task_id": "offer_intent_01",
  "confidence": 0.9,
  "summary": "Analyse de l'intention commerciale",
    "data": {
      "product_name": "string",
      "price": "string",
      "offer_type": "string",
      "market_category": "string",
      "primary_goal": "lead|sale|booking|application|webinar",
      "suspected_audience": "string",
      "core_promise": "string",
      "cta_goal": "string",
      "funnel_type": "optin|sales_page|application|vsl|webinar",
      "missing_fields": ["string"]
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
