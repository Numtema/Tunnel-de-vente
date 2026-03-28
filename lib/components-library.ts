
export interface ComponentDefinition {
  id: string;
  name: string;
  category: 'hero' | 'features' | 'social-proof' | 'pricing' | 'faq' | 'footer' | 'cta';
  html: string;
  css?: string;
  description: string;
}

export const MARCEL_COMPONENT_LIBRARY: ComponentDefinition[] = [
  {
    id: 'hero-split-modern',
    name: 'Hero Split Modern',
    category: 'hero',
    description: 'Hero section with text on left and image on right. High conversion layout.',
    html: `
<section class="hero-section py-24 px-6">
  <div class="container mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
    <div class="hero-content space-y-6">
      <span class="preheadline uppercase tracking-widest font-bold text-primary">Limited Time Offer</span>
      <h1 class="text-6xl md:text-7xl font-black leading-tight">Transform Your Life Today</h1>
      <p class="text-xl opacity-80">The ultimate solution for high-performers looking to scale their results without burning out.</p>
      <div class="cta-wrapper pt-4">
        <a href="#offer" class="cta-button inline-block bg-primary text-background px-10 py-4 rounded-full font-black tracking-tighter hover:scale-105 transition-transform">GET STARTED NOW</a>
      </div>
    </div>
    <div class="hero-image-container relative">
      <img src="[heroImage]" alt="Hero Image" class="rounded-3xl shadow-2xl border-4 border-white/10">
    </div>
  </div>
</section>
    `
  },
  {
    id: 'social-proof-logos',
    name: 'Trust Logos Bar',
    category: 'social-proof',
    description: 'A clean bar of logos to build immediate authority.',
    html: `
<section class="logos-section py-12 bg-black/5 border-y border-black/10">
  <div class="container mx-auto px-6 text-center">
    <p class="text-xs uppercase tracking-widest font-bold opacity-40 mb-8">As seen on</p>
    <div class="flex flex-wrap justify-center items-center gap-12 grayscale opacity-50">
      <div class="logo-placeholder h-8 w-32 bg-gray-400 rounded"></div>
      <div class="logo-placeholder h-8 w-32 bg-gray-400 rounded"></div>
      <div class="logo-placeholder h-8 w-32 bg-gray-400 rounded"></div>
      <div class="logo-placeholder h-8 w-32 bg-gray-400 rounded"></div>
    </div>
  </div>
</section>
    `
  }
];
