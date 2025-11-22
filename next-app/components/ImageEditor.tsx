'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Upload, Clock, Download, Zap, Image as ImageIcon, RotateCcw, Droplet, EyeOff, Sun, Palette, ScanLine, Wand2 } from 'lucide-react';

export default function ImageEditor() {
  const [imageSrc, setImageSrc] = useState<HTMLImageElement | null>(null);
  const [processingTime, setProcessingTime] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isWasmLoaded, setIsWasmLoaded] = useState(false);
  
  // Filter Parameters
  const [blurRadius, setBlurRadius] = useState(2);
  const [brightness, setBrightness] = useState(1.2);

  const wasmModule = useRef<any>(null); 
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadWasm = async () => {
      try {
        const wasm = await import('../../rust-lib/pkg/rust_lib.js'); 
        await wasm.default(); 
        wasmModule.current = wasm;
        setIsWasmLoaded(true);
      } catch (err) {
        console.error("Failed to load WASM module:", err);
      }
    };
    loadWasm();
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        setImageSrc(img);
        if (canvasRef.current) {
          const ctx = canvasRef.current.getContext('2d');
          if (ctx) {
            canvasRef.current.width = img.width;
            canvasRef.current.height = img.height;
            ctx.drawImage(img, 0, 0);
          }
        }
        setProcessingTime(null);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const applyEffect = async (effectType: 'invert' | 'blur' | 'grayscale' | 'sepia' | 'brightness' | 'sobel') => {
    if (!canvasRef.current || !imageSrc || !isWasmLoaded) return;
    
    setIsProcessing(true);
    
    // Slight delay to allow UI to update
    setTimeout(() => {
      const ctx = canvasRef.current!.getContext('2d');
      if (!ctx) return;

      const width = canvasRef.current!.width;
      const height = canvasRef.current!.height;
      
      const imageData = ctx.getImageData(0, 0, width, height);
      const data = imageData.data; 

      const startTime = performance.now();

      try {
        if (effectType === 'invert') {
          wasmModule.current.apply_invert(data);
        } else if (effectType === 'blur') {
          wasmModule.current.apply_blur(data, width, height, blurRadius);
        } else if (effectType === 'grayscale') {
           wasmModule.current.apply_grayscale(data);
        } else if (effectType === 'sepia') {
          wasmModule.current.apply_sepia(data);
        } else if (effectType === 'brightness') {
          wasmModule.current.apply_brightness(data, brightness);
        } else if (effectType === 'sobel') {
          wasmModule.current.apply_sobel(data, width, height);
        }
      } catch (e) {
        console.error("Error running WASM function:", e);
      }

      const endTime = performance.now();
      setProcessingTime((endTime - startTime).toFixed(2));

      ctx.putImageData(imageData, 0, 0);
      setIsProcessing(false);
    }, 50);
  };

  const handleReset = () => {
    if (!imageSrc || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (ctx) {
      ctx.drawImage(imageSrc, 0, 0);
      setProcessingTime(null);
    }
  };

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = 'turbo-pixel-edit.png';
    link.href = canvasRef.current.toDataURL('image/png');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Status Bar */}
      <div className="flex justify-between items-center bg-slate-900/80 backdrop-blur-sm p-4 rounded-2xl border border-slate-800 shadow-lg">
         <div className="flex items-center gap-3">
            <div className={`relative w-3 h-3 flex items-center justify-center`}>
              <div className={`absolute inset-0 rounded-full opacity-75 animate-ping ${isWasmLoaded ? 'bg-cyan-500' : 'bg-red-500'}`}></div>
              <div className={`relative w-2.5 h-2.5 rounded-full ${isWasmLoaded ? 'bg-cyan-400' : 'bg-red-500'}`}></div>
            </div>
            <span className={`text-sm font-medium tracking-wide ${isWasmLoaded ? 'text-cyan-400' : 'text-slate-500'}`}>
              {isWasmLoaded ? "TURBO CORE ONLINE" : "INITIALIZING..."}
            </span>
         </div>
         
         {processingTime && (
          <div className="flex items-center gap-2 bg-slate-800/50 px-4 py-1.5 rounded-full border border-slate-700 animate-in fade-in zoom-in duration-300">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">
              Compute Time: <span className="text-cyan-300 font-mono text-sm ml-1">{processingTime}ms</span>
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* CONTROLS SIDEBAR (Left) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Main Actions */}
          <div className="bg-slate-900/80 p-5 rounded-2xl shadow-xl border border-slate-800 flex gap-3 transition-transform hover:scale-[1.01] duration-300">
             <button 
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 group flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl font-bold shadow-lg shadow-cyan-900/20 transition-all duration-300 hover:shadow-cyan-500/30 hover:-translate-y-1 active:scale-95"
            >
              <Upload className="w-5 h-5 group-hover:animate-bounce" />
              UPLOAD
            </button>
            <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
            
            <button 
              onClick={handleReset}
              disabled={!imageSrc}
              title="Reset Original"
              className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl border border-slate-700 transition-all duration-200 hover:border-slate-500 hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
             <button 
              onClick={handleDownload}
              disabled={!imageSrc}
              title="Download Result"
              className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl border border-slate-700 transition-all duration-200 hover:border-slate-500 hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
            >
              <Download className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Filters */}
          <div className="bg-slate-900/80 p-5 rounded-2xl shadow-xl border border-slate-800 flex flex-col gap-4 group">
            <div className="flex items-center gap-2 mb-1">
              <Wand2 className="w-4 h-4 text-cyan-500" />
              <h3 className="text-xs font-bold text-cyan-500 uppercase tracking-widest">Instant Filters</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'grayscale', label: 'B&W', icon: EyeOff, color: 'text-slate-400' },
                { id: 'invert', label: 'Invert', icon: Zap, color: 'text-yellow-400' },
                { id: 'sepia', label: 'Sepia', icon: Palette, color: 'text-orange-400' },
                { id: 'sobel', label: 'Edge', icon: ScanLine, color: 'text-purple-400' },
              ].map((filter) => (
                <button 
                  key={filter.id}
                  onClick={() => applyEffect(filter.id as any)} 
                  disabled={!imageSrc} 
                  className="relative overflow-hidden flex items-center gap-3 px-4 py-3 bg-slate-800 hover:bg-slate-750 border border-slate-700/50 rounded-xl transition-all duration-300 hover:border-cyan-500/50 hover:shadow-[0_0_15px_rgba(6,182,212,0.15)] hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:pointer-events-none group/btn"
                >
                  <filter.icon className={`w-4 h-4 ${filter.color} transition-transform group-hover/btn:scale-110`} />
                  <span className="text-sm font-medium text-slate-200">{filter.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Fine Tuning */}
          <div className="bg-slate-900/80 p-5 rounded-2xl shadow-xl border border-slate-800 flex flex-col gap-6">
            <div className="flex items-center gap-2 mb-1">
              <Droplet className="w-4 h-4 text-cyan-500" />
              <h3 className="text-xs font-bold text-cyan-500 uppercase tracking-widest">Fine Tuning</h3>
            </div>
            
            {/* Blur Slider */}
            <div className="space-y-3">
              <div className="flex justify-between text-xs items-center">
                <label className="text-slate-300 font-medium">Blur Strength</label>
                <span className="bg-slate-800 px-2 py-0.5 rounded text-cyan-400 font-mono">{blurRadius}px</span>
              </div>
              <input 
                type="range" min="1" max="20" step="1" 
                value={blurRadius} onChange={(e) => setBlurRadius(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500 hover:accent-cyan-400 transition-all"
              />
              <button 
                onClick={() => applyEffect('blur')} 
                disabled={!imageSrc} 
                className="w-full py-2.5 bg-slate-800 hover:bg-cyan-900/30 border border-slate-700 hover:border-cyan-500/50 text-cyan-400 text-xs font-bold rounded-lg uppercase tracking-widest transition-all duration-200 active:scale-95 disabled:opacity-50"
              >
                Apply Blur
              </button>
            </div>

            {/* Brightness Slider */}
            <div className="space-y-3 pt-2 border-t border-slate-800">
              <div className="flex justify-between text-xs items-center">
                <label className="text-slate-300 font-medium">Brightness</label>
                <span className="bg-slate-800 px-2 py-0.5 rounded text-yellow-400 font-mono">{Math.round(brightness * 100)}%</span>
              </div>
              <input 
                type="range" min="0" max="3" step="0.1" 
                value={brightness} onChange={(e) => setBrightness(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-yellow-500 hover:accent-yellow-400 transition-all"
              />
              <button 
                onClick={() => applyEffect('brightness')} 
                disabled={!imageSrc} 
                className="w-full py-2.5 bg-slate-800 hover:bg-yellow-900/30 border border-slate-700 hover:border-yellow-500/50 text-yellow-400 text-xs font-bold rounded-lg uppercase tracking-widest transition-all duration-200 active:scale-95 disabled:opacity-50"
              >
                Apply Brightness
              </button>
            </div>
          </div>

        </div>

        {/* CANVAS AREA (Right) */}
        <div className="lg:col-span-8 bg-slate-950/50 rounded-2xl border-2 border-dashed border-slate-800 flex items-center justify-center overflow-hidden min-h-[600px] relative group transition-all duration-500 hover:border-slate-700/50 hover:shadow-2xl">
          {!imageSrc ? (
            <div className="text-center p-12 text-slate-600 flex flex-col items-center gap-6 animate-in fade-in zoom-in duration-500">
              <div className="relative">
                <div className="absolute -inset-4 bg-cyan-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="w-24 h-24 bg-slate-900 rounded-3xl flex items-center justify-center border border-slate-800 shadow-2xl relative z-10 group-hover:scale-110 transition-transform duration-500">
                  <ImageIcon className="w-10 h-10 opacity-50 group-hover:opacity-100 group-hover:text-cyan-400 transition-all duration-500" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xl font-bold text-slate-300">No Image Loaded</p>
                <p className="text-sm text-slate-500">Upload an image to ignite the engine</p>
              </div>
            </div>
          ) : (
            <div className="relative w-full h-full flex items-center justify-center p-4 animate-in fade-in zoom-in duration-500">
              <canvas 
                ref={canvasRef}
                className="max-w-full max-h-[700px] object-contain shadow-2xl rounded-lg transition-all duration-300"
              />
            </div>
          )}
          
          {/* Modern Processing Overlay */}
          <div 
            className={`absolute inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center z-20 transition-opacity duration-300 ${isProcessing ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
          >
             <div className="bg-slate-900 p-6 rounded-2xl shadow-2xl border border-slate-800 flex flex-col items-center gap-4 animate-in zoom-in-95 duration-200">
               <div className="relative w-12 h-12">
                 <div className="absolute inset-0 border-4 border-slate-800 rounded-full"></div>
                 <div className="absolute inset-0 border-4 border-t-cyan-500 border-r-cyan-500 border-b-transparent border-l-transparent rounded-full animate-spin"></div>
               </div>
               <div className="text-center">
                 <p className="text-white font-bold tracking-wide">PROCESSING</p>
                 <p className="text-cyan-500 text-xs font-mono mt-1">WASM::COMPUTE</p>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}