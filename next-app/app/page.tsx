import ImageEditor from '../components/ImageEditor';
import { Rocket, Sparkles } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 font-sans selection:bg-cyan-500/30">
      <main className="flex flex-col items-center pt-10 pb-20">
        
        {/* App Header & Logo */}
        <div className="text-center mb-12 relative z-10">
          
          {/* Logo Icon Composition */}
          <div className="relative inline-block mb-4 group cursor-default">
            {/* Glow Effect behind logo */}
            <div className="absolute -inset-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full blur opacity-20 group-hover:opacity-60 transition duration-500"></div>
            
            <div className="relative p-4 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex items-center justify-center overflow-hidden">
              {/* Speed lines background decoration */}
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#22d3ee_1px,transparent_1px)] [background-size:4px_4px]"></div>
              
              {/* The Rocket Icon */}
              <Rocket className="w-10 h-10 text-cyan-400 fill-cyan-950 transform group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform duration-300 ease-out z-10" />
              
              {/* Sparkle accent */}
              <Sparkles className="w-4 h-4 text-yellow-400 absolute top-2 right-2 animate-pulse" />
            </div>
          </div>
          
          {/* Text Logo */}
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter italic uppercase transform -skew-x-6">
            <span className="bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              Turbo
            </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 ml-2">
              Pixel
            </span>
          </h1>
          
          <p className="text-slate-400 text-lg font-medium tracking-wide mt-4 flex items-center justify-center gap-2">
            <span className="w-2 h-2 bg-cyan-500 rounded-full animate-ping"></span>
            High-Velocity WASM Image Processor
          </p>
        </div>

        {/* The Editor Component */}
        <ImageEditor />

      </main>
    </div>
  );
}