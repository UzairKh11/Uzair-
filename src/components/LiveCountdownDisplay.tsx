import React, { useEffect, useState, useRef } from "react";
import { ExecutionRecord } from "../types";
import { Clock, Skull, HeartPulse, Flame, AlertOctagon, CheckCircle2, Trash2 } from "lucide-react";
import { horrorAudio } from "../utils/audioSynth";

interface LiveCountdownDisplayProps {
  records: ExecutionRecord[];
  activeRecordId: string | null;
  onSelectRecord: (id: string) => void;
  onDeleteRecord: (id: string) => void;
  shinigamiEyesActive: boolean;
  onTriggerBloodSplatter?: (victimName: string, cause?: string) => void;
}

export const LiveCountdownDisplay: React.FC<LiveCountdownDisplayProps> = ({
  records,
  activeRecordId,
  onSelectRecord,
  onDeleteRecord,
  shinigamiEyesActive,
  onTriggerBloodSplatter,
}) => {
  const activeRecord = records.find((r) => r.id === activeRecordId) || records[0];
  const [now, setNow] = useState<number>(Date.now());
  const heartbeatTickRef = useRef<number>(0);

  // Update timer every second
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 250); // fast interval for smooth ticking & heartbeats

    return () => clearInterval(interval);
  }, []);

  // Sound heartbeat, real agonizing human dying voice, and blood splatter trigger
  useEffect(() => {
    if (!activeRecord) return;

    const elapsedSeconds = Math.floor((now - activeRecord.createdAt) / 1000);
    const remainingSeconds = Math.max(0, activeRecord.totalSeconds - elapsedSeconds);
    const isZero = remainingSeconds === 0;

    if (isZero) {
      if (heartbeatTickRef.current !== -1) {
        heartbeatTickRef.current = -1;
        // User requested: "real humans voice add karo... aisi ke jaise insan tadap Raha Hun marne wala set karo"
        horrorAudio.playRealHumanAgonyDyingVoice(activeRecord.targetName);
        // User requested: "triggers a 'blood splatter' overlay on the screen exactly when the reverse countdown reaches zero"
        if (onTriggerBloodSplatter) {
          onTriggerBloodSplatter(activeRecord.targetName, activeRecord.causeOfDeath);
        }
      }
      return;
    }

    // Play heartbeat periodically based on urgency
    const currentTick = Math.floor(now / (remainingSeconds <= 10 ? 500 : 1000));
    if (currentTick !== heartbeatTickRef.current) {
      heartbeatTickRef.current = currentTick;
      const intensity = remainingSeconds <= 10 ? 1.6 : 1.0;
      horrorAudio.playHeartbeat(intensity);
    }
  }, [now, activeRecord, onTriggerBloodSplatter]);

  // If no victim has been inscribed yet, show atmospheric awaiting state
  if (!activeRecord) {
    return (
      <div
        id="live-reverse-countdown-container"
        className="relative my-8 p-6 sm:p-8 rounded-xl bg-gradient-to-b from-[#0e0a0a] to-[#050303] border border-red-950/70 shadow-[0_0_35px_rgba(0,0,0,0.9)] text-center overflow-hidden"
      >
        <div className="absolute inset-0 pointer-events-none opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-600 via-transparent to-transparent" />
        
        <div className="flex items-center justify-center gap-2 mb-3">
          <Skull className="w-5 h-5 text-red-600 animate-pulse" />
          <span className="text-xs font-serif uppercase tracking-[0.3em] text-red-500/90 font-bold">
            Death Note Blank Page • Awaiting Sacrifice
          </span>
          <Skull className="w-5 h-5 text-red-600 animate-pulse" />
        </div>

        <h3 className="font-gothic-title text-2xl sm:text-3xl text-neutral-200 tracking-wider mb-2">
          No Name Has Been Inscribed Yet
        </h3>

        <p className="max-w-lg mx-auto text-neutral-400 font-parchment text-sm sm:text-base leading-relaxed mb-6">
          The notebook of the Shinigami is currently pristine. Enter any victim's name in the bottom search bar below (e.g. <span className="text-red-400 font-semibold italic">"Eliminate Lind L. Tailor in 40 seconds by sudden heart attack"</span>) to seal their fate and initiate their live reverse countdown.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => {
              const input = document.getElementById("evil-command-input");
              if (input) input.focus();
            }}
            className="px-5 py-2.5 rounded-sm bg-gradient-to-r from-red-950 via-red-900/60 to-red-950 hover:from-red-900 hover:to-red-900 border border-red-700/80 text-red-200 text-xs sm:text-sm font-serif flex items-center gap-2 hover:text-red-100 transition-all cursor-pointer shadow-[0_0_15px_rgba(220,38,38,0.4)] hover:shadow-[0_0_25px_rgba(239,68,68,0.7)]"
          >
            <Flame className="w-4 h-4 text-red-500 animate-pulse" />
            <span>Write a Name in Bottom Bar to Inscribe</span>
          </button>
        </div>
      </div>
    );
  }

  // Calculate live remaining seconds
  const elapsedSeconds = Math.floor((now - activeRecord.createdAt) / 1000);
  const remainingSeconds = Math.max(0, activeRecord.totalSeconds - elapsedSeconds);
  const isZero = remainingSeconds === 0;

  // Format time into HH:MM:SS or MM:SS
  const formatTime = (secs: number) => {
    const d = Math.floor(secs / 86400);
    const h = Math.floor((secs % 86400) / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;

    const pad = (n: number) => n.toString().padStart(2, "0");

    if (d > 0) {
      return `${d}d ${pad(h)}:${pad(m)}:${pad(s)}`;
    }
    if (h > 0) {
      return `${pad(h)}:${pad(m)}:${pad(s)}`;
    }
    return `${pad(m)}:${pad(s)}`;
  };

  const progressPercent = Math.min(
    100,
    Math.max(0, ((activeRecord.totalSeconds - remainingSeconds) / activeRecord.totalSeconds) * 100)
  );

  return (
    <div
      id="live-reverse-countdown-container"
      className="relative w-full max-w-3xl mx-auto my-6 px-4 z-20"
    >
      {/* Intense Glowing Blood-Red Execution Banner */}
      <div
        className={`relative rounded-xl border p-6 sm:p-8 transition-all duration-500 overflow-hidden ${
          isZero
            ? "border-red-600/90 bg-gradient-to-b from-[#1a0000] via-[#0d0101] to-[#050000] shadow-[0_0_60px_rgba(220,38,38,0.7)]"
            : "border-red-800/80 bg-gradient-to-b from-[#120606]/95 via-[#080303]/98 to-[#020202] shadow-[0_0_50px_rgba(185,28,28,0.5),inset_0_0_25px_rgba(185,28,28,0.2)] animate-blood-pulse"
        }`}
      >
        {/* Background Shinigami Shadow & Eye Glow */}
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-red-900/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-red-900/15 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header: Status & Death Note Page stamp */}
        <div className="flex items-center justify-between border-b border-red-900/40 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <Skull className="w-5 h-5 text-red-500 animate-pulse" />
            <span className="font-gothic-title text-sm tracking-widest text-red-300 uppercase">
              Death Note Ledger Entry
            </span>
          </div>

          {/* Life status badge */}
          <div
            className={`px-3 py-1 rounded-full text-xs font-serif tracking-wider flex items-center gap-1.5 border ${
              isZero
                ? "bg-red-900/90 text-red-100 border-red-500 shadow-[0_0_15px_#dc2626]"
                : "bg-red-950/60 text-red-400 border-red-800/70"
            }`}
          >
            {isZero ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-red-400" />
                <span className="font-bold">FATE EXECUTED • DECEASED</span>
              </>
            ) : (
              <>
                <HeartPulse className="w-3.5 h-3.5 text-red-500 animate-ping" />
                <span>PULSE WEAKENING • ACTIVE</span>
              </>
            )}
          </div>
        </div>

        {/* Middle Section: Target Name & Cause of Death */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Target inscriber */}
          <div className="bg-black/50 p-4 rounded-lg border border-red-950/70">
            <span className="text-[11px] font-serif text-neutral-500 tracking-wider uppercase block mb-1">
              Target Soul Inscribed
            </span>
            <div className="flex items-center gap-3">
              <span
                id="active-target-name"
                className="font-horror-drip text-2xl sm:text-3xl text-red-500 tracking-wider drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]"
              >
                {activeRecord.targetName}
              </span>
              {shinigamiEyesActive && (
                <span className="text-[11px] font-mono text-red-400 bg-red-950/80 px-2 py-0.5 rounded border border-red-700/60 animate-pulse">
                  Lifespan: 00:00:{remainingSeconds.toString().padStart(2, "0")}
                </span>
              )}
            </div>
            <p className="text-xs text-neutral-400 font-parchment mt-2">
              Command: "{activeRecord.command}"
            </p>
          </div>

          {/* Cause of death */}
          <div className="bg-black/50 p-4 rounded-lg border border-red-950/70">
            <span className="text-[11px] font-serif text-neutral-500 tracking-wider uppercase block mb-1">
              Decreed Cause of Death
            </span>
            <div className="text-base sm:text-lg font-serif font-bold text-neutral-200 tracking-wide flex items-center gap-2">
              <Flame className="w-4 h-4 text-red-500 flex-shrink-0" />
              <span>{activeRecord.causeOfDeath}</span>
            </div>
            <p className="text-xs text-neutral-400 font-parchment mt-2">
              Delay: {activeRecord.parsedDurationText} from inscription
            </p>
          </div>
        </div>

        {/* The Live Reverse Countdown Display */}
        <div className="my-6 text-center py-4 bg-black/80 rounded-xl border border-red-900/60 shadow-[inset_0_0_35px_rgba(138,3,3,0.3)]">
          <div className="flex items-center justify-center gap-2 mb-2 text-xs font-serif text-red-400/90 uppercase tracking-widest">
            <Clock className={`w-4 h-4 ${isZero ? "text-neutral-500" : "text-red-500 animate-spin"}`} />
            <span>Reverse Countdown to Elimination</span>
          </div>

          {/* The Glowing Blood-Red Reverse Digits */}
          <div
            id="reverse-countdown-timer-value"
            className={`font-mono text-5xl sm:text-7xl md:text-8xl font-black tracking-tight select-none transition-all duration-300 ${
              isZero
                ? "text-red-600 drop-shadow-[0_0_30px_rgba(220,38,38,1)] animate-glitch"
                : remainingSeconds <= 10
                ? "text-red-500 drop-shadow-[0_0_35px_rgba(239,68,68,0.95)] animate-pulse"
                : "text-red-500 drop-shadow-[0_0_25px_rgba(220,38,38,0.85)]"
            }`}
          >
            {formatTime(remainingSeconds)}
          </div>

          {/* Sub-label under countdown */}
          <div className="text-xs font-parchment text-neutral-400 mt-2">
            {isZero ? (
              <span className="text-red-400 font-bold tracking-widest uppercase animate-pulse">
                [ HEART CEASED TO BEAT • FATE CONSUMMATED ]
              </span>
            ) : remainingSeconds <= 10 ? (
              <span className="text-red-400 font-bold uppercase animate-ping">
                CRITICAL CARDIAC COLLAPSE IMMINENT
              </span>
            ) : (
              <span>Timer ticking backwards to inevitable fate</span>
            )}
          </div>

          {/* Progress Bar with Blood-Red Gradient */}
          <div className="w-5/6 mx-auto mt-5 bg-neutral-950 h-3 rounded-full overflow-hidden border border-red-950 p-0.5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-red-900 via-red-600 to-red-500 transition-all duration-300 shadow-[0_0_12px_rgba(220,38,38,0.8)]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Shinigami Ryuk's Verdict Box */}
        <div className="relative p-4 rounded-lg bg-red-950/20 border-l-4 border-red-600 text-neutral-300 font-parchment text-sm leading-relaxed mb-4">
          <div className="text-[11px] font-serif text-red-500 font-bold tracking-widest uppercase mb-1 flex items-center gap-1.5">
            <AlertOctagon className="w-3.5 h-3.5" />
            <span>Shinigami Proclamation</span>
          </div>
          <p className="italic text-neutral-200">"{activeRecord.shinigamiVerdict}"</p>
        </div>

        {/* Multiple Records Selector if more than 1 entry */}
        {records.length > 1 && (
          <div className="mt-4 pt-4 border-t border-neutral-800">
            <div className="text-xs font-serif text-neutral-400 mb-2">
              All Inscribed Victims in Death Note ({records.length}):
            </div>
            <div className="flex flex-wrap gap-2">
              {records.map((rec) => {
                const recRemaining = Math.max(0, rec.totalSeconds - Math.floor((now - rec.createdAt) / 1000));
                const recZero = recRemaining === 0;
                return (
                  <button
                    key={rec.id}
                    onClick={() => onSelectRecord(rec.id)}
                    className={`px-3 py-1.5 rounded text-xs font-serif flex items-center gap-2 border transition-all ${
                      rec.id === activeRecord.id
                        ? "bg-red-950 border-red-500 text-red-200 shadow-[0_0_10px_rgba(220,38,38,0.5)]"
                        : "bg-black/60 border-neutral-800 text-neutral-400 hover:text-red-300 hover:border-red-900"
                    }`}
                  >
                    <span>{rec.targetName}</span>
                    <span className="font-mono text-[10px] text-red-400">
                      {recZero ? "DECEASED" : formatTime(recRemaining)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Delete / Clear button */}
        <div className="mt-4 flex justify-end">
          <button
            onClick={() => onDeleteRecord(activeRecord.id)}
            title="Erase name from current view"
            className="text-xs font-parchment text-neutral-500 hover:text-red-400 flex items-center gap-1 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Erase Inscription</span>
          </button>
        </div>
      </div>
    </div>
  );
};
