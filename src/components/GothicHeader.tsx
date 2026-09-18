import React, { useState } from "react";
import { Volume2, VolumeX, Eye, Flame, Skull } from "lucide-react";
import { horrorAudio } from "../utils/audioSynth";

interface GothicHeaderProps {
  shinigamiEyesActive: boolean;
  onToggleShinigamiEyes: () => void;
  onTriggerGlitch: () => void;
}

export const GothicHeader: React.FC<GothicHeaderProps> = ({
  shinigamiEyesActive,
  onToggleShinigamiEyes,
  onTriggerGlitch,
}) => {
  const [isMuted, setIsMuted] = useState(false);

  const handleToggleSound = () => {
    const muted = horrorAudio.toggleMute();
    setIsMuted(muted);
    if (!muted) {
      horrorAudio.startAmbientDrone();
    }
  };

  return (
    <header className="relative w-full text-center pt-8 pb-4 px-4 flex flex-col items-center">
      {/* Top utility row */}
      <div className="w-full max-w-4xl flex items-center justify-between mb-4 z-20">
        <div className="flex items-center gap-2 text-xs font-parchment tracking-widest text-red-700/80 uppercase">
          <Skull className="w-4 h-4 text-red-600 animate-pulse" />
          <span>Notebook of the Shinigami</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Direct Witch Shriek button */}
          <button
            type="button"
            onClick={() => horrorAudio.playWitchScream()}
            title="Play horrifying witch scream (Chudail ki cheekh)"
            className="px-2.5 py-1.5 text-xs font-serif rounded-sm border border-red-900/80 bg-red-950/40 text-red-300 hover:text-red-100 hover:bg-red-900/80 hover:border-red-500 transition-all flex items-center gap-1.5 shadow-[0_0_10px_rgba(220,38,38,0.3)] hover:shadow-[0_0_16px_rgba(239,68,68,0.8)]"
          >
            <Flame className="w-3.5 h-3.5 text-red-500 animate-pulse" />
            <span className="hidden xs:inline">Chudail ki cheekh</span>
            <span className="text-[10px] text-red-400 font-mono">(Scream)</span>
          </button>

          {/* Shinigami Eye deal toggle */}
          <button
            id="btn-shinigami-eyes"
            onClick={onToggleShinigamiEyes}
            title={shinigamiEyesActive ? "Deactivate Shinigami Eyes" : "Activate Shinigami Eyes (Trades half your lifespan)"}
            className={`px-3 py-1.5 text-xs font-serif rounded-sm border transition-all duration-300 flex items-center gap-1.5 ${
              shinigamiEyesActive
                ? "bg-red-950/80 border-red-500 text-red-200 shadow-[0_0_15px_rgba(220,38,38,0.8)]"
                : "bg-black/60 border-neutral-800 text-neutral-400 hover:text-red-300 hover:border-red-900"
            }`}
          >
            <Eye className={`w-3.5 h-3.5 ${shinigamiEyesActive ? "text-red-400 animate-pulse" : "text-neutral-500"}`} />
            <span className="hidden sm:inline">
              {shinigamiEyesActive ? "Shinigami Eyes [ACTIVE]" : "Shinigami Eyes"}
            </span>
          </button>

          {/* Sound Toggle */}
          <button
            id="btn-toggle-sound"
            onClick={handleToggleSound}
            title={isMuted ? "Unmute Horror Soundscapes" : "Mute Sound"}
            className="p-1.5 text-xs rounded-sm border border-neutral-800 bg-black/60 text-neutral-400 hover:text-red-400 hover:border-red-900 transition-colors"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-neutral-500" /> : <Volume2 className="w-4 h-4 text-red-500 animate-pulse" />}
          </button>
        </div>
      </div>

      {/* Prominent, eerie gothic title text: "Hi Everyone" */}
      <div className="relative group cursor-pointer" onClick={onTriggerGlitch}>
        {/* Blood splatter backdrop glow */}
        <div className="absolute -inset-6 bg-red-900/20 blur-2xl rounded-full pointer-events-none -z-10" />

        {/* Eerie Shinigami Japanese Sub-script */}
        <div className="text-red-600/70 text-xs tracking-[0.4em] font-serif uppercase mb-1">
          死神の領域へようこそ • REALM OF THE SHINIGAMI
        </div>

        {/* Prominent Gothic Title: "Hi Everyone" */}
        <h1
          id="death-note-main-title"
          className="font-gothic-title text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-wider text-transparent bg-clip-text bg-gradient-to-b from-neutral-100 via-neutral-300 to-red-600 drop-shadow-[0_0_25px_rgba(185,28,28,0.85)] animate-eerie-flicker select-none"
        >
          Hi Everyone
        </h1>

        {/* Realistic dripping blood accent under title */}
        <div className="flex items-center justify-center gap-3 my-2 text-red-600/80">
          <div className="h-[1px] w-16 bg-gradient-to-r from-transparent via-red-600 to-transparent" />
          <Flame className="w-4 h-4 text-red-600 animate-bounce" />
          <div className="h-[1px] w-16 bg-gradient-to-r from-transparent via-red-600 to-transparent" />
        </div>

        {/* Ominous subtitle */}
        <p className="font-parchment text-sm sm:text-base text-neutral-400 max-w-lg mx-auto tracking-wide">
          The human whose name is written in this note shall die.
        </p>
      </div>

      {/* Shinigami Eyes eerie red gaze manifestation if active */}
      {shinigamiEyesActive && (
        <div className="mt-3 flex items-center gap-6 justify-center animate-pulse">
          <div className="w-4 h-4 rounded-full bg-red-600 shadow-[0_0_20px_#ef4444] border border-red-300 animate-ping" />
          <span className="text-xs font-parchment text-red-400 tracking-widest uppercase">
            Lifespan and Target Souls are Visible
          </span>
          <div className="w-4 h-4 rounded-full bg-red-600 shadow-[0_0_20px_#ef4444] border border-red-300 animate-ping" />
        </div>
      )}
    </header>
  );
};
