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
          >
            <div className="flex gap-4 mb-4">
              <button onClick={() => setPreview(result.frontend.data)} className="bg-blue-600 text-white px-4 py-2 rounded-full">Prévisualiser</button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(result).map(([key, val]) => (
                <div key={key} className="bg-gray-200 p-4 rounded-xl overflow-auto text-sm">
                  <h3 className="font-bold mb-2 capitalize">{key}</h3>
                  <pre>{JSON.stringify(val, null, 2)}</pre>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>

      <AnimatePresence>
        {preview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
          >
            <div className="bg-white p-8 rounded-3xl max-w-4xl w-full max-h-[80vh] overflow-auto">
              <h2 className="text-2xl font-bold mb-4">Prévisualisation</h2>
              <div className="flex gap-2 mb-4">
                <button onClick={() => downloadFile('index.html', preview.index_html)} className="bg-green-600 text-white px-4 py-2 rounded">Download HTML</button>
                <button onClick={() => downloadFile('styles.css', preview.styles_css)} className="bg-green-600 text-white px-4 py-2 rounded">Download CSS</button>
                <button onClick={() => downloadFile('script.js', preview.script_js)} className="bg-green-600 text-white px-4 py-2 rounded">Download JS</button>
                <button onClick={() => setPreview(null)} className="bg-red-600 text-white px-4 py-2 rounded">Fermer</button>
              </div>
              <pre className="bg-gray-100 p-4 rounded text-xs">{preview.index_html}</pre>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
