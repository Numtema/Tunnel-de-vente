'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import JSZip from 'jszip';
import { Copy, Check, Maximize2, Minimize2, FileCode2, Download, ExternalLink, X, FileArchive, FileJson, Sparkles, LayoutDashboard, Rocket, FileText, Settings, Users, ArrowRight, Image as ImageIcon, Trash2 } from 'lucide-react';
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
import { imageGenerationAgent } from '@/agents/image_generation_agent';

interface Project {
  id: string;
  name: string;
  date: string;
  request: string;
  result: any;
  heroImage?: string;
}

const CodeBlock = ({ code, filename, language }: { code: string, filename: string, language: string }) => {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#3A4D4A] rounded-xl overflow-hidden border border-[#4A5D5A] shadow-lg flex flex-col w-full">
      <div className="flex justify-between items-center px-4 py-3 bg-[#2C3E3B] border-b border-[#4A5D5A]">
        <div className="flex items-center gap-2 text-gray-200 font-mono text-sm">
          <FileCode2 size={16} className="text-[#D4A017]" />
          {filename}
        </div>
        <button 
          onClick={handleCopy} 
          className="text-gray-300 hover:text-white transition-colors flex items-center gap-1.5 text-xs bg-[#3A4D4A] hover:bg-[#4A5D5A] px-3 py-1.5 rounded-full"
        >
          {copied ? <Check size={14} className="text-green-400"/> : <Copy size={14} />}
          {copied ? 'Copié !' : 'Copier'}
        </button>
      </div>
      <div className={`relative ${expanded ? '' : 'max-h-96'} overflow-hidden bg-[#2C3E3B]`}>
        <pre className="p-6 text-gray-300 font-mono text-base overflow-x-auto leading-relaxed">
          {code}
        </pre>
        {!expanded && (
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#2C3E3B] to-transparent pointer-events-none" />
        )}
      </div>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full py-3 bg-[#3A4D4A] hover:bg-[#4A5D5A] text-gray-300 hover:text-white transition-colors text-sm flex justify-center items-center gap-2 border-t border-[#4A5D5A] font-medium"
      >
        {expanded ? <><Minimize2 size={16}/> Réduire</> : <><Maximize2 size={16}/> Développer</>}
      </button>
    </div>
  );
};

