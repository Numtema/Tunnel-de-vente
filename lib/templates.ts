
export interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  thumbnail: string;
  config: {
    branding: {
      primaryColor: string;
      secondaryColor: string;
      backgroundColor: string;
      textColor: string;
      accentColor: string;
      fontHeadlines: string;
      fontBody: string;
    };
    copywritingTone: string;
    suggestedStructure: string[];
  };
}

export const TEMPLATES: Template[] = [
  {
    id: 'fitness-master',
    name: 'Fitness Master',
    description: 'Design sombre et agressif avec accents néon. Parfait pour le coaching sportif et la vente de programmes de transformation.',
    category: 'Sport & Santé',
    thumbnail: 'https://images.leadconnectorhq.com/image/f_webp/q_80/r_1200/u_https://assets.cdn.filesafe.space/c3cmUrbBhdgs54adfIYP/media/644eaedbd4bd9b7bd5713254.jpeg',
    config: {
      branding: {
        primaryColor: '#DBFF00',
        secondaryColor: '#1B1B1B',
        backgroundColor: '#1B1B1B',
        textColor: '#FFFFFF',
        accentColor: '#DBFF00',
        fontHeadlines: 'Black Ops One',
        fontBody: 'Plus Jakarta Sans'
      },
      copywritingTone: 'Direct, motivant, autoritaire et axé sur les résultats.',
      suggestedStructure: ['Hero', 'Value Proposition', 'Pain Points', 'Offer Segmentation', 'Final CTA']
    }
  },
  {
    id: 'saas-modern',
    name: 'SaaS Clean',
    description: 'Interface épurée, professionnelle et technologique. Idéal pour les logiciels et les services B2B.',
    category: 'Business',
    thumbnail: 'https://images.leadconnectorhq.com/image/f_webp/q_80/r_1200/u_https://assets.cdn.filesafe.space/c3cmUrbBhdgs54adfIYP/media/643800f4a2d73ecce3536932.jpeg',
    config: {
      branding: {
        primaryColor: '#205CFF', // Extrait de --color-lgf0wsud
        secondaryColor: '#F1F9FF', // Extrait de --color-lg5sh5ww
        backgroundColor: '#ffffff', // Fond principal
        textColor: '#152741', // Extrait de --color-lg5r95dz
        accentColor: '#ADE5FF', // Extrait de --color-lgf94dg4
        fontHeadlines: 'Plus Jakarta Sans',
        fontBody: 'Plus Jakarta Sans'
      },
      copywritingTone: 'Professionnel, clair, axé sur les bénéfices et la simplicité.',
      suggestedStructure: ['Hero', 'Features Grid', 'Social Proof', 'Pricing', 'FAQ']
    }
  },
  {
    id: 'chf-homepage',
    name: 'Homepage Funnel (CHF)',
    description: 'Template de type Homepage Funnel, structuré pour la conversion avec de multiples sections claires et un design moderne.',
    category: 'Général',
    thumbnail: 'https://images.leadconnectorhq.com/image/f_webp/q_80/r_1200/u_https://assets.cdn.filesafe.space/c3cmUrbBhdgs54adfIYP/media/643800f4a2d73ecce3536932.jpeg',
    config: {
      branding: {
        primaryColor: '#205CFF', // Extrait de --color-lgf0wsud
        secondaryColor: '#0E182C', // Extrait de --color-lgf1duy4
        backgroundColor: '#ffffff', // Fond principal
        textColor: '#152741', // Extrait de --color-lg5r95dz
        accentColor: '#0044ff', // Extrait de --color-lg5rrtfu
        fontHeadlines: 'Plus Jakarta Sans',
        fontBody: 'Plus Jakarta Sans'
      },
      copywritingTone: 'Professionnel, engageant, structuré et orienté vers l\'action.',
      suggestedStructure: ['Hero', 'Social Proof', 'Problem/Agitation', 'Solution/Offer', 'Testimonials', 'Pricing/Options', 'About Us', 'Footer']
    }
  },
  {
    id: 'portfolio-master',
    name: 'Portfolio Funnel',
    description: 'Template orienté Portfolio, idéal pour présenter des études de cas, des témoignages et des offres de services.',
    category: 'Agence & Freelance',
    thumbnail: 'https://images.leadconnectorhq.com/image/f_webp/q_80/r_1200/u_https://assets.cdn.filesafe.space/c3cmUrbBhdgs54adfIYP/media/643800f4a2d73ecce3536932.jpeg',
    config: {
      branding: {
        primaryColor: '#205CFF', // Extrait de --color-lgf0wsud
        secondaryColor: '#0E182C', // Extrait de --color-lgf1duy4
        backgroundColor: '#ffffff', // Fond principal
        textColor: '#152741', // Extrait de --color-lg5r95dz
        accentColor: '#0044ff', // Extrait de --color-lg5rrtfu
        fontHeadlines: 'Plus Jakarta Sans',
        fontBody: 'Plus Jakarta Sans'
      },
      copywritingTone: 'Créatif, rassurant, axé sur les résultats et la preuve sociale.',
      suggestedStructure: ['Hero', 'About Us', 'Case Studies', 'Testimonials', 'Services/Offers', 'FAQ', 'Final CTA']
    }
  },
  {
    id: 'lead-funnel-master',
    name: 'Lead Funnel (Optin)',
    description: 'Template d\'Optin Page ultra-optimisé pour la capture de leads. Design direct et focalisé sur l\'action.',
    category: 'Génération de Leads',
    thumbnail: 'https://images.leadconnectorhq.com/image/f_webp/q_80/r_1200/u_https://assets.cdn.filesafe.space/c3cmUrbBhdgs54adfIYP/media/64380887a7983a65ebeebce0.jpeg',
    config: {
      branding: {
        primaryColor: '#e93d3d', // Extrait de --red (utilisé pour les boutons)
        secondaryColor: '#F1F9FF', // Extrait de --color-lg5sh5ww (fond secondaire)
        backgroundColor: '#ffffff', // Fond principal
        textColor: '#152741', // Extrait de --color-lg5r95dz
        accentColor: '#0044ff', // Extrait de --color-lg5rrtfu
        fontHeadlines: 'Plus Jakarta Sans',
        fontBody: 'Plus Jakarta Sans'
      },
      copywritingTone: 'Direct, persuasif, urgent et axé sur la valeur immédiate.',
      suggestedStructure: ['Hero Optin', 'Problem/Agitation', 'Solution/Benefits', 'Testimonials', 'Final Optin CTA']
    }
  },
  {
    id: 'business-event-master',
    name: 'Business Event Funnel',
    description: 'Template sombre et élégant, conçu spécifiquement pour la promotion d\'événements, de webinaires ou de conférences.',
    category: 'Événementiel',
    thumbnail: 'https://images.leadconnectorhq.com/image/f_webp/q_80/r_1200/u_https://assets.cdn.filesafe.space/c3cmUrbBhdgs54adfIYP/media/64388b2cb0dbb0e56b353cf5.png',
    config: {
      branding: {
        primaryColor: '#205CFF', // Extrait de --color-lgf0wsud (Boutons)
        secondaryColor: '#0E182C', // Extrait de --color-lgf1duy4 (Fonds de sections)
        backgroundColor: '#000000', // Fond principal (Dark mode)
        textColor: '#ffffff', // Texte clair sur fond sombre
        accentColor: '#ADE5FF', // Extrait de --color-lgf94dg4 (Accents)
        fontHeadlines: 'Barlow',
        fontBody: 'Barlow'
      },
      copywritingTone: 'Exclusif, professionnel, urgent et orienté networking.',
      suggestedStructure: ['Event Hero', 'Event Details (What/When/Where)', 'Speakers/Hosts', 'What You Will Learn', 'Testimonials', 'Pricing/Tickets', 'FAQ', 'Final CTA']
    }
  },
  {
    id: 'course-funnel-master',
    name: 'Course Funnel',
    description: 'Template pédagogique et structuré, idéal pour vendre des formations en ligne, des cours ou des programmes de coaching.',
    category: 'Éducation & Formation',
    thumbnail: 'https://images.leadconnectorhq.com/image/f_webp/q_80/r_1200/u_https://assets.cdn.filesafe.space/c3cmUrbBhdgs54adfIYP/media/6438079ba7983a363ceebc71.png',
    config: {
      branding: {
        primaryColor: '#205CFF', // Extrait de --color-lgf0wsud (Boutons)
        secondaryColor: '#F1F9FF', // Extrait de --color-lg5sh5ww (Fond secondaire)
        backgroundColor: '#ffffff', // Fond principal
        textColor: '#152741', // Extrait de --color-lg5r95dz
        accentColor: '#0044ff', // Extrait de --color-lg5rrtfu
        fontHeadlines: 'Plus Jakarta Sans',
        fontBody: 'Plus Jakarta Sans'
      },
      copywritingTone: 'Pédagogique, inspirant, structuré et rassurant.',
      suggestedStructure: ['Hero', 'Problem/Agitation', 'Course Modules', 'Testimonials', 'About Instructor', 'Pricing/Enrollment', 'FAQ', 'Final CTA']
    }
  },
  {
    id: 'webinar-vsl-master',
    name: 'Webinar/VSL Funnel',
    description: 'Template focalisé sur la conversion vidéo. Idéal pour les webinaires, les VSL (Video Sales Letters) et les présentations de haute valeur.',
    category: 'Webinaire & VSL',
    thumbnail: 'https://images.leadconnectorhq.com/image/f_webp/q_80/r_1200/u_https://assets.cdn.filesafe.space/c3cmUrbBhdgs54adfIYP/media/64380887a7983a65ebeebce0.jpeg',
    config: {
      branding: {
        primaryColor: '#205CFF', // Extrait de --color-lgf0wsud (Boutons)
        secondaryColor: '#F1F9FF', // Extrait de --color-lg5sh5ww (Fond secondaire)
        backgroundColor: '#ffffff', // Fond principal
        textColor: '#152741', // Extrait de --color-lg5r95dz
        accentColor: '#0044ff', // Extrait de --color-lg5rrtfu
        fontHeadlines: 'Plus Jakarta Sans',
        fontBody: 'Plus Jakarta Sans'
      },
      copywritingTone: 'Urgent, persuasif, axé sur la rareté et l\'autorité.',
      suggestedStructure: ['Hero Video/VSL', 'Problem/Agitation', 'Solution/Presentation', 'Testimonials', 'Pricing/Call to Action', 'FAQ', 'Final CTA']
    }
  }
];
