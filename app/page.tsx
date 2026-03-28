'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import * as d3 from 'd3';
import JSZip from 'jszip';
import { get, set } from 'idb-keyval';
import { Copy, Check, Maximize2, Minimize2, FileCode2, Download, ExternalLink, X, FileArchive, FileJson, Sparkles, LayoutDashboard, Rocket, FileText, Settings, Users, ArrowRight, Image as ImageIcon, Trash2, CreditCard, User, Mail, Lock, LogOut } from 'lucide-react';
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
import { copywritingExpertAgent } from '@/agents/copywriting_expert_agent';
import { imagePromptAgent } from '@/agents/image_prompt_agent';

import { TEMPLATES, Template } from '@/lib/templates';

interface Project {
  id: string;
  name: string;
  date: string;
  request: string;
  result: any;
  heroImage?: string;
  templateId?: string;
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
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-[#3A4D4A] rounded-xl overflow-hidden border border-[#4A5D5A] shadow-lg flex flex-col w-full"
    >
      <div className="flex justify-between items-center px-4 py-3 bg-[#2C3E3B] border-b border-[#4A5D5A]">
        <div className="flex items-center gap-2 text-gray-200 font-mono text-sm">
          <FileCode2 size={16} className="text-[#D4A017] drop-shadow-[0_0_5px_rgba(212,160,23,0.5)]" />
          {filename}
        </div>
        <button 
          onClick={handleCopy} 
          className="text-gray-300 hover:text-white transition-colors flex items-center gap-1.5 text-xs bg-[#3A4D4A] hover:bg-[#4A5D5A] px-3 py-1.5 rounded-full border border-white/5"
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
    </motion.div>
  );
};

const MiniChart = ({ color = '#D4A017', height = 20, width = 60 }: { color?: string, height?: number, width?: number }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [data, setData] = useState<number[]>([10, 12, 8, 15, 11, 13, 9, 14, 10, 12, 8, 15]);

  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => {
        const next = [...prev.slice(1), Math.random() * 10 + 5];
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const x = d3.scaleLinear().domain([0, data.length - 1]).range([0, width]);
    const y = d3.scaleLinear().domain([0, 20]).range([height, 0]);

    const line = d3.line<number>()
      .x((_, i) => x(i))
      .y(d => y(d))
      .curve(d3.curveBasis);

    const area = d3.area<number>()
      .x((_, i) => x(i))
      .y0(height)
      .y1(d => y(d))
      .curve(d3.curveBasis);

    // Add gradient
    const gradientId = `gradient-${Math.random().toString(36).substr(2, 9)}`;
    const defs = svg.append("defs");
    const gradient = defs.append("linearGradient")
      .attr("id", gradientId)
      .attr("x1", "0%").attr("y1", "0%")
      .attr("x2", "0%").attr("y2", "100%");
    
    gradient.append("stop").attr("offset", "0%").attr("stop-color", color).attr("stop-opacity", 0.3);
    gradient.append("stop").attr("offset", "100%").attr("stop-color", color).attr("stop-opacity", 0);

    svg.append("path")
      .datum(data)
      .attr("d", area)
      .attr("fill", `url(#${gradientId})`);

    svg.append("path")
      .datum(data)
      .attr("d", line)
      .attr("fill", "none")
      .attr("stroke", color)
      .attr("stroke-width", 1.5)
      .attr("stroke-linecap", "round")
      .attr("class", "drop-shadow-[0_0_3px_rgba(212,160,23,0.4)]");

  }, [data, color, height, width]);

  return (
    <svg ref={svgRef} width={width} height={height} className="overflow-visible" />
  );
};

