import { GoogleGenAI } from "@google/genai";
import { parseJsonResponse } from "@/lib/json-utils";

const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY || "" });

export async function frontendAssemblyAgent(data: any) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Tu es FrontendAssemblyAgent, un expert en Funnel Design et conversion.
Tu assembles un tunnel de vente complet et ultra-convertible en HTML/CSS/JS vanilla basé sur ces données: ${JSON.stringify(data)}.

DIRECTIVES CRITIQUES DE DESIGN (Gusten Sun Method):
1. STRUCTURE DE PAGE (15 ÉTAPES OBLIGATOIRES):
   - Utilise les données de 'copy' pour remplir chaque section.
   - Suis l'ordre: Header, Hero, Social Proof 1, Logos, Problem, Solution, How it Works, Differentiation, The Offer, Bonuses, Testimonials, Guarantee, About, Scarcity, FAQ, Footer.

2. LAYOUT & HIERARCHY:
   - Utilise une structure Section > Container > Grid/Flex.
   - Respecte la hiérarchie visuelle Consistent Branding & Hierarchy.
   - Applique CA.DA.CA (Capture, Direct, Convert, Attention) dans l'ordre des sections.

3. TYPOGRAPHY & SIZE (Tokens stricts):
   - H1: 92px (Mobile: 60px), font-weight: 900, letter-spacing: -0.02em.
   - H2: 56px (Mobile: 40px), font-weight: 700.
   - Body Text: 26px.
   - Paragraphs: 24px.
   - Preheadline: Uppercase, spacing 0.1em, color: primary.

4. SPACING & WHITE SPACE:
   - Section Padding: 120px (Top/Bottom).
   - Container Max-width: 1200px (Standard) ou 900px (Narrow).
   - "Give your design space to breath": Utilise des marges généreuses (30px, 50px).

5. IMAGES & VISUALS:
   - Utilise les prompts de 'imagePrompts' pour insérer des placeholders d'images descriptifs (ex: <div class="image-placeholder" data-prompt="...">).
   - Utilise des icônes Lucide ou FontAwesome si nécessaire.

6. CONTRAST & BRANDING:
   - Applique le thème (Light/Dark/Hybrid) défini dans les tokens.
   - Utilise la couleur primaire pour les CTA et les accents importants.
   - Ajoute de la profondeur avec des ombres subtiles et des calques (layers).

7. DIRECTION & INTERACTION:
   - Utilise des éléments visuels (flèches, regards) pour guider vers le CTA.
   - Ajoute des interactions JS: Reveal au scroll (IntersectionObserver), Tilt effect sur les cartes, animations de pulse sur les boutons principaux.

LIVRABLES:
- index_html: Structure sémantique complète avec TOUTES les 15 étapes.
- styles_css: CSS moderne avec variables :root.
- script_js: Interactions fluides et performantes.

Réponds uniquement en JSON valide selon ce contrat:
{
  "status": "success",
  "agent": "FrontendAssemblyAgent",
  "task_id": "frontend_assembly_01",
  "confidence": 0.95,
  "summary": "Tunnel de vente complet assemblé avec 15 étapes de conversion",
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
    config: {
      responseMimeType: "application/json",
      maxOutputTokens: 8192
    }
  });

  return parseJsonResponse(response.text);
}