export default function Page() {
  const [request, setRequest] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'input' | 'review' | 'generating' | 'result'>('input');
  const [parsedIntent, setParsedIntent] = useState<any>(null);
  const [preview, setPreview] = useState<any>(null);
  const [previewMode, setPreviewMode] = useState<'mobile' | 'desktop'>('desktop');
  const [previewTab, setPreviewTab] = useState<'visual' | 'code'>('visual');
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentView, setCurrentView] = useState<'generator' | 'tunnels'>('generator');
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  useEffect(() => {
    const savedProjects = localStorage.getItem('ai_funnel_projects');
    if (savedProjects) {
      try {
        setProjects(JSON.parse(savedProjects));
      } catch (e) {
        console.error("Failed to parse projects from localStorage", e);
      }
    }
  }, []);

  const saveProject = (newResult: any, req: string) => {
    const newProject: Project = {
      id: Date.now().toString(),
      name: req.substring(0, 30) + (req.length > 30 ? '...' : ''),
      date: new Date().toISOString(),
      request: req,
      result: newResult
    };
    
    const updatedProjects = [newProject, ...projects];
    setProjects(updatedProjects);
    localStorage.setItem('ai_funnel_projects', JSON.stringify(updatedProjects));
    setCurrentProjectId(newProject.id);
  };

  const deleteProject = (id: string) => {
    const updatedProjects = projects.filter(p => p.id !== id);
    setProjects(updatedProjects);
    localStorage.setItem('ai_funnel_projects', JSON.stringify(updatedProjects));
    if (currentProjectId === id) {
      setCurrentProjectId(null);
      setResult(null);
      setRequest('');
      setStep('input');
    }
  };

  const loadProject = (project: Project) => {
    setCurrentProjectId(project.id);
    setResult(project.result);
    setRequest(project.request);
    setStep('result');
    setCurrentView('generator');
  };

  const generateHeroImage = async () => {
    if (!result || !currentProjectId) return;
    
    setIsGeneratingImage(true);
    try {
      const res = await imageGenerationAgent(result);
      if (res.success && res.data?.imageUrl) {
        const updatedProjects = projects.map(p => {
          if (p.id === currentProjectId) {
            return { ...p, heroImage: res.data.imageUrl || undefined };
          }
          return p;
        });
        setProjects(updatedProjects);
        localStorage.setItem('ai_funnel_projects', JSON.stringify(updatedProjects));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const startNewProject = () => {
    setCurrentProjectId(null);
    setResult(null);
    setRequest('');
    setStep('input');
    setParsedIntent(null);
    setCurrentView('generator');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const intentRes = await offerIntentAgent(request);
      setParsedIntent(intentRes.data);
      setStep('review');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmIntent = async () => {
    setLoading(true);
    setStep('generating');
    try {
      const intentRes = { data: parsedIntent };
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
      const finalResult = { 
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
      };
      setResult(finalResult);
      setStep('result');
      if (!currentProjectId) {
        saveProject(finalResult, request);
      } else {
        // Update existing project
        const updatedProjects = projects.map(p => {
          if (p.id === currentProjectId) {
            return { ...p, result: finalResult, request };
          }
          return p;
        });
        setProjects(updatedProjects);
        localStorage.setItem('ai_funnel_projects', JSON.stringify(updatedProjects));
      }
    } catch (error) {
      console.error(error);
      setStep('review');
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

  const downloadCombinedHtml = () => {
    if (!preview) return;
    const combined = preview.index_html
      .replace('</head>', `<style>${preview.styles_css}</style></head>`)
      .replace('</body>', `<script>${preview.script_js}</script></body>`);
    downloadFile('funnel-combined.html', combined);
  };

  const downloadZip = async () => {
    if (!preview) return;
    const zip = new JSZip();
    zip.file("index.html", preview.index_html);
    zip.file("styles.css", preview.styles_css);
    zip.file("script.js", preview.script_js);
    
    const content = await zip.generateAsync({ type: "blob" });
    const element = document.createElement("a");
    element.href = URL.createObjectURL(content);
    element.download = "funnel-export.zip";
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
    <div className="flex h-screen bg-[#E5E9E8] font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-[#3A4D4A] text-white flex flex-col shadow-2xl z-10 rounded-tr-[3rem] rounded-br-[3rem] my-4 ml-4 overflow-hidden relative">
        <div className="p-8 flex flex-col items-center border-b border-[#4A5D5A]">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#D4A017] to-yellow-200 p-1 mb-4">
            <div className="w-full h-full bg-[#2C3E3B] rounded-full flex items-center justify-center">
              <Sparkles size={32} className="text-[#D4A017]" />
            </div>
          </div>
          <h2 className="font-bold tracking-widest text-sm text-center">AI FUNNEL</h2>
          <p className="text-xs text-gray-400 mt-1">STUDIO</p>
        </div>

        <nav className="flex-1 py-6">
          <ul className="space-y-2">
            <li>
              <a href="#" className="flex items-center gap-4 px-8 py-4 text-gray-300 hover:text-white hover:bg-[#4A5D5A] transition-colors">
                <LayoutDashboard size={20} />
                <span className="font-medium text-sm tracking-wide">DASHBOARD</span>
              </a>
            </li>
            <li className="relative">
              {currentView === 'generator' && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#D4A017] rounded-r-full"></div>}
              <button onClick={() => setCurrentView('generator')} className={`w-full flex items-center gap-4 px-8 py-4 transition-colors ${currentView === 'generator' ? 'bg-white text-[#3A4D4A] rounded-l-full ml-4 shadow-md' : 'text-gray-300 hover:text-white hover:bg-[#4A5D5A]'}`}>
                <Rocket size={20} className={currentView === 'generator' ? 'text-[#D4A017]' : ''} />
                <span className="font-bold text-sm tracking-wide">GÉNÉRATEUR</span>
              </button>
            </li>
            <li className="relative">
              {currentView === 'tunnels' && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#D4A017] rounded-r-full"></div>}
              <button onClick={() => setCurrentView('tunnels')} className={`w-full flex items-center gap-4 px-8 py-4 transition-colors ${currentView === 'tunnels' ? 'bg-white text-[#3A4D4A] rounded-l-full ml-4 shadow-md' : 'text-gray-300 hover:text-white hover:bg-[#4A5D5A]'}`}>
                <FileText size={20} className={currentView === 'tunnels' ? 'text-[#D4A017]' : ''} />
                <span className="font-bold text-sm tracking-wide">MES TUNNELS</span>
              </button>
            </li>
            <li>
              <a href="#" className="flex items-center gap-4 px-8 py-4 text-gray-300 hover:text-white hover:bg-[#4A5D5A] transition-colors">
                <Settings size={20} />
                <span className="font-medium text-sm tracking-wide">PARAMÈTRES</span>
              </a>
            </li>
          </ul>
        </nav>
        
        <div className="p-8 border-t border-[#4A5D5A]">
           <div className="flex items-center gap-4 text-gray-300 mb-4">
             <Users size={20} />
             <span className="font-medium text-sm tracking-wide">AGENTS ACTIFS</span>
           </div>
           <div className="flex -space-x-3">
             {[...Array(5)].map((_, i) => (
               <div key={i} className="w-10 h-10 rounded-full bg-[#2C3E3B] border-2 border-[#3A4D4A] flex items-center justify-center text-xs font-bold text-[#D4A017]">
                 A{i+1}
               </div>
             ))}
             <div className="w-10 h-10 rounded-full bg-[#D4A017] border-2 border-[#3A4D4A] flex items-center justify-center text-xs font-bold text-white z-10">
               +5
             </div>
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8 relative">
        <div className="max-w-7xl mx-auto">
          
          {/* Top Bar */}
          <div className="bg-white rounded-full px-8 py-4 flex items-center justify-between shadow-sm mb-8">
            <div className="flex items-center gap-4 text-[#3A4D4A] font-medium">
              <span className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full text-sm">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                Système Prêt
              </span>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-sm font-medium text-gray-500">10 Agents IA Synchronisés</div>
              <button className="bg-[#D4A017] text-white px-6 py-2 rounded-full text-sm font-bold shadow-md hover:bg-yellow-600 transition-colors">
                NOUVEAU PROJET
              </button>
            </div>
          </div>

          {currentView === 'generator' ? (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              
              {/* Left Column: Input Form */}
              <div className="xl:col-span-2 space-y-8">
                {step === 'input' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100"
                  >
                    <h1 className="text-3xl font-bold text-[#3A4D4A] mb-2">Décrivez votre offre</h1>
                    <p className="text-gray-500 mb-6">Laissez nos agents concevoir le tunnel parfait pour vous.</p>
                    
                    <form onSubmit={handleSubmit}>
                      <textarea
                        className="w-full p-6 rounded-2xl border-2 border-gray-100 bg-gray-50 focus:bg-white focus:border-[#D4A017] focus:ring-0 transition-all resize-none text-gray-700 text-lg min-h-[200px] mb-6"
                        placeholder="Ex: Je vends une formation en ligne sur le marketing digital pour les débutants à 497€..."
                        value={request}
                        onChange={(e) => setRequest(e.target.value)}
                        disabled={loading}
                      />
                      
                      <div className="flex justify-end">
                        <motion.button
                          whileHover={!loading ? { scale: 1.02 } : {}}
                          whileTap={!loading ? { scale: 0.98 } : {}}
                          type="submit"
                          className={`px-8 py-4 rounded-full font-bold text-base tracking-wide shadow-lg transition-all flex items-center gap-3 ${
                            loading 
                              ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none' 
                              : 'bg-[#D4A017] hover:bg-yellow-600 text-white'
                          }`}
                          disabled={loading || !request.trim()}
                        >
                          {loading ? 'ANALYSE EN COURS...' : 'ANALYSER L\'OFFRE'}
                          {!loading && <ArrowRight size={18} />}
                        </motion.button>
                      </div>
                    </form>
                  </motion.div>
                )}

                {step === 'review' && parsedIntent && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100"
                  >
                    <h1 className="text-3xl font-bold text-[#3A4D4A] mb-2">Vérification de l&apos;offre</h1>
                    <p className="text-gray-500 mb-6">Corrigez les informations ci-dessous avant de générer le tunnel pour éviter les hallucinations.</p>
                    
                    <div className="space-y-4 mb-8">
                      <div>
                        <label className="block text-sm font-bold text-[#3A4D4A] mb-1">Nom du Produit / Service</label>
                        <input 
                          type="text" 
                          className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#D4A017] focus:ring-0 transition-all"
                          value={parsedIntent.product_name || ''}
                          onChange={(e) => setParsedIntent({...parsedIntent, product_name: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-[#3A4D4A] mb-1">Prix</label>
                        <input 
                          type="text" 
                          className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#D4A017] focus:ring-0 transition-all"
                          value={parsedIntent.price || ''}
                          onChange={(e) => setParsedIntent({...parsedIntent, price: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-[#3A4D4A] mb-1">Audience Cible</label>
                        <input 
                          type="text" 
                          className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#D4A017] focus:ring-0 transition-all"
                          value={parsedIntent.suspected_audience || ''}
                          onChange={(e) => setParsedIntent({...parsedIntent, suspected_audience: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-[#3A4D4A] mb-1">Promesse Principale</label>
                        <textarea 
                          className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#D4A017] focus:ring-0 transition-all resize-none h-24"
                          value={parsedIntent.core_promise || ''}
                          onChange={(e) => setParsedIntent({...parsedIntent, core_promise: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <button
                        onClick={() => setStep('input')}
                        className="px-6 py-3 rounded-full font-bold text-sm text-gray-500 hover:bg-gray-100 transition-colors"
                      >
                        RETOUR
                      </button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleConfirmIntent}
                        className="px-8 py-4 rounded-full font-bold text-base tracking-wide shadow-lg transition-all flex items-center gap-3 bg-[#D4A017] hover:bg-yellow-600 text-white"
                      >
                        CONFIRMER ET GÉNÉRER LE TUNNEL
                        <ArrowRight size={18} />
                      </motion.button>
                    </div>
                  </motion.div>
                )}

                {/* K2000 Loading Animation */}
                <AnimatePresence>
                  {loading && step === 'generating' && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 w-full overflow-hidden"
                    >
                      <div className="flex justify-between text-xs font-bold text-[#3A4D4A] mb-2 uppercase tracking-widest">
                        <span>Synchronisation des agents</span>
                        <span className="text-[#D4A017]">En cours</span>
                      </div>
                      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden relative">
                        <motion.div
                          className="absolute top-0 bottom-0 w-1/4 bg-[#D4A017] rounded-full shadow-[0_0_10px_rgba(212,160,23,0.8)]"
                          animate={{ 
                            left: ["-25%", "100%", "-25%"] 
                          }}
                          transition={{ 
                            duration: 1.5, 
                            repeat: Infinity, 
                            ease: "linear" 
                          }}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Results Area */}
                {step === 'result' && result && !loading && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100"
                  >
                    <div className="flex items-center justify-between mb-8">
                      <div>
                        <h2 className="text-2xl font-bold text-[#3A4D4A]">Résultat Généré</h2>
                        <p className="text-gray-500 text-sm mt-1">Prêt pour la prévisualisation et l&apos;export.</p>
                      </div>
                      <div className="flex gap-4">
                        <button 
                          onClick={generateHeroImage} 
                          disabled={isGeneratingImage}
                          className="bg-gray-100 hover:bg-gray-200 text-[#3A4D4A] px-6 py-3 rounded-full text-sm font-bold shadow-sm transition-colors flex items-center gap-2 disabled:opacity-50"
                        >
                          <ImageIcon size={16} />
                          {isGeneratingImage ? 'GÉNÉRATION...' : 'GÉNÉRER IMAGE'}
                        </button>
                        <button 
                          onClick={() => setPreview(result.frontend.data)} 
                          className="bg-[#3A4D4A] hover:bg-[#2C3E3B] text-white px-6 py-3 rounded-full text-sm font-bold shadow-md transition-colors flex items-center gap-2"
                        >
                          <Maximize2 size={16} />
                          PRÉVISUALISER
                        </button>
                      </div>
                    </div>
                    
                    {projects.find(p => p.id === currentProjectId)?.heroImage && (
                      <div className="mb-8 rounded-2xl overflow-hidden border border-gray-200 shadow-sm relative h-96">
                        <Image src={projects.find(p => p.id === currentProjectId)?.heroImage as string} alt="Hero" fill className="object-cover" referrerPolicy="no-referrer" />
                      </div>
                    )}

                    <details className="group">
                      <summary className="flex items-center justify-between bg-gray-50 p-4 rounded-xl cursor-pointer list-none border border-gray-100 hover:bg-gray-100 transition-colors">
                        <div className="flex items-center gap-3 font-bold text-[#3A4D4A]">
                          <FileJson size={20} className="text-[#D4A017]" />
                          Données brutes des agents (Debug)
                        </div>
                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm group-open:rotate-180 transition-transform">
                          <ArrowRight size={16} className="text-gray-400 rotate-90" />
                        </div>
                      </summary>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        {Object.entries(result).map(([key, val]) => (
                          <div key={key} className="bg-[#3A4D4A] p-4 rounded-xl overflow-hidden border border-[#4A5D5A]">
                            <h3 className="font-bold mb-2 capitalize text-white text-xs tracking-wider flex items-center gap-2 border-b border-[#4A5D5A] pb-2">
                              <span className="w-2 h-2 rounded-full bg-[#D4A017]"></span>
                              {key}
                            </h3>
                            <div className="h-64 overflow-auto custom-scrollbar">
                              <pre className="text-gray-300 font-mono text-xs leading-relaxed">{JSON.stringify(val, null, 2)}</pre>
                            </div>
                          </div>
                        ))}
                      </div>
                    </details>
                  </motion.div>
                )}
              </div>

              {/* Right Column: Status / Info Panel */}
              <div className="space-y-8">
                <div className="bg-[#3A4D4A] rounded-[2rem] p-8 text-white shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4A017] rounded-full opacity-10 -mr-10 -mt-10 blur-2xl"></div>
                  <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#D4A017] rounded-full"></span>
                    STATUS DES AGENTS
                  </h3>
                  <div className="space-y-4 relative z-10">
                    {[
                      { name: 'Intent Analysis', status: step === 'review' || step === 'generating' || step === 'result' ? 'Terminé' : (loading && step === 'input' ? 'En cours' : 'En attente') },
                      { name: 'Funnel Structure', status: step === 'result' ? 'Terminé' : (loading && step === 'generating' ? 'En cours' : 'En attente') },
                      { name: 'Copywriting', status: step === 'result' ? 'Terminé' : (loading && step === 'generating' ? 'En cours' : 'En attente') },
                      { name: 'UI/UX Design', status: step === 'result' ? 'Terminé' : (loading && step === 'generating' ? 'En cours' : 'En attente') },
                      { name: 'Code Generation', status: step === 'result' ? 'Terminé' : (loading && step === 'generating' ? 'En cours' : 'En attente') },
                    ].map((agent, i) => (
                      <div key={i} className="flex items-center justify-between border-b border-[#4A5D5A] pb-2 last:border-0">
                        <span className="text-sm text-gray-300">{agent.name}</span>
                        <span className={`text-xs font-bold px-2 py-1 rounded-md ${
                          agent.status === 'Terminé' ? 'bg-green-500/20 text-green-400' :
                          agent.status === 'En cours' ? 'bg-[#D4A017]/20 text-[#D4A017] animate-pulse' :
                          'bg-gray-700 text-gray-400'
                        }`}>
                          {agent.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
                   <h3 className="text-lg font-bold text-[#3A4D4A] mb-4">Exportation</h3>
                   <p className="text-sm text-gray-500 mb-6">Une fois généré, vous pourrez exporter votre tunnel sous différents formats.</p>
                   <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                        <span className="text-sm font-medium text-gray-700">Fichiers Séparés</span>
                        <span className="text-xs font-bold text-gray-400">HTML/CSS/JS</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                        <span className="text-sm font-medium text-gray-700">Fichier Unique</span>
                        <span className="text-xs font-bold text-gray-400">.HTML</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                        <span className="text-sm font-medium text-gray-700">Archive Complète</span>
                        <span className="text-xs font-bold text-gray-400">.ZIP</span>
                      </div>
                   </div>
                </div>
              </div>

            </div>
          ) : (
            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-[#3A4D4A]">Mes Tunnels</h2>
                  <p className="text-gray-500 mt-2">Retrouvez tous vos projets générés et leurs artefacts.</p>
                </div>
                <button 
                  onClick={startNewProject}
                  className="bg-[#D4A017] text-white px-6 py-3 rounded-full text-sm font-bold shadow-md hover:bg-yellow-600 transition-colors flex items-center gap-2"
                >
                  <Rocket size={16} />
                  NOUVEAU PROJET
                </button>
              </div>

              {projects.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                  <FileArchive size={48} className="mx-auto text-gray-300 mb-4" />
                  <h3 className="text-xl font-bold text-gray-400">Aucun tunnel pour le moment</h3>
                  <p className="text-gray-500 mt-2">Générez votre premier tunnel pour le voir apparaître ici.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projects.map((project) => (
                    <div key={project.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col">
                      {project.heroImage ? (
                        <div className="h-40 overflow-hidden bg-gray-100 relative">
                          <Image src={project.heroImage} alt={project.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                        </div>
                      ) : (
                        <div className="h-40 bg-[#3A4D4A] flex items-center justify-center">
                          <LayoutDashboard size={48} className="text-[#4A5D5A]" />
                        </div>
                      )}
                      <div className="p-6 flex-1 flex flex-col">
                        <h3 className="font-bold text-lg text-[#3A4D4A] mb-2 line-clamp-1">{project.name}</h3>
                        <p className="text-xs text-gray-400 mb-4">{new Date(project.date).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                        <p className="text-sm text-gray-600 line-clamp-2 mb-6 flex-1">{project.request}</p>
                        <div className="flex items-center justify-between mt-auto">
                          <button 
                            onClick={() => loadProject(project)}
                            className="text-[#D4A017] font-bold text-sm hover:text-yellow-600 transition-colors flex items-center gap-1"
                          >
                            OUVRIR <ArrowRight size={14} />
                          </button>
                          <button 
                            onClick={() => deleteProject(project.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50"
                            title="Supprimer"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Preview Modal */}
      <AnimatePresence>
        {preview && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ type: "spring", bounce: 0, duration: 0.3 }}
            className="fixed inset-0 bg-[#3A4D4A]/95 backdrop-blur-md z-50 flex flex-col p-4 sm:p-8"
          >
            <div className="bg-[#E5E9E8] rounded-[2rem] w-full h-full flex flex-col overflow-hidden shadow-2xl border border-[#4A5D5A]">
              
              {/* Header */}
              <div className="bg-white px-8 py-4 flex justify-between items-center border-b border-gray-200">
                <div className="flex items-center gap-6">
                  <h2 className="text-2xl font-bold text-[#3A4D4A] flex items-center gap-2">
                    <LayoutDashboard size={24} className="text-[#D4A017]" />
                    Prévisualisation
                  </h2>
                  <div className="flex bg-gray-100 rounded-full p-1 border border-gray-200">
                    <button 
                      onClick={() => setPreviewTab('visual')} 
                      className={`px-6 py-2 rounded-full transition-all font-bold text-sm tracking-wide ${previewTab === 'visual' ? 'bg-white text-[#3A4D4A] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                      VISUEL
                    </button>
                    <button 
                      onClick={() => setPreviewTab('code')} 
                      className={`px-6 py-2 rounded-full transition-all font-bold text-sm tracking-wide ${previewTab === 'code' ? 'bg-white text-[#3A4D4A] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                      CODE SOURCE
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  {previewTab === 'visual' && (
                    <div className="flex bg-gray-100 rounded-full p-1 border border-gray-200 mr-4">
                      <button onClick={() => setPreviewMode('mobile')} className={`px-4 py-1.5 rounded-full font-bold text-xs tracking-wide transition-all ${previewMode === 'mobile' ? 'bg-[#3A4D4A] text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>MOBILE</button>
                      <button onClick={() => setPreviewMode('desktop')} className={`px-4 py-1.5 rounded-full font-bold text-xs tracking-wide transition-all ${previewMode === 'desktop' ? 'bg-[#3A4D4A] text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>DESKTOP</button>
                    </div>
                  )}
                  <button onClick={openInNewTab} className="text-gray-500 hover:text-[#3A4D4A] bg-gray-100 hover:bg-gray-200 px-5 py-2.5 rounded-full font-bold text-sm tracking-wide transition-colors flex items-center gap-2">
                    <ExternalLink size={16} />
                    OUVRIR
                  </button>
                  <button onClick={() => setPreview(null)} className="text-white bg-red-500 hover:bg-red-600 px-5 py-2.5 rounded-full font-bold text-sm tracking-wide transition-colors flex items-center gap-2 shadow-sm">
                    <X size={16} />
                    FERMER
                  </button>
                </div>
              </div>
              
              {/* Actions Bar */}
              <div className="flex gap-4 p-4 bg-white border-b border-gray-200 justify-center flex-wrap">
                <button onClick={() => downloadFile('index.html', preview.index_html)} className="bg-gray-50 hover:bg-gray-100 border border-gray-200 text-[#3A4D4A] px-6 py-2.5 rounded-full text-sm font-bold tracking-wide transition-colors flex items-center gap-2"><Download size={16}/> INDEX.HTML</button>
                <button onClick={() => downloadFile('styles.css', preview.styles_css)} className="bg-gray-50 hover:bg-gray-100 border border-gray-200 text-[#3A4D4A] px-6 py-2.5 rounded-full text-sm font-bold tracking-wide transition-colors flex items-center gap-2"><Download size={16}/> STYLES.CSS</button>
                <button onClick={() => downloadFile('script.js', preview.script_js)} className="bg-gray-50 hover:bg-gray-100 border border-gray-200 text-[#3A4D4A] px-6 py-2.5 rounded-full text-sm font-bold tracking-wide transition-colors flex items-center gap-2"><Download size={16}/> SCRIPT.JS</button>
                <div className="hidden sm:block w-px h-10 bg-gray-300 mx-2"></div>
                <button onClick={downloadCombinedHtml} className="bg-[#D4A017]/10 text-[#D4A017] border border-[#D4A017]/30 hover:bg-[#D4A017]/20 px-6 py-2.5 rounded-full text-sm font-bold tracking-wide transition-colors flex items-center gap-2"><FileCode2 size={16}/> HTML COMBINÉ</button>
                <button onClick={downloadZip} className="bg-[#3A4D4A] text-white hover:bg-[#2C3E3B] px-6 py-2.5 rounded-full text-sm font-bold tracking-wide transition-colors flex items-center gap-2 shadow-md"><FileArchive size={16}/> EXPORTER ZIP</button>
              </div>

              {/* Content Area */}
              <div className="flex-1 min-h-0 bg-[#E5E9E8] flex justify-center overflow-hidden relative">
                {previewTab === 'visual' ? (
                  <div className={`h-full transition-all duration-500 ease-in-out flex justify-center items-center ${previewMode === 'mobile' ? 'p-4 sm:p-8 w-full max-w-[420px]' : 'w-full'}`}>
                    <div className={`w-full h-full bg-white overflow-hidden shadow-xl ${previewMode === 'mobile' ? 'rounded-[2.5rem] border-[12px] border-[#3A4D4A]' : ''}`}>
                      <iframe 
                        srcDoc={getSrcDoc()} 
                        className="w-full h-full bg-white border-0"
                        title="Preview"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full overflow-auto p-4 sm:p-8 flex flex-col gap-8">
                    <CodeBlock filename="index.html" language="html" code={preview.index_html} />
                    <CodeBlock filename="styles.css" language="css" code={preview.styles_css} />
                    <CodeBlock filename="script.js" language="javascript" code={preview.script_js} />
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0,0,0,0.1);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.2);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255,255,255,0.3);
        }
      `}} />
    </div>
  );
}
