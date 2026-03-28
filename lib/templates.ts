
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
    thumbnail: 'https://picsum.photos/seed/saas/400/300',
    config: {
      branding: {
        primaryColor: '#3b82f6',
        secondaryColor: '#f8fafc',
        backgroundColor: '#ffffff',
        textColor: '#1e293b',
        accentColor: '#6366f1',
        fontHeadlines: 'Inter',
        fontBody: 'Inter'
      },
      copywritingTone: 'Professionnel, clair, axé sur les bénéfices et la simplicité.',
      suggestedStructure: ['Hero', 'Features Grid', 'Social Proof', 'Pricing', 'FAQ']
    }
  }
];
