import React, { useState, useRef } from "react";
import { Feather, Skull, Sparkles } from "lucide-react";
import { horrorAudio } from "../utils/audioSynth";

interface BottomCommandBarProps {
  onSubmitCommand: (command: string) => Promise<void>;
  isProcessing: boolean;
}

export const BottomCommandBar: React.FC<BottomCommandBarProps> = ({
  onSubmitCommand,
  isProcessing,
}) => {
  const [command, setCommand] = useState("");
  const lastSoundTriggerRef = useRef<number>(0);

  const samplePresets = [
    "Eliminate Lind L. Tailor in 40 seconds by sudden heart attack",
    "Eliminate corrupt crime syndicate boss in 1 minute by cardiac arrest",
    "Eliminate rogue thief in 30 seconds by sudden fatal collision",
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCommand(val);

    // User requested: "jaise Ham Kisi ka name put Karen niche bottom mein search bar mein to tab bhi ek Badi gandi awaaz hai"
    const now = Date.now();
    if (val.trim().length >= 3 && now - lastSoundTriggerRef.current > 2000) {
      lastSoundTriggerRef.current = now;
      horrorAudio.playDemonicNameInscription();
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!command.trim() || isProcessing) return;

    horrorAudio.playPenScratch();
    // User requested: "subtle, distorted whisper sound effect to play immediately after the user submits a name in the bottom input bar, simulating the Shinigami acknowledging the new target"
    horrorAudio.playShinigamiWhisperAcknowledgement(command);
    horrorAudio.playDemonicNameInscription();
    await onSubmitCommand(command);
    setCommand("");
  };

  const handleSelectPreset = (preset: string) => {
    setCommand(preset);
    horrorAudio.playShinigamiWhisperAcknowledgement();
    horrorAudio.playDemonicNameInscription();
  };

  return (
    <div
      id="evil-bottom-search-section"
      className="fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-t from-black via-[#080202] to-[#0d0404]/95 border-t-2 border-red-800/80 shadow-[0_-10px_35px_rgba(185,28,28,0.35)] backdrop-blur-lg px-4 pt-2.5 pb-4"
    >
      {/* Top dripping blood line highlight */}
      <div className="absolute -top-[2px] left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-red-500 to-transparent" />

      <div className="max-w-4xl mx-auto">
        {/* Quick sinister prompt suggestions */}
        <div className="flex items-center gap-2 mb-2 overflow-x-auto no-scrollbar text-xs font-serif py-0.5">
          <span className="text-[11px] text-red-500/80 uppercase tracking-widest whitespace-nowrap flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-red-400" />
            Sinister Presets:
          </span>
          {samplePresets.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelectPreset(preset)}
              className="text-neutral-400 hover:text-red-200 bg-neutral-950/80 hover:bg-red-950/40 border border-neutral-800 hover:border-red-800/70 px-2.5 py-1 rounded-sm text-[11px] whitespace-nowrap transition-colors"
            >
              {preset.length > 38 ? preset.substring(0, 38) + "..." : preset}
            </button>
          ))}
        </div>

        {/* Glowing Crimson Input Form */}
        <form onSubmit={handleSubmit} className="relative flex items-center gap-2 sm:gap-3">
          {/* Evil Search/Input Bar */}
          <div className="relative flex-1 group">
            {/* Input icon */}
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-red-600/70 pointer-events-none group-focus-within:text-red-400 transition-colors">
              <Feather className="w-4 h-4 transform -rotate-45" />
            </div>

            <input
              id="evil-command-input"
              type="text"
              value={command}
              onChange={handleInputChange}
              onFocus={() => {
                if (command.trim().length > 0 && Date.now() - lastSoundTriggerRef.current > 1500) {
                  lastSoundTriggerRef.current = Date.now();
                  horrorAudio.playDemonicNameInscription();
                }
              }}
              placeholder="e.g. Eliminate Lind L. Tailor in 40 seconds by a sudden heart attack..."
              disabled={isProcessing}
              className="w-full bg-[#050505] text-neutral-100 placeholder-neutral-600 border border-red-900/60 focus:border-red-500 focus:ring-1 focus:ring-red-500 rounded-md py-3 pl-10 pr-4 font-serif text-sm sm:text-base shadow-[inset_0_2px_8px_rgba(0,0,0,0.8)] focus:shadow-[0_0_20px_rgba(220,38,38,0.5)] transition-all duration-200 outline-none"
            />
          </div>

          {/* Horrifying "Write Name" Button */}
          <button
            id="btn-write-name"
            type="submit"
            disabled={isProcessing || !command.trim()}
            className={`relative px-4 sm:px-6 py-3 rounded-md font-gothic-title font-bold text-xs sm:text-sm tracking-wider uppercase flex items-center gap-2 border transition-all duration-300 select-none flex-shrink-0 ${
              isProcessing || !command.trim()
                ? "bg-neutral-900/80 border-neutral-800 text-neutral-600 cursor-not-allowed"
                : "bg-gradient-to-r from-red-900 via-red-700 to-red-600 text-neutral-100 border-red-500 shadow-[0_0_20px_rgba(220,38,38,0.85)] hover:shadow-[0_0_30px_rgba(239,68,68,1)] hover:scale-[1.02] active:scale-[0.98]"
            }`}
          >
            {isProcessing ? (
              <>
                <Skull className="w-4 h-4 text-red-300 animate-spin" />
                <span className="animate-pulse">Inscribing...</span>
              </>
            ) : (
              <>
                <Skull className="w-4 h-4 text-red-200" />
                <span>Write Name</span>
              </>
            )}
          </button>
        </form>

        {/* Sub-label under bar */}
        <div className="flex items-center justify-between mt-1 text-[10px] text-neutral-500 font-parchment">
          <span>The notebook takes effect within specified duration</span>
          <span className="text-red-700">SHINIGAMI SEAL</span>
        </div>
      </div>
    </div>
  );
};
