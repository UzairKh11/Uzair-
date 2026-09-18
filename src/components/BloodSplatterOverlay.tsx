import React, { useEffect, useState } from "react";
import { Skull, Droplets } from "lucide-react";

interface BloodSplatterOverlayProps {
  isActive: boolean;
  victimName?: string;
  causeOfDeath?: string;
  onAnimationComplete?: () => void;
}

export const BloodSplatterOverlay: React.FC<BloodSplatterOverlayProps> = ({
  isActive,
  victimName,
  causeOfDeath,
  onAnimationComplete,
}) => {
  const [shouldRender, setShouldRender] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    if (isActive) {
      setShouldRender(true);
      setAnimationKey((prev) => prev + 1);

      const timer = setTimeout(() => {
        setShouldRender(false);
        if (onAnimationComplete) {
          onAnimationComplete();
        }
      }, 5500);

      return () => clearTimeout(timer);
    }
  }, [isActive, onAnimationComplete]);

  if (!shouldRender) return null;

  return (
    <div
      id="blood-splatter-overlay-root"
      key={animationKey}
      className="fixed inset-0 z-50 pointer-events-none select-none overflow-hidden flex items-center justify-center animate-blood-shake"
    >
      {/* 1. Visceral crimson screen flash */}
      <div
        id="blood-flash-backdrop"
        className="absolute inset-0 animate-blood-screen-flash"
      />

      {/* 2. Top Dripping Blood Tendrils across viewport ceiling */}
      <div
        id="blood-dripping-curtain"
        className="absolute top-0 left-0 right-0 h-48 flex justify-between overflow-hidden animate-blood-drip"
      >
        <svg
          className="w-full h-full text-red-950/90 fill-current drop-shadow-[0_4px_12px_rgba(220,38,38,0.7)]"
          preserveAspectRatio="none"
          viewBox="0 0 1200 160"
        >
          <path d="M0,0 L1200,0 L1200,30 Q1150,90 1130,40 Q1100,140 1080,45 Q1040,110 1010,35 Q960,150 930,30 Q880,100 850,25 Q800,165 770,40 Q710,120 680,30 Q630,170 600,45 Q550,110 520,35 Q470,160 440,30 Q390,95 360,25 Q320,150 290,40 Q240,110 210,30 Q160,165 130,45 Q90,90 60,25 Q30,120 0,35 Z" />
        </svg>
      </div>

      {/* 3. Corner Splatters */}
      {/* Top Left arterial splash */}
      <div className="absolute top-0 left-0 w-80 h-80 opacity-90 animate-blood-splatter-impact">
        <svg viewBox="0 0 200 200" className="w-full h-full fill-red-800 drop-shadow-[0_0_15px_#450a0a]">
          <path d="M10,10 Q50,90 95,45 Q130,80 150,20 Q120,10 60,5 Z" />
          <circle cx="120" cy="110" r="14" />
          <circle cx="155" cy="85" r="9" />
          <circle cx="170" cy="130" r="6" />
          <circle cx="85" cy="140" r="11" />
          <circle cx="40" cy="160" r="8" />
          <path d="M60,60 Q110,180 105,210 Q95,180 50,70 Z" />
        </svg>
      </div>

      {/* Top Right arterial splash */}
      <div className="absolute top-0 right-0 w-80 h-80 opacity-90 rotate-90 animate-blood-splatter-impact">
        <svg viewBox="0 0 200 200" className="w-full h-full fill-red-900 drop-shadow-[0_0_15px_#7f1d1d]">
          <path d="M15,15 Q65,100 110,40 Q145,95 170,15 Q125,5 50,5 Z" />
          <circle cx="135" cy="120" r="16" />
          <circle cx="160" cy="90" r="10" />
          <circle cx="95" cy="155" r="12" />
          <circle cx="50" cy="170" r="7" />
        </svg>
      </div>

      {/* Bottom Right heavy puddle impact */}
      <div className="absolute bottom-0 right-0 w-96 h-96 opacity-95 rotate-180 animate-blood-splatter-impact">
        <svg viewBox="0 0 300 300" className="w-full h-full fill-[#660000] drop-shadow-[0_0_20px_#991b1b]">
          <path d="M20,20 Q110,150 180,60 Q230,140 280,30 Q210,10 80,10 Z" />
          <circle cx="210" cy="180" r="22" />
          <circle cx="250" cy="140" r="15" />
          <circle cx="160" cy="230" r="18" />
          <circle cx="110" cy="260" r="12" />
          <circle cx="270" cy="220" r="9" />
          <path d="M120,90 Q190,260 175,290 Q160,250 100,100 Z" />
        </svg>
      </div>

      {/* Bottom Left splash */}
      <div className="absolute bottom-0 left-0 w-80 h-80 opacity-90 -rotate-90 animate-blood-splatter-impact">
        <svg viewBox="0 0 200 200" className="w-full h-full fill-red-950 drop-shadow-[0_0_15px_#450a0a]">
          <path d="M10,10 Q60,95 105,35 Q140,85 165,15 Q115,5 45,5 Z" />
          <circle cx="125" cy="115" r="13" />
          <circle cx="150" cy="80" r="8" />
          <circle cx="80" cy="145" r="10" />
        </svg>
      </div>

      {/* 4. Massive Center Explosive Blood Burst */}
      <div
        id="blood-center-burst"
        className="relative w-[500px] h-[500px] max-w-[90vw] max-h-[90vw] animate-blood-splatter-impact flex items-center justify-center"
      >
        <svg
          viewBox="0 0 500 500"
          className="absolute inset-0 w-full h-full fill-red-700/95 drop-shadow-[0_0_35px_rgba(239,68,68,0.9)]"
        >
          {/* Main jagged impact core */}
          <path d="M250,180 C275,120 320,130 330,170 C360,150 400,180 380,220 C420,240 430,285 390,310 C420,350 385,395 340,380 C320,425 270,415 250,380 C220,420 175,410 160,370 C120,390 90,350 115,310 C80,285 85,235 125,220 C105,175 150,150 175,170 C190,125 235,130 250,180 Z" />

          {/* Radiating arterial spikes */}
          <path d="M250,180 Q255,40 260,20 Q245,50 240,180 Z" />
          <path d="M330,170 Q430,70 455,50 Q415,100 330,180 Z" />
          <path d="M380,220 Q485,220 510,225 Q470,235 385,230 Z" />
          <path d="M390,310 Q480,380 505,400 Q465,360 385,320 Z" />
          <path d="M340,380 Q365,475 375,500 Q350,460 330,385 Z" />
          <path d="M250,380 Q240,480 235,505 Q245,465 255,385 Z" />
          <path d="M160,370 Q75,460 50,485 Q90,430 165,375 Z" />
          <path d="M115,310 Q20,325 -5,330 Q25,305 120,300 Z" />
          <path d="M125,220 Q30,150 5,130 Q45,170 130,215 Z" />
          <path d="M175,170 Q105,75 80,50 Q120,100 180,165 Z" />

          {/* Dispersed high-velocity droplets */}
          <circle cx="280" cy="55" r="14" />
          <circle cx="395" cy="75" r="10" />
          <circle cx="465" cy="140" r="12" />
          <circle cx="475" cy="275" r="16" />
          <circle cx="450" cy="415" r="11" />
          <circle cx="370" cy="460" r="15" />
          <circle cx="225" cy="470" r="13" />
          <circle cx="110" cy="445" r="16" />
          <circle cx="35" cy="380" r="11" />
          <circle cx="40" cy="245" r="14" />
          <circle cx="65" cy="115" r="12" />
          <circle cx="150" cy="55" r="15" />

          {/* Micro splatter mist */}
          <circle cx="305" cy="95" r="5" />
          <circle cx="420" cy="180" r="6" />
          <circle cx="430" cy="335" r="5" />
          <circle cx="300" cy="445" r="6" />
          <circle cx="170" cy="440" r="5" />
          <circle cx="80" cy="360" r="6" />
          <circle cx="75" cy="190" r="5" />
          <circle cx="205" cy="85" r="6" />
        </svg>

        {/* 5. Terrifying Death Execution Stamp */}
        <div
          id="blood-death-stamp"
          className="relative z-10 text-center px-6 py-4 rounded-lg bg-black/85 border-2 border-red-600/90 shadow-[0_0_50px_rgba(220,38,38,0.95)] animate-blood-stamp"
        >
          <div className="flex items-center justify-center gap-2 mb-1">
            <Skull className="w-6 h-6 text-red-500 animate-pulse" />
            <span className="font-horror-drip text-red-500 text-lg sm:text-2xl tracking-widest uppercase">
              DEATH EXECUTED
            </span>
            <Skull className="w-6 h-6 text-red-500 animate-pulse" />
          </div>

          <div className="font-serif text-white font-bold text-xl sm:text-3xl tracking-wider text-shadow-red">
            {victimName || "TARGET ELIMINATED"}
          </div>

          {causeOfDeath && (
            <div className="mt-1 font-parchment text-xs sm:text-sm text-red-300 italic tracking-wide">
              Cause: {causeOfDeath}
            </div>
          )}

          <div className="mt-2 text-[10px] uppercase font-mono tracking-[0.25em] text-red-400/80">
            Shinigami Covenant Fulfilled
          </div>
        </div>
      </div>
    </div>
  );
};
