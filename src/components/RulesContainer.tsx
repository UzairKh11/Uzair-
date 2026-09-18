import React from "react";
import { BookOpen, Skull } from "lucide-react";

export const RulesContainer: React.FC = () => {
  const rules = [
    {
      num: "Rule 1",
      roman: "I",
      text: "Enter the full name of the person you want to eliminate.",
      lore: "The notebook will not take effect unless the writer has the person's true name.",
    },
    {
      num: "Rule 2",
      roman: "II",
      text: "Specify the exact cause or method of death.",
      lore: "If the cause of death is not specified, the person will simply die of a heart attack.",
    },
    {
      num: "Rule 3",
      roman: "III",
      text: "Define the exact time delay before the event occurs.",
      lore: "Minutes, hours, or days. Once inscribed, the reverse clock cannot be halted.",
    },
    {
      num: "Rule 4",
      roman: "IV",
      text: "You must keep the target's face vividly in your mind while submitting.",
      lore: "Therefore, individuals sharing the same name will not be affected simultaneously.",
    },
  ];

  return (
    <section
      id="rules-death-note-container"
      className="relative w-full max-w-3xl mx-auto my-4 px-4"
    >
      {/* Container with dark slate grey, pure black & glowing crimson border */}
      <div className="relative rounded-lg border border-red-950/80 bg-gradient-to-b from-[#0e1015]/95 via-[#08090c]/98 to-[#030304]/99 p-6 sm:p-8 shadow-[0_0_40px_rgba(0,0,0,0.9),0_0_20px_rgba(138,3,3,0.25)] backdrop-blur-md overflow-hidden">
        {/* Top subtle blood bleed strip */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-red-600 to-transparent" />

        {/* Corner decorative gothic markings */}
        <div className="absolute top-2 left-2 text-red-900/40 text-xs font-serif select-none">✝</div>
        <div className="absolute top-2 right-2 text-red-900/40 text-xs font-serif select-none">✝</div>
        <div className="absolute bottom-2 left-2 text-red-900/40 text-xs font-serif select-none">✝</div>
        <div className="absolute bottom-2 right-2 text-red-900/40 text-xs font-serif select-none">✝</div>

        {/* Spooky Title: "Rules to Use Death Note" */}
        <div className="flex items-center justify-center gap-3 mb-6 border-b border-red-900/30 pb-4">
          <BookOpen className="w-5 h-5 text-red-600 animate-pulse" />
          <h2
            id="rules-death-note-heading"
            className="font-gothic-title text-xl sm:text-2xl md:text-3xl font-bold tracking-widest text-neutral-100 drop-shadow-[0_0_12px_rgba(220,38,38,0.7)] text-center uppercase"
          >
            Rules to Use Death Note
          </h2>
          <Skull className="w-5 h-5 text-red-600 animate-pulse" />
        </div>

        {/* 4 Rules with blood-dripping bullet point aesthetic */}
        <ul className="space-y-4">
          {rules.map((rule) => (
            <li
              key={rule.num}
              className="group relative flex items-start gap-4 p-3 rounded-md border border-transparent hover:border-red-950/60 hover:bg-red-950/15 transition-all duration-300"
            >
              {/* Blood-dripping bullet point */}
              <div className="relative flex-shrink-0 mt-1">
                {/* Dripping blood teardrop SVG */}
                <div className="relative w-5 h-6 flex items-center justify-center">
                  <svg
                    viewBox="0 0 24 30"
                    fill="none"
                    className="w-5 h-6 text-red-600 drop-shadow-[0_0_8px_rgba(220,38,38,0.9)] group-hover:scale-110 transition-transform duration-200"
                  >
                    <path
                      d="M12 2C12 2 4 12 4 18C4 22.4183 7.58172 26 12 26C16.4183 26 20 22.4183 20 18C20 12 12 2 12 2Z"
                      fill="url(#bloodGrad)"
                    />
                    {/* Trailing drop extension */}
                    <circle cx="12" cy="28.5" r="1.5" fill="#dc2626" className="animate-pulse" />
                    <defs>
                      <linearGradient id="bloodGrad" x1="12" y1="2" x2="12" y2="26" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#ff4d4d" />
                        <stop offset="0.5" stopColor="#dc2626" />
                        <stop offset="1" stopColor="#7f1d1d" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>

              {/* Rule Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-serif text-xs font-bold text-red-500 tracking-wider uppercase">
                    {rule.num}
                  </span>
                  <span className="text-[10px] text-neutral-500 font-serif">
                    [{rule.roman}]
                  </span>
                </div>
                <p className="font-serif text-sm sm:text-base text-neutral-200 font-medium leading-relaxed tracking-wide group-hover:text-red-100 transition-colors">
                  {rule.text}
                </p>
                <p className="font-parchment text-xs text-neutral-400 mt-1 italic tracking-normal">
                  — {rule.lore}
                </p>
              </div>
            </li>
          ))}
        </ul>

        {/* Bottom Shinigami Lore Footnote */}
        <div className="mt-6 pt-4 border-t border-neutral-800/80 flex items-center justify-between text-[11px] font-parchment text-neutral-400">
          <span>HOW TO USE IT: PAGE I</span>
          <span className="text-red-700/80">SHINIGAMI REALM LAW</span>
        </div>
      </div>
    </section>
  );
};