const GlitchButton = ({ children, onClick, className, disabled, variant = 'primary' }: any) => {
  return (
    <motion.button
      whileHover={!disabled ? { 
        scale: 1.02,
        boxShadow: variant === 'primary' ? "0 0 25px rgba(212,160,23,0.4)" : "0 0 25px rgba(255,255,255,0.1)",
      } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      onClick={onClick}
      disabled={disabled}
      className={`relative overflow-hidden group ${className}`}
    >
      <span className="relative z-10 flex items-center gap-3">{children}</span>
      
      {/* Glitch layers on hover */}
      {!disabled && (
        <>
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300">
            <div className="absolute inset-0 bg-red-500/10 translate-x-[1px] mix-blend-screen animate-pulse" />
            <div className="absolute inset-0 bg-blue-500/10 -translate-x-[1px] mix-blend-screen animate-pulse" />
            <motion.div 
              className="absolute inset-0 bg-white/5"
              animate={{ 
                x: ["-100%", "100%"],
              }}
              transition={{ 
                duration: 0.8, 
                repeat: Infinity, 
                ease: "linear"
              }}
            />
          </div>
          {/* Grain texture change on hover */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-20 pointer-events-none transition-opacity duration-300 mix-blend-overlay">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <filter id="buttonNoise">
                <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" />
              </filter>
              <rect width="100%" height="100%" filter="url(#buttonNoise)" />
            </svg>
          </div>
        </>
      )}
    </motion.button>
  );
};

const GrainOverlay = () => (
  <div className="absolute inset-0 pointer-events-none opacity-[0.04] mix-blend-overlay z-50">
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <filter id="noiseFilter">
        <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
      </filter>
      <rect width="100%" height="100%" filter="url(#noiseFilter)" />
    </svg>
  </div>
);

const ScanlineOverlay = () => (
  <div className="absolute inset-0 pointer-events-none opacity-[0.02] z-50 overflow-hidden">
    <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] animate-scanline"></div>
  </div>
);

export default function Page() {
  const [request, setRequest] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'template-selection' | 'input' | 'review' | 'generating' | 'result'>('template-selection');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [parsedIntent, setParsedIntent] = useState<any>(null);
  const [preview, setPreview] = useState<any>(null);
  const [previewMode, setPreviewMode] = useState<'mobile' | 'desktop'>('desktop');
  const [previewTab, setPreviewTab] = useState<'visual' | 'code'>('visual');
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentView, setCurrentView] = useState<'generator' | 'tunnels' | 'dashboard' | 'settings'>('generator');
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        let savedProjects = await get('ai_funnel_projects');
        if (!savedProjects) {
          // Try to migrate from localStorage
          const local = localStorage.getItem('ai_funnel_projects');
          if (local) {
            savedProjects = JSON.parse(local);
            await set('ai_funnel_projects', savedProjects);
            localStorage.removeItem('ai_funnel_projects');
          }
        }
        if (savedProjects) {
          setProjects(savedProjects);
        }
      } catch (e) {
        console.error("Failed to load projects from IndexedDB", e);
      }
    };
    loadProjects();
  }, []);

  const saveProject = async (newResult: any, req: string) => {
    const newProject: Project = {
      id: Date.now().toString(),
      name: req.substring(0, 30) + (req.length > 30 ? '...' : ''),
      date: new Date().toISOString(),
      request: req,
      result: newResult,
      templateId: selectedTemplate?.id
    };
    
    const updatedProjects = [newProject, ...projects];
    setProjects(updatedProjects);
    setCurrentProjectId(newProject.id);
    try {
      await set('ai_funnel_projects', updatedProjects);
    } catch (e) {
      console.error("Failed to save project to IndexedDB", e);
    }
  };

  const deleteProject = async (id: string) => {
    const updatedProjects = projects.filter(p => p.id !== id);
    setProjects(updatedProjects);
    try {
      await set('ai_funnel_projects', updatedProjects);
    } catch (e) {
      console.error("Failed to delete project from IndexedDB", e);
    }
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
      const res = await imageGenerationAgent({ intent: result.intent.data, branding: result.branding.data });
      if (res.success && res.data?.imageUrl) {
        const updatedProjects = projects.map(p => {
          if (p.id === currentProjectId) {
            return { ...p, heroImage: res.data.imageUrl || undefined };
          }
          return p;
        });
        setProjects(updatedProjects);
        await set('ai_funnel_projects', updatedProjects);
        
        // Update current result with the new image
        const updatedResult = { ...result, heroImage: res.data.imageUrl };
        setResult(updatedResult);
        
        // If preview is open, update it too
        if (preview) {
          setPreview({ ...preview, heroImage: res.data.imageUrl });
        }
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
    setStep('template-selection');
    setSelectedTemplate(null);
    setParsedIntent(null);
    setCurrentView('generator');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const intentRes = await offerIntentAgent(request, selectedTemplate);
      setParsedIntent(intentRes.data);
      setStep('review');
    } catch (err: any) {
      console.error(err);
      if (err.message?.includes('403') || err.message?.includes('leaked')) {
        setError("Votre clé API Gemini a été signalée comme fuitée. Veuillez la mettre à jour dans le menu Paramètres de AI Studio.");
      } else {
        setError("Une erreur est survenue lors de l'analyse de l'offre. Veuillez réessayer.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmIntent = async () => {
    setLoading(true);
    setStep('generating');
    setError(null);
    try {
      const intentRes = { data: parsedIntent };
      const structureRes = await funnelStructureAgent(intentRes.data);
      const copyRes = await copywritingExpertAgent(intentRes.data);
      const imagePromptsRes = await imagePromptAgent({ intent: intentRes.data, copy: copyRes.data });
      const headlineRes = await headlineCopyAgent(structureRes.data);
      const layoutRes = await layoutHierarchyAgent(structureRes.data);
      const spacingRes = await spacingRhythmAgent(layoutRes.data);
      const brandRes = await brandContrastAgent(intentRes.data);
      const imageRes = await imageDirectionAgent(intentRes.data);
      const proofRes = await proofNumbersAgent(intentRes.data);
      const interactionRes = await interactionMotionAgent(layoutRes.data);
      
      // Generate Hero Image
      let heroImageUrl = undefined;
      try {
        const imgRes = await imageGenerationAgent({ intent: intentRes.data, branding: brandRes.data });
        if (imgRes.success && imgRes.data?.imageUrl) {
          heroImageUrl = imgRes.data.imageUrl;
        }
      } catch (e) {
        console.error("Hero image generation failed", e);
      }

      const frontendRes = await frontendAssemblyAgent({
        intent: intentRes.data,
        structure: structureRes.data,
        copy: copyRes.data,
        imagePrompts: imagePromptsRes.data,
        headline: headlineRes.data,
        layout: layoutRes.data,
        spacing: spacingRes.data,
        branding: brandRes.data,
        images: imageRes.data,
        proof: proofRes.data,
        interaction: interactionRes.data,
        hasHeroImage: !!heroImageUrl,
        template: selectedTemplate
      });
      const finalResult = { 
        intent: intentRes, 
        structure: structureRes,
        copy: copyRes,
        imagePrompts: imagePromptsRes,
        headline: headlineRes, 
        layout: layoutRes,
        spacing: spacingRes,
        branding: brandRes,
        images: imageRes,
        proof: proofRes,
        interaction: interactionRes,
        frontend: frontendRes,
        heroImage: heroImageUrl
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
        await set('ai_funnel_projects', updatedProjects);
      }
    } catch (err: any) {
      console.error(err);
      if (err.message?.includes('403') || err.message?.includes('leaked')) {
        setError("Votre clé API Gemini a été signalée comme fuitée. Veuillez la mettre à jour dans le menu Paramètres de AI Studio.");
      } else {
        setError("Une erreur est survenue lors de la génération du tunnel. Veuillez réessayer.");
      }
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
    let indexHtml = preview.index_html;
    if (preview.heroImage) {
      indexHtml = indexHtml.replace(/\[heroImage\]/g, preview.heroImage);
    }
    const combined = indexHtml
      .replace('</head>', `<style>${preview.styles_css}</style></head>`)
      .replace('</body>', `<script>${preview.script_js}</script></body>`);
    downloadFile('funnel-combined.html', combined);
  };

  const downloadZip = async () => {
    if (!preview) return;
    const zip = new JSZip();
    let indexHtml = preview.index_html;
    
    // Add hero image if it exists
    if (preview.heroImage) {
      const base64Data = preview.heroImage.split(',')[1];
      if (base64Data) {
        zip.file("hero.png", base64Data, { base64: true });
        // Update index.html to point to the local file in the ZIP
        indexHtml = indexHtml.replace(/\[heroImage\]/g, "hero.png");
      }
    }
    
    zip.file("index.html", indexHtml);
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
    let indexHtml = preview.index_html;
    if (preview.heroImage) {
      indexHtml = indexHtml.replace(/\[heroImage\]/g, preview.heroImage);
    }
    return `
      <!DOCTYPE html>
      <html lang="fr">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>${preview.styles_css}</style>
        </head>
        <body>
          ${indexHtml}
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
    <div className="flex h-screen bg-[#E5E9E8] font-sans overflow-hidden relative">
      <ScanlineOverlay />
      {/* Ambient Glow Blobs */}
      <div className="absolute -top-[10%] -left-[5%] w-[40%] h-[40%] bg-[#D4A017]/5 blur-[120px] rounded-full pointer-events-none animate-pulse"></div>
      <div className="absolute -bottom-[10%] -right-[5%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none animate-pulse" style={{ animationDelay: '1s' }}></div>
      
      {/* Sidebar */}
      <aside className="w-64 bg-[#3A4D4A] text-white flex flex-col shadow-2xl z-10 rounded-tr-[3rem] rounded-br-[3rem] my-4 ml-4 overflow-hidden relative border-r border-white/5">
        <GrainOverlay />
        <div className="p-8 flex flex-col items-center border-b border-[#4A5D5A] relative z-10">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#D4A017] to-yellow-200 p-1 mb-4 shadow-[0_0_20px_rgba(212,160,23,0.3)]">
            <div className="w-full h-full bg-[#2C3E3B] rounded-full flex items-center justify-center">
              <Rocket size={32} className="text-[#D4A017] drop-shadow-[0_0_8px_rgba(212,160,23,0.6)]" />
            </div>
          </div>
          <h2 className="font-bold tracking-widest text-sm text-center">FUNNEL</h2>
          <p className="text-xs text-gray-400 mt-1 uppercase tracking-[0.3em]">Studio</p>
        </div>

        <nav className="flex-1 py-6 relative z-10">
          <ul className="space-y-2">
            <li className="relative">
              {currentView === 'dashboard' && (
                <motion.div 
                  layoutId="activeNav"
                  className="absolute left-0 top-0 bottom-0 w-1 bg-[#D4A017] rounded-r-full shadow-[0_0_15px_#D4A017,0_0_5px_#D4A017]"
                />
              )}
              <button onClick={() => setCurrentView('dashboard')} className={`w-full flex items-center gap-4 px-8 py-4 transition-all duration-300 relative ${currentView === 'dashboard' ? 'bg-white text-[#3A4D4A] rounded-l-full ml-4 shadow-[0_10px_30px_rgba(0,0,0,0.1)]' : 'text-gray-300 hover:text-white hover:bg-[#4A5D5A]'}`}>
                <LayoutDashboard size={20} className={currentView === 'dashboard' ? 'text-[#D4A017] drop-shadow-[0_0_5px_rgba(212,160,23,0.5)]' : 'opacity-60'} />
                <span className="font-bold text-sm tracking-wide">DASHBOARD</span>
              </button>
            </li>
            <li className="relative">
              {currentView === 'generator' && (
                <motion.div 
                  layoutId="activeNav"
                  className="absolute left-0 top-0 bottom-0 w-1 bg-[#D4A017] rounded-r-full shadow-[0_0_15px_#D4A017,0_0_5px_#D4A017]"
                />
              )}
              <button onClick={() => setCurrentView('generator')} className={`w-full flex items-center gap-4 px-8 py-4 transition-all duration-300 relative ${currentView === 'generator' ? 'bg-white text-[#3A4D4A] rounded-l-full ml-4 shadow-[0_10px_30px_rgba(0,0,0,0.1)]' : 'text-gray-300 hover:text-white hover:bg-[#4A5D5A]'}`}>
                <Rocket size={20} className={currentView === 'generator' ? 'text-[#D4A017] drop-shadow-[0_0_5px_rgba(212,160,23,0.5)]' : 'opacity-60'} />
                <span className="font-bold text-sm tracking-wide">GÉNÉRATEUR</span>
              </button>
            </li>
            <li className="relative">
              {currentView === 'tunnels' && (
                <motion.div 
                  layoutId="activeNav"
                  className="absolute left-0 top-0 bottom-0 w-1 bg-[#D4A017] rounded-r-full shadow-[0_0_15px_#D4A017,0_0_5px_#D4A017]"
                />
              )}
              <button onClick={() => setCurrentView('tunnels')} className={`w-full flex items-center gap-4 px-8 py-4 transition-all duration-300 relative ${currentView === 'tunnels' ? 'bg-white text-[#3A4D4A] rounded-l-full ml-4 shadow-[0_10px_30px_rgba(0,0,0,0.1)]' : 'text-gray-300 hover:text-white hover:bg-[#4A5D5A]'}`}>
                <FileText size={20} className={currentView === 'tunnels' ? 'text-[#D4A017] drop-shadow-[0_0_5px_rgba(212,160,23,0.5)]' : 'opacity-60'} />
                <span className="font-bold text-sm tracking-wide">MES TUNNELS</span>
              </button>
            </li>
            <li className="relative">
              {currentView === 'settings' && (
                <motion.div 
                  layoutId="activeNav"
                  className="absolute left-0 top-0 bottom-0 w-1 bg-[#D4A017] rounded-r-full shadow-[0_0_15px_#D4A017,0_0_5px_#D4A017]"
                />
              )}
              <button onClick={() => setCurrentView('settings')} className={`w-full flex items-center gap-4 px-8 py-4 transition-all duration-300 relative ${currentView === 'settings' ? 'bg-white text-[#3A4D4A] rounded-l-full ml-4 shadow-[0_10px_30px_rgba(0,0,0,0.1)]' : 'text-gray-300 hover:text-white hover:bg-[#4A5D5A]'}`}>
                <Settings size={20} className={currentView === 'settings' ? 'text-[#D4A017] drop-shadow-[0_0_5px_rgba(212,160,23,0.5)]' : 'opacity-60'} />
                <span className="font-bold text-sm tracking-wide">PARAMÈTRES</span>
              </button>
            </li>
          </ul>
        </nav>
        
        <div className="p-6 border-t border-[#4A5D5A] bg-[#2C3E3B]/80 backdrop-blur-sm relative z-10">
           <div className="flex items-center justify-between text-gray-300 mb-4">
             <div className="flex items-center gap-3">
               <div className="relative">
                 <Users size={18} className="text-[#D4A017] drop-shadow-[0_0_5px_rgba(212,160,23,0.5)]" />
                 <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
               </div>
               <span className="font-bold text-[10px] tracking-[0.3em] text-gray-400">AGENTS ACTIFS</span>
             </div>
             <div className="flex gap-1.5 items-center">
               <MiniChart />
             </div>
           </div>
           
           {/* K2000 Scanning Effect - Upgraded */}
           <div className="w-full h-[3px] bg-black/40 rounded-full mb-6 overflow-hidden relative border border-white/5 shadow-inner">
             <motion.div 
               animate={{ 
                 left: ["-40%", "120%", "-40%"],
               }}
               transition={{ 
                 duration: 2.5, 
                 repeat: Infinity, 
                 ease: "easeInOut" 
               }}
               className="absolute top-0 bottom-0 w-1/3 bg-gradient-to-r from-transparent via-red-500 to-transparent shadow-[0_0_15px_#ef4444]"
             />
           </div>

           <div className="grid grid-cols-4 gap-2 mb-6">
             {[...Array(7)].map((_, i) => (
               <div key={i} className="group relative">
                 <div className="w-full aspect-square rounded-lg bg-[#1A2624] border border-[#4A5D5A]/50 flex flex-col items-center justify-center transition-all hover:border-[#D4A017] hover:bg-[#2C3E3B] group-hover:shadow-[0_0_15px_rgba(212,160,23,0.15)]">
                   <span className="text-[9px] font-mono text-gray-500 group-hover:text-[#D4A017] transition-colors">A{i+1}</span>
                   <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e] mt-1 animate-pulse"></div>
                 </div>
               </div>
             ))}
             <div className="w-full aspect-square rounded-lg bg-gradient-to-br from-[#D4A017] to-[#B8860B] flex items-center justify-center text-[10px] font-black text-white shadow-lg shadow-yellow-900/40 border border-white/10 hover:scale-105 transition-transform cursor-default">
               +3
             </div>
           </div>

           {/* Stylized Logs - Upgraded Terminal Look */}
           <div className="bg-black/60 rounded-xl p-3 font-mono text-[9px] border border-white/5 shadow-2xl relative overflow-hidden group">
             <div className="absolute top-0 left-0 w-full h-full pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]"></div>
             <div className="space-y-1.5 relative z-10">
               <div className="flex gap-2 items-start">
                 <span className="text-blue-400 shrink-0 opacity-80">SYS</span>
                 <span className="text-gray-400 leading-tight">Initialisation de la séquence...</span>
               </div>
               <div className="flex gap-2 items-start">
                 <span className="text-yellow-500 shrink-0 opacity-80">NET</span>
                 <span className="text-gray-400 leading-tight">10 Agents IA synchronisés</span>
               </div>
               <div className="flex gap-2 items-start">
                 <span className="text-red-500 shrink-0 opacity-80">K2K</span>
                 <motion.span 
                   animate={{ opacity: [1, 0.5, 1] }}
                   transition={{ duration: 0.5, repeat: Infinity }}
                   className="text-red-400 font-bold tracking-tighter"
                 >
                   MODE TURBO ACTIF
                 </motion.span>
               </div>
               <div className="flex gap-2 items-start opacity-40">
                 <span className="text-green-500 shrink-0">OK</span>
                 <span className="text-gray-500">Prêt pour génération</span>
               </div>
             </div>
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8 relative">
        <div className="max-w-7xl mx-auto">
          
          {/* Top Bar - Upgraded */}
          <div className="bg-white/80 backdrop-blur-md rounded-3xl px-8 py-5 flex items-center justify-between shadow-[0_8px_30px_rgb(0,0,0,0.04)] mb-10 border border-white/20">
            <div className="flex items-center gap-6 text-[#3A4D4A] font-medium">
              <div className="flex items-center gap-3 bg-[#F0F4F3] px-6 py-3 rounded-2xl text-[10px] font-black tracking-[0.2em] uppercase border border-gray-100 shadow-inner">
                <div className="relative">
                   <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_10px_#22c55e]"></div>
                   <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-green-400 animate-ping"></div>
                 </div>
                Système Opérationnel
              </div>
              <div className="h-8 w-px bg-gray-200 hidden md:block"></div>
              <div className="hidden md:flex items-center gap-2 text-[10px] font-bold text-gray-400 tracking-widest uppercase">
                <Sparkles size={14} className="text-[#D4A017] drop-shadow-[0_0_3px_rgba(212,160,23,0.5)]" />
                Moteur IA v4.2
              </div>
            </div>
            <div className="flex items-center gap-8">
              <div className="hidden lg:flex items-center gap-3">
                <div className="flex -space-x-2">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center overflow-hidden shadow-sm">
                      <div className={`w-full h-full bg-gradient-to-br ${i === 0 ? 'from-blue-400 to-blue-600' : i === 1 ? 'from-purple-400 to-purple-600' : 'from-orange-400 to-orange-600'} opacity-20`}></div>
                    </div>
                  ))}
                </div>
                <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">Agents Synchronisés</span>
              </div>
              <GlitchButton 
                onClick={startNewProject}
                className="bg-[#3A4D4A] text-white px-10 py-4 rounded-2xl text-[10px] font-black tracking-[0.3em] shadow-2xl hover:bg-[#2C3E3B] transition-all border-b-4 border-black/30 flex items-center gap-3"
              >
                <Rocket size={16} className="text-[#D4A017] drop-shadow-[0_0_5px_rgba(212,160,23,0.8)]" />
                NOUVEAU PROJET
              </GlitchButton>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {currentView === 'dashboard' && (
              <motion.div 
                key="dashboard"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="space-y-8"
              >
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-[#3A4D4A]">Tableau de Bord</h1>
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
                  <CreditCard size={18} className="text-[#D4A017]" />
                  <span className="text-sm font-bold text-[#3A4D4A]">PLAN PRO</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'Tunnels Générés', value: projects.length, icon: FileText, color: 'text-blue-500', chartColor: '#3b82f6' },
                  { label: 'Agents Actifs', value: '10', icon: Users, color: 'text-green-500', chartColor: '#22c55e' },
                  { label: 'Images Créées', value: projects.filter(p => p.heroImage).length, icon: ImageIcon, color: 'text-purple-500', chartColor: '#a855f7' },
                  { label: 'Temps Gagné', value: `${projects.length * 4}h`, icon: Sparkles, color: 'text-[#D4A017]', chartColor: '#D4A017' },
                ].map((stat, i) => (
                  <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col gap-4 group hover:shadow-xl transition-all duration-500">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center ${stat.color} group-hover:scale-110 transition-transform`}>
                        <stat.icon size={24} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{stat.label}</p>
                        <p className="text-2xl font-black text-[#3A4D4A]">{stat.value}</p>
                      </div>
                    </div>
                    <div className="h-10 w-full flex items-end justify-center pt-2 border-t border-gray-50">
                      <MiniChart color={stat.chartColor} width={180} height={30} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-[#3A4D4A]">Projets Récents</h3>
                    <button onClick={() => setCurrentView('tunnels')} className="text-[#D4A017] text-sm font-bold hover:underline">Voir tout</button>
                  </div>
                  {projects.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed border-gray-100 rounded-2xl">
                      <p className="text-gray-400">Aucun projet récent</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {projects.slice(0, 3).map((project) => (
                        <div key={project.id} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-2xl transition-colors border border-transparent hover:border-gray-100">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-[#3A4D4A] flex items-center justify-center text-white">
                              {project.heroImage ? <Image src={project.heroImage} alt="" width={48} height={48} className="rounded-xl object-cover" /> : <FileText size={20} />}
                            </div>
                            <div>
                              <h4 className="font-bold text-[#3A4D4A]">{project.name}</h4>
                              <p className="text-xs text-gray-400">{new Date(project.date).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <button onClick={() => loadProject(project)} className="p-2 hover:bg-white rounded-full shadow-sm text-[#D4A017]">
                            <ArrowRight size={20} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="bg-[#3A4D4A] p-8 rounded-[2rem] shadow-xl text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4A017] rounded-full opacity-10 -mr-10 -mt-10 blur-2xl"></div>
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <CreditCard size={24} className="text-[#D4A017]" />
                    VOTRE PLAN
                  </h3>
                  <div className="mb-8">
                    <p className="text-sm text-gray-400 mb-1 uppercase tracking-widest font-bold">Plan Actuel</p>
                    <p className="text-3xl font-black text-[#D4A017]">STUDIO PRO</p>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {['Générations illimitées', 'Images IA Haute Qualité', 'Export ZIP complet', 'Support Prioritaire'].map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
                        <Check size={16} className="text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button className="w-full py-4 bg-white text-[#3A4D4A] rounded-full font-bold text-sm tracking-widest hover:bg-gray-100 transition-colors shadow-lg">
                    GÉRER L&apos;ABONNEMENT
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {currentView === 'generator' && (
            <motion.div 
              key="generator"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="grid grid-cols-1 xl:grid-cols-3 gap-8"
            >
              
              {/* Left Column: Input Form */}
              <div className="xl:col-span-2 space-y-8">
                <AnimatePresence mode="wait">
                  {step === 'template-selection' && (
                    <motion.div 
                      key="template-step"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-8"
                    >
                      <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
                        <h1 className="text-3xl font-bold text-[#3A4D4A] mb-2">Choisissez un Template</h1>
                        <p className="text-gray-500 mb-8">Sélectionnez une base optimisée ou commencez de zéro.</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Option: No Template */}
                          <button 
                            onClick={() => {
                              setSelectedTemplate(null);
                              setStep('input');
                            }}
                            className="group relative flex flex-col items-center justify-center p-8 rounded-3xl border-2 border-dashed border-gray-200 hover:border-[#D4A017] hover:bg-yellow-50 transition-all text-center"
                          >
                            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400 group-hover:text-[#D4A017] group-hover:bg-white transition-colors mb-4">
                              <Sparkles size={32} />
                            </div>
                            <h3 className="font-bold text-[#3A4D4A]">Génération Libre</h3>
                            <p className="text-xs text-gray-400 mt-2">Laissez l&apos;IA tout inventer de A à Z</p>
                          </button>

                          {/* Templates List */}
                          {TEMPLATES.map((template) => (
                            <button 
                              key={template.id}
                              onClick={() => {
                                setSelectedTemplate(template);
                                setStep('input');
                              }}
                              className="group relative flex flex-col overflow-hidden rounded-3xl border-2 border-transparent hover:border-[#D4A017] transition-all text-left bg-white shadow-sm hover:shadow-xl"
                            >
                              <div className="h-32 w-full relative overflow-hidden bg-gray-100">
                                <Image src={template.thumbnail} alt={template.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-[10px] font-bold text-[#3A4D4A] uppercase tracking-wider">
                                  {template.category}
                                </div>
                              </div>
                              <div className="p-6">
                                <h3 className="font-bold text-[#3A4D4A]">{template.name}</h3>
                                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{template.description}</p>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {step === 'input' && (
                    <motion.div 
                      key="input-step"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100"
                    >
                      <h1 className="text-3xl font-bold text-[#3A4D4A] mb-2">Décrivez votre offre</h1>
                      <p className="text-gray-500 mb-6">Laissez nos agents concevoir le tunnel parfait pour vous.</p>
                      
                      {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-medium">
                          {error}
                        </div>
                      )}

                      <form onSubmit={handleSubmit}>
                        <textarea
                          className="w-full p-6 rounded-2xl border-2 border-gray-100 bg-gray-50 focus:bg-white focus:border-[#D4A017] focus:ring-0 transition-all resize-none text-gray-700 text-lg min-h-[200px] mb-6"
                          placeholder="Ex: Je vends une formation en ligne sur le marketing digital pour les débutants à 497€..."
                          value={request}
                          onChange={(e) => setRequest(e.target.value)}
                          disabled={loading}
                        />
                        
                        <div className="flex justify-end">
                          <GlitchButton
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
                          </GlitchButton>
                        </div>
                      </form>
                    </motion.div>
                  )}

                  {step === 'review' && parsedIntent && (
                    <motion.div 
                      key="review-step"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100"
                    >
                      <h1 className="text-3xl font-bold text-[#3A4D4A] mb-2">Vérification de l&apos;offre</h1>
                      <p className="text-gray-500 mb-6">Corrigez les informations ci-dessous avant de générer le tunnel pour éviter les hallucinations.</p>
                      
                      {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-medium">
                          {error}
                        </div>
                      )}

                      <div className="space-y-4 mb-8">
                        <div>
                          <label className="block text-sm font-bold text-[#3A4D4A] mb-1">Nom du Produit / Service</label>
                          <input 
                            type="text" 
                            className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#D4A017] focus:ring-0 transition-all text-gray-800"
                            value={parsedIntent.product_name || ''}
                            onChange={(e) => setParsedIntent({...parsedIntent, product_name: e.target.value})}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-[#3A4D4A] mb-1">Prix</label>
                          <input 
                            type="text" 
                            className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#D4A017] focus:ring-0 transition-all text-gray-800"
                            value={parsedIntent.price || ''}
                            onChange={(e) => setParsedIntent({...parsedIntent, price: e.target.value})}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-[#3A4D4A] mb-1">Audience Cible</label>
                          <input 
                            type="text" 
                            className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#D4A017] focus:ring-0 transition-all text-gray-800"
                            value={parsedIntent.suspected_audience || ''}
                            onChange={(e) => setParsedIntent({...parsedIntent, suspected_audience: e.target.value})}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-[#3A4D4A] mb-1">Promesse Principale</label>
                          <textarea 
                            className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#D4A017] focus:ring-0 transition-all resize-none h-24 text-gray-800"
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
                        <GlitchButton
                          onClick={handleConfirmIntent}
                          className="px-8 py-4 rounded-full font-bold text-base tracking-wide shadow-lg transition-all flex items-center gap-3 bg-[#D4A017] hover:bg-yellow-600 text-white"
                        >
                          CONFIRMER ET GÉNÉRER LE TUNNEL
                          <ArrowRight size={18} />
                        </GlitchButton>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

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
                          onClick={() => setPreview({ ...result.frontend.data, heroImage: result.heroImage })} 
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

            </motion.div>
          )}

          {currentView === 'tunnels' && (
            <motion.div 
              key="tunnels"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100"
            >
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
            </motion.div>
          )}

          {currentView === 'settings' && (
            <motion.div 
              key="settings"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              <div className="lg:col-span-2 space-y-8">
                <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
                  <h3 className="text-xl font-bold text-[#3A4D4A] mb-6 flex items-center gap-2">
                    <User size={24} className="text-[#D4A017]" />
                    Profil Utilisateur
                  </h3>
                  <div className="flex flex-col md:flex-row gap-8 items-start">
                    <div className="relative group">
                      <div className="w-32 h-32 rounded-3xl bg-gray-100 flex items-center justify-center border-4 border-white shadow-lg overflow-hidden">
                        <User size={64} className="text-gray-300" />
                      </div>
                      <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-[#D4A017] text-white rounded-xl shadow-lg flex items-center justify-center hover:bg-yellow-600 transition-colors">
                        <ImageIcon size={18} />
                      </button>
                    </div>
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Nom Complet</label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                          <input type="text" defaultValue="Utilisateur Studio" className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:border-[#D4A017] transition-all text-gray-800" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Email</label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                          <input type="email" defaultValue="numtemadigitalmarketingagency@gmail.com" className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:border-[#D4A017] transition-all text-gray-800" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
                  <h3 className="text-xl font-bold text-[#3A4D4A] mb-6 flex items-center gap-2">
                    <Lock size={24} className="text-[#D4A017]" />
                    Sécurité
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Mot de passe actuel</label>
                      <input type="password" placeholder="••••••••" className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:border-[#D4A017] transition-all text-gray-800" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Nouveau mot de passe</label>
                        <input type="password" placeholder="••••••••" className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:border-[#D4A017] transition-all text-gray-800" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Confirmer le mot de passe</label>
                        <input type="password" placeholder="••••••••" className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:border-[#D4A017] transition-all text-gray-800" />
                      </div>
                    </div>
                    <div className="pt-4">
                      <button className="bg-[#3A4D4A] text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-[#2C3E3B] transition-colors shadow-md">
                        METTRE À JOUR LE MOT DE PASSE
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div className="bg-[#3A4D4A] p-8 rounded-[2rem] shadow-xl text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4A017] rounded-full opacity-10 -mr-10 -mt-10 blur-2xl"></div>
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <CreditCard size={24} className="text-[#D4A017]" />
                    Plan Studio
                  </h3>
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/10 mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Usage ce mois</span>
                      <span className="text-xs font-bold text-[#D4A017]">85%</span>
                    </div>
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="w-[85%] h-full bg-[#D4A017] shadow-[0_0_10px_#D4A017]"></div>
                    </div>
                  </div>
                  <button className="w-full py-4 bg-[#D4A017] text-white rounded-full font-bold text-sm tracking-widest hover:bg-yellow-600 transition-colors shadow-lg">
                    UPGRADER LE PLAN
                  </button>
                </div>

                <div className="bg-red-50 p-8 rounded-[2rem] border border-red-100">
                  <h3 className="text-lg font-bold text-red-600 mb-4 flex items-center gap-2">
                    <Trash2 size={20} />
                    Zone de Danger
                  </h3>
                  <p className="text-sm text-red-500/70 mb-6">La suppression de votre compte est irréversible. Toutes vos données seront effacées.</p>
                  <button className="w-full py-3 border-2 border-red-200 text-red-500 rounded-xl font-bold text-xs tracking-widest hover:bg-red-500 hover:text-white hover:border-red-500 transition-all">
                    SUPPRIMER MON COMPTE
                  </button>
                </div>
              </div>
            </motion.div>
          )}
          </AnimatePresence>
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
                
                {preview.heroImage && (
                  <button 
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = preview.heroImage;
                      link.download = 'hero-image.png';
                      link.click();
                    }} 
                    className="bg-gray-50 hover:bg-gray-100 border border-gray-200 text-[#D4A017] px-6 py-2.5 rounded-full text-sm font-bold tracking-wide transition-colors flex items-center gap-2"
                  >
                    <ImageIcon size={16}/> IMAGE HERO
                  </button>
                )}

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
