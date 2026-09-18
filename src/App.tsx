import React, { useState, useEffect, useRef } from "react";
import { ExecutionRecord } from "./types";
import { BloodCanvas } from "./components/BloodCanvas";
import { GothicHeader } from "./components/GothicHeader";
import { RulesContainer } from "./components/RulesContainer";
import { LiveCountdownDisplay } from "./components/LiveCountdownDisplay";
import { BottomCommandBar } from "./components/BottomCommandBar";
import { EerieConfirmationOverlay } from "./components/EerieConfirmationOverlay";
import { BloodSplatterOverlay } from "./components/BloodSplatterOverlay";
import { horrorAudio } from "./utils/audioSynth";
import { Skull, Volume2, Flame, Droplets } from "lucide-react";

export default function App() {
  // Start with empty records so only names written by the user appear
  const [records, setRecords] = useState<ExecutionRecord[]>([]);
  const [activeRecordId, setActiveRecordId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [shinigamiEyesActive, setShinigamiEyesActive] = useState<boolean>(false);
  const [pendingConfirmation, setPendingConfirmation] = useState<ExecutionRecord | null>(null);
  const [isGlitching, setIsGlitching] = useState<boolean>(false);
  const [hasTriggeredIntroScream, setHasTriggeredIntroScream] = useState<boolean>(false);
  const [bloodSplatterActive, setBloodSplatterActive] = useState<boolean>(false);
  const [splatterVictim, setSplatterVictim] = useState<{ name: string; cause?: string } | null>(null);
  const hasPlayedRef = useRef(false);

  const handleTriggerBloodSplatter = (name: string, cause?: string) => {
    setSplatterVictim({ name, cause });
    setBloodSplatterActive(true);
    triggerGlitchEffect();
  };

  // Play horrifying witch shriek on opening the website
  useEffect(() => {
    // 1. Direct attempt
    try {
      horrorAudio.playWitchScream();
      horrorAudio.startAmbientDrone();
    } catch {
      // Browser may require user gesture
    }

    // 2. Global first-gesture listener to guarantee loud and clear playback in all browsers
    const handleFirstUserInteraction = () => {
      if (hasPlayedRef.current) return;
      hasPlayedRef.current = true;
      setHasTriggeredIntroScream(true);
      horrorAudio.playWitchScream();
      horrorAudio.startAmbientDrone();
    };

    window.addEventListener("click", handleFirstUserInteraction, { once: true });
    window.addEventListener("keydown", handleFirstUserInteraction, { once: true });
    window.addEventListener("touchstart", handleFirstUserInteraction, { once: true });

    return () => {
      window.removeEventListener("click", handleFirstUserInteraction);
      window.removeEventListener("keydown", handleFirstUserInteraction);
      window.removeEventListener("touchstart", handleFirstUserInteraction);
    };
  }, []);

  const triggerGlitchEffect = () => {
    setIsGlitching(true);
    horrorAudio.playHorrorGlitch();
    setTimeout(() => setIsGlitching(false), 600);
  };

  const handleToggleShinigamiEyes = () => {
    setShinigamiEyesActive((prev) => !prev);
    triggerGlitchEffect();
  };

  // Parse command via server Gemini AI with instant fallback
  const handleSubmitCommand = async (command: string) => {
    setIsProcessing(true);
    triggerGlitchEffect();

    try {
      let parsedData: any = null;

      // Try server Gemini AI parse
      try {
        const response = await fetch("/api/parse-death-note", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ command }),
        });
        if (response.ok) {
          parsedData = await response.json();
        }
      } catch (err) {
        console.warn("Server parse fell back to Shinigami intuition:", err);
      }

      // If server didn't provide parsedData, run client fallback parser
      if (!parsedData || !parsedData.targetName) {
        parsedData = parseCommandClientFallback(command);
      }

      const newRecord: ExecutionRecord = {
        id: `dn-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        targetName: parsedData.targetName || "Unknown Target",
        causeOfDeath: parsedData.causeOfDeath || "Sudden Heart Attack",
        totalSeconds: Math.max(5, Number(parsedData.durationSeconds) || 40),
        remainingSeconds: Math.max(5, Number(parsedData.durationSeconds) || 40),
        parsedDurationText: parsedData.parsedDurationText || "40 seconds",
        createdAt: Date.now(),
        shinigamiVerdict:
          parsedData.shinigamiVerdict ||
          `Kukuku... Their name is sealed. In ${parsedData.parsedDurationText || "40 seconds"}, their fate is consummated.`,
        isCompleted: false,
        command,
      };

      setRecords((prev) => [newRecord, ...prev]);
      setActiveRecordId(newRecord.id);
      setPendingConfirmation(newRecord);

      // Smooth scroll to countdown
      setTimeout(() => {
        const countdownElem = document.getElementById("live-reverse-countdown-container");
        if (countdownElem) {
          countdownElem.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 300);
    } catch (e) {
      console.error("Execution command error:", e);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteRecord = (id: string) => {
    setRecords((prev) => {
      const filtered = prev.filter((r) => r.id !== id);
      if (activeRecordId === id) {
        setActiveRecordId(filtered.length > 0 ? filtered[0].id : null);
      }
      return filtered;
    });
  };

  return (
    <div
      id="death-note-app-root"
      className={`min-h-screen bg-[#030303] text-neutral-200 relative pb-36 overflow-x-hidden ${
        isGlitching ? "animate-glitch" : ""
      }`}
    >
      {/* Background Animated Dripping Blood */}
      <BloodCanvas />

      {/* Atmospheric CRT Scanlines & Horror Vignette */}
      <div className="fixed inset-0 scanlines-overlay z-10 pointer-events-none opacity-40" />
      <div className="fixed inset-0 vignette-horror z-10 pointer-events-none" />

      {/* Screen Glitch Flash Overlay when triggered */}
      {isGlitching && (
        <div className="fixed inset-0 z-30 bg-red-900/30 mix-blend-color-burn pointer-events-none animate-eerie-flicker" />
      )}

      {/* Main Container */}
      <main className="relative z-20 max-w-5xl mx-auto px-4">
        {/* Topmost Creator Signature: Notebook is made by Uzair in beautiful calligraphy */}
        <div
          id="notebook-made-by-uzair-header"
          className="pt-4 pb-2 flex flex-col items-center justify-center select-none"
        >
          <div className="relative group px-6 sm:px-12 py-1.5 rounded-full bg-gradient-to-r from-transparent via-red-950/60 to-transparent border-y border-red-800/50 shadow-[0_0_30px_rgba(185,28,28,0.3)] flex items-center gap-2 sm:gap-4 transition-all duration-300 hover:shadow-[0_0_40px_rgba(220,38,38,0.6)]">
            <div className="h-[1px] w-6 sm:w-16 bg-gradient-to-r from-transparent via-amber-400/70 to-red-500" />
            <span className="text-amber-400 text-xs sm:text-sm animate-pulse">✦</span>
            <h2
              className="font-calligraphy text-2xl sm:text-3xl md:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-rose-100 to-amber-200 drop-shadow-[0_2px_12px_rgba(220,38,38,0.8)] tracking-wider"
            >
              Notebook is made by Uzair
            </h2>
            <span className="text-amber-400 text-xs sm:text-sm animate-pulse">✦</span>
            <div className="h-[1px] w-6 sm:w-16 bg-gradient-to-l from-transparent via-amber-400/70 to-red-500" />
          </div>
        </div>

        {/* Atmospheric Horror Audio Indicator & Replay Bar */}
        <div className="pt-2 flex justify-center">
          <button
            type="button"
            onClick={() => {
              horrorAudio.playWitchScream();
              setHasTriggeredIntroScream(true);
            }}
            className="group px-4 py-1.5 rounded-full bg-red-950/60 hover:bg-red-900/80 border border-red-800/80 hover:border-red-500 text-red-200 text-xs font-serif flex items-center gap-2 shadow-[0_0_15px_rgba(220,38,38,0.4)] hover:shadow-[0_0_25px_rgba(239,68,68,0.8)] transition-all cursor-pointer"
          >
            <Flame className="w-3.5 h-3.5 text-red-500 animate-pulse group-hover:scale-125 transition-transform" />
            <span className="text-red-300 font-semibold tracking-wider uppercase text-[11px]">
              {hasTriggeredIntroScream ? "Chudail ki bhayanak cheekh dobara sunein (Replay Witch Shriek)" : "Chudail ki bhayanak cheekh (Click to Unleash Witch Shriek)"}
            </span>
            <Volume2 className="w-3.5 h-3.5 text-red-400 animate-bounce" />
          </button>
        </div>

        {/* 1. Terrifying Landing Screen Header: Prominent Gothic Title "Hi Everyone" */}
        <GothicHeader
          shinigamiEyesActive={shinigamiEyesActive}
          onToggleShinigamiEyes={handleToggleShinigamiEyes}
          onTriggerGlitch={triggerGlitchEffect}
        />

        {/* 1. Spooky Container Titled: "Rules to Use Death Note" */}
        <RulesContainer />

        {/* 3. Live Reverse Countdown Mechanism: Glowing Blood-Red Reverse Timer */}
        <LiveCountdownDisplay
          records={records}
          activeRecordId={activeRecordId}
          onSelectRecord={setActiveRecordId}
          onDeleteRecord={handleDeleteRecord}
          shinigamiEyesActive={shinigamiEyesActive}
          onTriggerBloodSplatter={handleTriggerBloodSplatter}
        />
      </main>

      {/* Blood Splatter CSS Animation Overlay when countdown reaches zero */}
      <BloodSplatterOverlay
        isActive={bloodSplatterActive}
        victimName={splatterVictim?.name}
        causeOfDeath={splatterVictim?.cause}
        onAnimationComplete={() => setBloodSplatterActive(false)}
      />

      {/* Eerie Confirmation Overlay after submitting a name */}
      {pendingConfirmation && (
        <EerieConfirmationOverlay
          record={pendingConfirmation}
          onDismiss={() => setPendingConfirmation(null)}
        />
      )}

      {/* 2. Interactive Evil Input Section (The Bottom Search Bar strictly at bottom) */}
      <BottomCommandBar
        onSubmitCommand={handleSubmitCommand}
        isProcessing={isProcessing}
      />
    </div>
  );
}

// Client-side instant regex parser fallback
function parseCommandClientFallback(text: string) {
  const clean = text.trim();
  let targetName = "";
  let cause = "Sudden Heart Attack (Death Note Default Rule)";
  let durationSeconds = 40;
  let durationText = "40 seconds";

  const lower = clean.toLowerCase();

  // Extract time duration
  const timeRegex = /(\d+)\s*(seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|ghante?|min|sec)/i;
  const timeMatch = clean.match(timeRegex);
  if (timeMatch) {
    const val = parseInt(timeMatch[1], 10);
    const unit = timeMatch[2].toLowerCase();
    if (unit.startsWith("s")) {
      durationSeconds = Math.max(5, val);
      durationText = `${val} second${val === 1 ? "" : "s"}`;
    } else if (unit.startsWith("m")) {
      durationSeconds = Math.max(1, val) * 60;
      durationText = `${val} minute${val === 1 ? "" : "s"}`;
    } else if (unit.startsWith("h") || unit.startsWith("g")) {
      durationSeconds = Math.max(1, val) * 3600;
      durationText = `${val} hour${val === 1 ? "" : "s"}`;
    } else if (unit.startsWith("d")) {
      durationSeconds = Math.max(1, val) * 86400;
      durationText = `${val} day${val === 1 ? "" : "s"}`;
    }
  }

  // Extract cause of death
  const causeMatch = clean.match(/(?:by|from|cause(?:d)? by|method(?: of)?|ke zariye|se)\s+([^.]+?)(?:\s+(?:in|after|mein|me)\s+\d+|$)/i);
  if (causeMatch && causeMatch[1]?.trim()) {
    cause = causeMatch[1].trim();
  } else if (lower.includes("heart attack") || lower.includes("dil ka daura")) {
    cause = "Sudden Heart Attack";
  } else if (lower.includes("collision") || lower.includes("accident") || lower.includes("hadsa")) {
    cause = "Fatal Traffic Collision";
  } else if (lower.includes("drown") || lower.includes("doob")) {
    cause = "Drowning in Frozen Waters";
  }

  // Extract target name: handle command phrases, Roman Urdu phrases, or direct names
  const namePatterns = [
    /(?:eliminate|kill|destroy|murder|execute|write)\s+([A-Za-z0-9\s'-]+?)(?:\s+(?:in|by|with|from|at|after|mein|me)|$)/i,
    /target\s*:\s*([A-Za-z0-9\s'-]+)/i,
    /([A-Za-z0-9\s'-]+?)\s+(?:ko maro|ko khatam karo|mar jaye)/i,
  ];

  for (const pattern of namePatterns) {
    const match = clean.match(pattern);
    if (match && match[1]?.trim()) {
      targetName = match[1].trim();
      break;
    }
  }

  // If no prefix pattern matched, strip time and condition phrases
  if (!targetName) {
    let candidate = clean
      .replace(/(?:in|after|within|mein|me)\s+(\d+)\s*(?:seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|ghante?|min|sec)/gi, "")
      .replace(/(\d+)\s*(?:seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|ghante?|min|sec)/gi, "")
      .replace(/(?:by|from|in|with|at|after|ke zariye|se|ko maro)\s+[^.]+$/gi, "")
      .replace(/^(?:eliminate|kill|write|execute)\s+/gi, "")
      .replace(/\s+(?:in|by|with|from|at|after|mein|me|ko)$/gi, "")
      .trim();

    if (candidate && candidate.length <= 50) {
      targetName = candidate;
    } else {
      const words = clean.split(/\s+/).filter(Boolean);
      targetName = words[0] || "Sacrificial Soul";
    }
  }

  targetName = targetName
    .replace(/\s+(?:in|by|with|from|at|after|mein|me|ko)$/i, "")
    .replace(/[.,:;!?]+$/, "")
    .trim() || "Sacrificial Soul";

  return {
    targetName,
    causeOfDeath: cause,
    durationSeconds,
    parsedDurationText: durationText,
    shinigamiVerdict: `Kukuku... ${targetName}'s life has been carved into the abyss. In exactly ${durationText}, their heartbeat ceases. Ryuk is pleased.`,
  };
}
