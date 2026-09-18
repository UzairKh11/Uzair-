import React, { useEffect } from "react";
import { Skull, AlertTriangle } from "lucide-react";
import { ExecutionRecord } from "../types";

interface EerieConfirmationOverlayProps {
  record: ExecutionRecord;
  onDismiss: () => void;
}

export const EerieConfirmationOverlay: React.FC<EerieConfirmationOverlayProps> = ({
  record,
  onDismiss,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, 2800); // 2.8s intense horror reveal then seamless transition to countdown

    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div
      id="eerie-confirmation-modal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-300"
    >
      {/* Glitch & Red Thunder Flash Overlay */}
      <div className="absolute inset-0 bg-red-950/40 pointer-events-none animate-eerie-flicker" />

      {/* Death Note Leather Cover & Parchment Page */}
      <div className="relative w-full max-w-lg bg-[#0a0a0a] border-2 border-red-700/80 rounded-lg p-6 sm:p-8 shadow-[0_0_80px_rgba(220,38,38,0.9)] text-center animate-glitch">
        {/* Top Warning */}
        <div className="flex items-center justify-center gap-2 text-red-500 text-xs font-serif tracking-widest uppercase mb-3">
          <AlertTriangle className="w-4 h-4 animate-bounce" />
          <span>FATE INSCRIBED INTO DEATH NOTE</span>
          <AlertTriangle className="w-4 h-4 animate-bounce" />
        </div>

        {/* Japanese Shinigami Seal */}
        <div className="font-serif text-xs text-red-700/90 tracking-widest mb-4">
          死神契約完了 • CONTRACT BOUND IN BLOOD
        </div>

        {/* Written Target Name in fresh dripping blood ink */}
        <div className="py-4 border-y border-red-900/60 my-2 bg-black/70 rounded">
          <span className="text-xs font-serif text-neutral-400 block mb-1">
            Victim's True Name:
          </span>
          <h3 className="font-horror-drip text-3xl sm:text-4xl text-red-500 tracking-wider drop-shadow-[0_0_20px_rgba(239,68,68,1)]">
            {record.targetName}
          </h3>
          <p className="text-sm font-serif text-neutral-300 mt-2">
            Cause: <span className="text-red-400 font-bold">{record.causeOfDeath}</span>
          </p>
          <p className="text-xs font-parchment text-neutral-400 mt-1">
            Execution In: <span className="text-red-300 font-mono font-bold">{record.parsedDurationText}</span>
          </p>
        </div>

        {/* Shinigami verdict quote */}
        <p className="font-parchment text-xs sm:text-sm text-neutral-300 italic mt-4 px-2 leading-relaxed">
          "{record.shinigamiVerdict}"
        </p>

        {/* Reverse countdown initiation note */}
        <div className="mt-6 flex items-center justify-center gap-2 text-red-400 text-xs font-serif animate-pulse">
          <Skull className="w-4 h-4" />
          <span>REVERSE COUNTDOWN COMMENCING NOW...</span>
        </div>

        {/* Skip button if user wants to see countdown immediately */}
        <button
          onClick={onDismiss}
          className="mt-4 text-[11px] font-serif text-neutral-500 hover:text-red-300 underline tracking-wider"
        >
          [View Live Countdown Immediately]
        </button>
      </div>
    </div>
  );
};
