import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Fallback heuristic parser in case Gemini is experiencing high demand or offline
function fallbackParseCommand(text: string) {
  const clean = text.trim();
  let targetName = "";
  let cause = "Sudden Heart Attack (Death Note Default Rule)";
  let durationSeconds = 40; // Default Death Note rule: 40 seconds
  let durationText = "40 seconds";

  const lower = clean.toLowerCase();

  // Parse time
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

  // Parse cause
  const causeMatch = clean.match(/(?:by|from|cause(?:d)? by|method(?: of)?|ke zariye|se)\s+([^.]+?)(?:\s+(?:in|after|mein|me)\s+\d+|$)/i);
  if (causeMatch && causeMatch[1]?.trim()) {
    cause = causeMatch[1].trim();
  } else if (lower.includes("heart attack") || lower.includes("dil ka daura")) {
    cause = "Sudden Heart Attack";
  } else if (lower.includes("accident") || lower.includes("collision") || lower.includes("hadsa")) {
    cause = "Fatal Traffic Collision";
  } else if (lower.includes("drown") || lower.includes("doob")) {
    cause = "Drowning in Frozen Waters";
  }

  // Parse target name: handle command phrases, Roman Urdu phrases, or direct names
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
    shinigamiVerdict: `Kukuku... ${targetName}'s name has been carved into the abyss. In exactly ${durationText}, their heartbeat shall extinguish. The Shinigami watches with hunger.`,
    isFateSealed: true,
  };
}

// Safely query Gemini with automatic resilience against 503 high-demand spikes
async function queryGeminiSafely(client: GoogleGenAI, prompt: string, schema: any) {
  const models = ["gemini-3.8-flash", "gemini-flash-latest"];
  for (const model of models) {
    try {
      const response = await client.models.generateContent({
        model,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: schema,
        },
      });
      if (response && response.text) {
        return response;
      }
    } catch (err: any) {
      const isUnavailable =
        err?.status === 503 ||
        err?.code === 503 ||
        String(err?.message || "").includes("503") ||
        String(err?.message || "").includes("high demand");

      if (isUnavailable) {
        console.warn(`[Shinigami Gateway] Model ${model} is experiencing temporary high demand (503).`);
        continue; // Try secondary fallback model or internal intuition
      }
      // For any non-503 error, log gently and return null to engage internal parser
      console.warn(`[Shinigami Gateway] Model query notice:`, err?.message || err);
      break;
    }
  }
  return null;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  app.get("/api/health", (_req, res) => {
    res.json({ status: "eerie", realm: "Shinigami" });
  });

  app.post("/api/parse-death-note", async (req, res) => {
    try {
      const { command } = req.body;
      if (!command || typeof command !== "string" || !command.trim()) {
        res.status(400).json({ error: "The notebook requires ink and intent. Provide a command." });
        return;
      }

      const client = getGeminiClient();
      if (!client) {
        // Fallback gracefully without API key
        const parsed = fallbackParseCommand(command);
        res.json({ ...parsed, source: "shinigami-intuition" });
        return;
      }

      const prompt = `You are Ryuk, the Shinigami from Death Note, inspecting an execution decree written in the Death Note.
User input: "${command}"

Parse the execution command and return a JSON object with:
1. targetName: string (Full name of the intended victim. E.g. "Ahmed", "Uzair", "Light").
2. causeOfDeath: string (Exact method or cause specified, e.g. "Sudden Heart Attack", or if unspecified default to "Sudden Heart Attack (Rule 40 seconds)").
3. durationSeconds: integer (The total time delay in seconds before death occurs. E.g., "30 minutes" = 1800, "1 hour" = 3600, "1 day" = 86400, "40 seconds" = 40. If no time is specified, default to 40).
4. parsedDurationText: string (Readable duration representation, e.g., "30 minutes", "1 hour", "40 seconds").
5. shinigamiVerdict: string (A chilling, eerie, horrifying 1-2 sentence proclamation from the Shinigami confirming the fate).`;

      const response = await queryGeminiSafely(client, prompt, {
        type: Type.OBJECT,
        properties: {
          targetName: { type: Type.STRING },
          causeOfDeath: { type: Type.STRING },
          durationSeconds: { type: Type.INTEGER },
          parsedDurationText: { type: Type.STRING },
          shinigamiVerdict: { type: Type.STRING },
        },
        required: ["targetName", "causeOfDeath", "durationSeconds", "parsedDurationText", "shinigamiVerdict"],
      });

      const text = response?.text?.trim();
      if (text) {
        try {
          const parsed = JSON.parse(text);
          res.json({
            targetName: parsed.targetName || "Sacrificial Soul",
            causeOfDeath: parsed.causeOfDeath || "Heart Attack",
            durationSeconds: Math.max(5, Number(parsed.durationSeconds) || 40),
            parsedDurationText: parsed.parsedDurationText || "40 seconds",
            shinigamiVerdict: parsed.shinigamiVerdict || "Their fate has been written. The timer starts now...",
            isFateSealed: true,
            source: "gemini-shinigami-mind",
          });
          return;
        } catch {
          // JSON parse failed, proceed to fallback
        }
      }

      // If Gemini experienced high demand / 503 or empty response, smoothly use heuristic parser
      const fallback = fallbackParseCommand(command);
      res.json({ ...fallback, source: "shinigami-intuition" });
    } catch (err: any) {
      console.warn("[Shinigami Gateway] Safe parse fallback activated:", err?.message || "Unavailable");
      const fallback = fallbackParseCommand(req.body?.command || "");
      res.json({ ...fallback, source: "shinigami-fallback" });
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Death Note dark portal running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
