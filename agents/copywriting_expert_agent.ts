import { GoogleGenAI } from "@google/genai";
import { parseJsonResponse } from "@/lib/json-utils";

const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY || "" });

export async function copywritingExpertAgent(offerIntent: any) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Tu es CopywritingExpertAgent. Ta mission est de rédiger tout le contenu textuel du tunnel de vente en suivant une structure de conversion psychologique prouvée.

Voici l'intention commerciale: ${JSON.stringify(offerIntent)}.

STRUCTURE À SUIVRE IMPÉRATIVEMENT (15 ÉTAPES):
1. HEADER: Email de support.
2. HERO: Ce que c'est, Résultat désiré, Sentiment après résultat, Objection majeure traitée, CTA, Garantie.
3. SOCIAL PROOF 1: Un témoignage puissant "J'ai enfin obtenu [Résultat]".
4. LOGOS: Liste des types de clients ou médias.
5. PROBLEM: Agitation du problème, empathie ("je suis passé par là"), liste des points de douleur.
6. SOLUTION REVEAL: Pourquoi les anciennes méthodes échouent, présentation de la nouvelle voie, destination de rêve.
7. HOW IT WORKS: Le "Véhicule", Étape 1, 2, 3.
8. WHY WE ARE DIFFERENT: Comparaison "Ancienne Voie" (Négatif) vs "Nouvelle Voie" (Positif).
9. THE OFFER: Nom de l'offre, ce que c'est, empilement de valeur (Value Stack), Prix normal vs Prix spécial.
10. BONUSES: Liste de bonus irrésistibles avec description.
11. TESTIMONIALS: 4 témoignages variés avec résultats chiffrés.
12. RISK FREE: Garantie de 14 jours, explication du "Pourquoi on fait ça".
13. MEET THE TEAM: Histoire personnelle, lutte passée, découverte du processus, points d'autorité.
14. SCARCITY: Pourquoi agir maintenant (offre limitée, prix qui va monter).
15. FAQ: Questions sur l'audience, le contenu, le support, la garantie.

Réponds uniquement en JSON valide selon ce contrat:
{
  "status": "success",
  "agent": "CopywritingExpertAgent",
  "data": {
    "header": { "email": "string" },
    "hero": { "preheadline": "string", "headline": "string", "subheadline": "string", "cta": "string", "guarantee": "string" },
    "social_proof_hero": { "quote": "string", "author": "string" },
    "logos_section": { "title": "string", "items": ["string"] },
    "problem_section": { "headline": "string", "subheadline": "string", "empathy_text": "string", "pain_points": ["string"] },
    "solution_section": { "headline": "string", "old_way_fail": "string", "new_way_success": "string", "dream_destination": "string" },
    "how_it_works": { "vehicle_name": "string", "steps": [{ "title": "string", "description": "string" }] },
    "differentiation": { "old_way_list": ["string"], "new_way_list": ["string"] },
    "main_offer": { "name": "string", "description": "string", "value_stack": ["string"], "normal_price": "string", "special_price": "string" },
    "bonuses": [{ "title": "string", "description": "string" }],
    "testimonials": [{ "headline": "string", "text": "string", "author": "string" }],
    "guarantee_section": { "headline": "string", "text": "string" },
    "about_section": { "name": "string", "story": "string", "achievements": ["string"] },
    "scarcity_section": { "headline": "string", "text": "string" },
    "faq": [{ "question": "string", "answer": "string" }],
    "footer": { "copyright": "string" }
  }
}
`,
    config: {
      responseMimeType: "application/json",
      maxOutputTokens: 4096
    }
  });

  return parseJsonResponse(response.text);
}
