import { useEffect, useState } from 'react';

export function SplashScreen() {
  const [show, setShow] = useState(true);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const hasSeenSplash = sessionStorage.getItem('hasSeenSplash');
    
    if (hasSeenSplash) {
      setShow(false);
      return;
    }

    // Start fading out after 3 seconds for a longer, majestic presence
    const fadeTimer = setTimeout(() => {
      setFade(true);
    }, 3000);

    // Completely remove from DOM after 3.8 seconds (0.8s for the smooth fade out transition)
    const removeTimer = setTimeout(() => {
      setShow(false);
      sessionStorage.setItem('hasSeenSplash', 'true');
    }, 3800);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!show) return null;

  return (
    <div 
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center transition-all duration-1000 ease-in-out ${
        fade ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
      style={{
        background: 'radial-gradient(circle at center, #1e293b 0%, #020617 100%)'
      }}
    >
      <div className="relative flex flex-col items-center">
        {/* Glow effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/20 rounded-full blur-[60px] animate-pulse pointer-events-none"></div>
        
        {/* Logo Container with slow continuous zoom */}
        <div className="animate-[slowZoom_4s_ease-out_forwards] z-10 drop-shadow-2xl">
          <img 
            src="/logo.png" 
            alt="CEAC Logo" 
            className="w-48 md:w-56 h-auto object-contain animate-in fade-in zoom-in-75 duration-1000" 
          />
        </div>
        
        {/* Loading Text & Bar */}
        <div className="mt-12 flex flex-col items-center space-y-4 z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
          <span className="text-slate-300 text-xs md:text-sm font-semibold tracking-[0.3em] uppercase opacity-80">
            Centro Educativo Adventista
          </span>
          
          {/* Glassmorphism Progress Bar */}
          <div className="h-1.5 w-48 bg-white/10 backdrop-blur-sm rounded-full overflow-hidden border border-white/5 shadow-inner">
            <div className="h-full bg-gradient-to-r from-blue-600 via-amber-500 to-amber-300 w-full animate-[shimmer_2s_infinite] rounded-full relative overflow-hidden">
              <div className="absolute inset-0 bg-white/20 animate-[progressGlow_1.5s_infinite]"></div>
            </div>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes progressGlow {
          0% { opacity: 0; }
          50% { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes slowZoom {
          0% { transform: scale(1); }
          100% { transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
}
