'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { offerIntentAgent } from '@/agents/offer_intent_agent';
import { funnelStructureAgent } from '@/agents/funnel_structure_agent';
import { headlineCopyAgent } from '@/agents/headline_copy_agent';
import { layoutHierarchyAgent } from '@/agents/layout_hierarchy_agent';
import { spacingRhythmAgent } from '@/agents/spacing_rhythm_agent';
import { brandContrastAgent } from '@/agents/brand_contrast_agent';
import { imageDirectionAgent } from '@/agents/image_direction_agent';
import { proofNumbersAgent } from '@/agents/proof_numbers_agent';
import { interactionMotionAgent } from '@/agents/interaction_motion_agent';
import { frontendAssemblyAgent } from '@/agents/frontend_assembly_agent';

export default function Page() {
  const [request, setRequest] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<any>(null);
  const [previewMode, setPreviewMode] = useState<'mobile' | 'desktop'>('desktop');
  const [previewTab, setPreviewTab] = useState<'visual' | 'code'>('visual');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const intentRes = await offerIntentAgent(request);
      const structureRes = await funnelStructureAgent(intentRes.data);
      const headlineRes = await headlineCopyAgent(structureRes.data);
      const layoutRes = await layoutHierarchyAgent(structureRes.data);
      const spacingRes = await spacingRhythmAgent(layoutRes.data);
      const brandRes = await brandContrastAgent(intentRes.data);
      const imageRes = await imageDirectionAgent(intentRes.data);
      const proofRes = await proofNumbersAgent(intentRes.data);
      const interactionRes = await interactionMotionAgent(layoutRes.data);
      const frontendRes = await frontendAssemblyAgent({
        intent: intentRes.data,
        structure: structureRes.data,
        headline: headlineRes.data,
        layout: layoutRes.data,
        spacing: spacingRes.data,
        branding: brandRes.data,
        images: imageRes.data,
        proof: proofRes.data,
        interaction: interactionRes.data
      });
      setResult({ 
        intent: intentRes, 
        structure: structureRes, 
        headline: headlineRes, 
        layout: layoutRes,
        spacing: spacingRes,
        branding: brandRes,
        images: imageRes,
        proof: proofRes,
        interaction: interactionRes,
        frontend: frontendRes
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const downloadFile = (filename: string, content: string) => {
    const element = document.createElement("a");
    const file = new Blob([content], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const getSrcDoc = () => {
    if (!preview) return '';
    return `
      <!DOCTYPE html>
      <html lang="fr">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>${preview.styles_css}</style>
        </head>
        <body>
          ${preview.index_html}
          <script>${preview.script_js}</script>
        </body>
      </html>
    `;
  };

  const openInNewTab = () => {
    if (!preview) return;
    const blob = new Blob([getSrcDoc()], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-[#F4F4F4] text-[#2C423F] p-8 rounded-3xl shadow-2xl max-w-7xl w-full"
      >
        <h1 className="text-4xl font-bold mb-4">Générateur de Tunnel de Vente</h1>
        <form onSubmit={handleSubmit} className="mb-6">
          <textarea
            className="w-full p-4 rounded-xl border border-gray-300 mb-4"
            placeholder="Décris ton offre..."
            value={request}
            onChange={(e) => setRequest(e.target.value)}
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="bg-[#D4A017] text-white px-6 py-3 rounded-full font-semibold hover:bg-opacity-90 transition"
            disabled={loading}
          >
            {loading ? 'Analyse...' : 'Analyser'}
          </motion.button>
        </form>
        
        {result && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mt-8 border-t border-gray-200 pt-8"
          >
            <div className="flex flex-col items-center justify-center gap-6 mb-12">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-green-600 mb-2">✨ Tunnel généré avec succès !</h2>
                <p className="text-gray-600 text-lg">Les 10 agents ont terminé leur travail d'analyse et de conception.</p>
              </div>
              <button 
                onClick={() => setPreview(result.frontend.data)} 
                className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-6 rounded-2xl text-2xl font-bold shadow-xl transition transform hover:scale-105 flex items-center gap-4"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                Ouvrir la Prévisualisation
              </button>
            </div>
            
            <details className="bg-gray-200 rounded-xl p-4">
              <summary className="font-bold text-gray-700 cursor-pointer text-lg">🛠️ Voir les données brutes des agents (Debug)</summary>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                {Object.entries(result).map(([key, val]) => (
                  <div key={key} className="bg-white p-4 rounded-xl overflow-auto text-xs border border-gray-300 h-64">
                    <h3 className="font-bold mb-2 capitalize text-gray-800">{key}</h3>
                    <pre className="text-gray-600">{JSON.stringify(val, null, 2)}</pre>
                  </div>
                ))}
              </div>
            </details>
          </motion.div>
        )}
      </motion.div>

      <AnimatePresence>
        {preview && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed inset-0 bg-white z-50 flex flex-col"
          >
            {/* Header / Topbar */}
            <div className="flex justify-between items-center p-4 border-b bg-gray-50 shadow-sm">
              <div className="flex items-center gap-6">
                <h2 className="text-2xl font-bold text-gray-800">Prévisualisation</h2>
                <div className="flex bg-gray-200 rounded-lg p-1">
                  <button 
                    onClick={() => setPreviewTab('visual')} 
                    className={`px-4 py-1.5 rounded-md transition font-medium ${previewTab === 'visual' ? 'bg-white shadow text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
                  >
                    Visuel
                  </button>
                  <button 
                    onClick={() => setPreviewTab('code')} 
                    className={`px-4 py-1.5 rounded-md transition font-medium ${previewTab === 'code' ? 'bg-white shadow text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
                  >
                    Code Source
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {previewTab === 'visual' && (
                  <div className="flex bg-gray-200 rounded-lg p-1 mr-4">
                    <button onClick={() => setPreviewMode('mobile')} className={`px-4 py-1.5 rounded-md font-medium transition ${previewMode === 'mobile' ? 'bg-gray-800 text-white shadow' : 'text-gray-600 hover:text-gray-900'}`}>Mobile</button>
                    <button onClick={() => setPreviewMode('desktop')} className={`px-4 py-1.5 rounded-md font-medium transition ${previewMode === 'desktop' ? 'bg-gray-800 text-white shadow' : 'text-gray-600 hover:text-gray-900'}`}>Desktop</button>
                  </div>
                )}
                <button onClick={openInNewTab} className="bg-blue-100 text-blue-700 hover:bg-blue-200 px-4 py-2 rounded-lg font-medium transition flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                  Plein écran
                </button>
                <button onClick={() => setPreview(null)} className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg font-medium transition">Fermer</button>
              </div>
            </div>
            
            {/* Actions Bar (Downloads) */}
            <div className="flex gap-3 p-3 bg-gray-100 border-b justify-center">
              <button onClick={() => downloadFile('index.html', preview.index_html)} className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-1.5 rounded-md text-sm font-medium transition shadow-sm">⬇️ index.html</button>
              <button onClick={() => downloadFile('styles.css', preview.styles_css)} className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-1.5 rounded-md text-sm font-medium transition shadow-sm">⬇️ styles.css</button>
              <button onClick={() => downloadFile('script.js', preview.script_js)} className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-1.5 rounded-md text-sm font-medium transition shadow-sm">⬇️ script.js</button>
            </div>

            {/* Content Area */}
            <div className="flex-1 min-h-0 bg-gray-300 flex justify-center overflow-hidden">
              {previewTab === 'visual' ? (
                <iframe 
                  srcDoc={getSrcDoc()} 
                  className={`transition-all duration-300 h-full bg-white shadow-2xl ${previewMode === 'mobile' ? 'w-[375px]' : 'w-full'}`}
                  title="Preview"
                />
              ) : (
                <div className="w-full h-full overflow-auto p-8 flex flex-col gap-8 bg-gray-50">
                  <div className="max-w-5xl mx-auto w-full">
                    <h3 className="font-bold text-xl mb-3 text-gray-800 flex items-center gap-2"><span>📄</span> HTML (index.html)</h3>
                    <pre className="bg-[#1E1E1E] text-[#D4D4D4] p-6 rounded-xl text-sm overflow-x-auto shadow-lg border border-gray-800 font-mono leading-relaxed">{preview.index_html}</pre>
                  </div>
                  <div className="max-w-5xl mx-auto w-full">
                    <h3 className="font-bold text-xl mb-3 text-gray-800 flex items-center gap-2"><span>🎨</span> CSS (styles.css)</h3>
                    <pre className="bg-[#1E1E1E] text-[#D4D4D4] p-6 rounded-xl text-sm overflow-x-auto shadow-lg border border-gray-800 font-mono leading-relaxed">{preview.styles_css}</pre>
                  </div>
                  <div className="max-w-5xl mx-auto w-full">
                    <h3 className="font-bold text-xl mb-3 text-gray-800 flex items-center gap-2"><span>⚡</span> JS (script.js)</h3>
                    <pre className="bg-[#1E1E1E] text-[#D4D4D4] p-6 rounded-xl text-sm overflow-x-auto shadow-lg border border-gray-800 font-mono leading-relaxed">{preview.script_js}</pre>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
