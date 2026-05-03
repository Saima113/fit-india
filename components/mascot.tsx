"use client";

export type MascotMood = "happy" | "sad" | "excited" | "celebrating" | "neutral" | "sleeping" | "fasting";

interface MascotProps {
  mood: MascotMood;
  size?: number;
  showLabel?: boolean;
}

const MOOD_CONFIG: Record<MascotMood, {
  label: string;
  bodyColor: string;
  cheekColor: string;
  animation: string;
  animDuration: string;
  eyeType: "normal" | "happy" | "sad" | "star" | "sleepy" | "closed";
  mouthType: "smile" | "grin" | "sad" | "open" | "neutral" | "tiny";
  accessory?: "none" | "sweat" | "sparkles" | "zzz" | "moon" | "fire";
}> = {
  happy: {
    label: "You're on a roll! 💪",
    bodyColor: "#cf303b", cheekColor: "rgba(255,160,160,0.6)",
    animation: "mascot-float", animDuration: "2.5s",
    eyeType: "happy", mouthType: "smile", accessory: "none",
  },
  sad: {
    label: "Miss you... come back! 🥺",
    bodyColor: "#5a7ab5", cheekColor: "rgba(150,180,255,0.4)",
    animation: "mascot-droop", animDuration: "3s",
    eyeType: "sad", mouthType: "sad", accessory: "sweat",
  },
  excited: {
    label: "LET'S GOOO!! 🔥",
    bodyColor: "#e8a020", cheekColor: "rgba(255,200,80,0.5)",
    animation: "mascot-bounce", animDuration: "0.6s",
    eyeType: "star", mouthType: "open", accessory: "sparkles",
  },
  celebrating: {
    label: "YOU DID IT! 🎉",
    bodyColor: "#2eab6e", cheekColor: "rgba(100,220,150,0.5)",
    animation: "mascot-wiggle", animDuration: "0.5s",
    eyeType: "happy", mouthType: "grin", accessory: "sparkles",
  },
  neutral: {
    label: "Ready when you are 👊",
    bodyColor: "#888", cheekColor: "rgba(180,180,180,0.3)",
    animation: "mascot-idle", animDuration: "3s",
    eyeType: "normal", mouthType: "neutral", accessory: "none",
  },
  sleeping: {
    label: "Rest day... Zzz 😴",
    bodyColor: "#9c7bb5", cheekColor: "rgba(180,150,220,0.4)",
    animation: "mascot-breathe", animDuration: "2s",
    eyeType: "sleepy", mouthType: "tiny", accessory: "zzz",
  },
  fasting: {
    label: "Fasting strong! 🌙",
    bodyColor: "#3d8bcd", cheekColor: "rgba(100,180,255,0.4)",
    animation: "mascot-float", animDuration: "3s",
    eyeType: "closed", mouthType: "smile", accessory: "moon",
  },
};

export default function Mascot({ mood, size = 90, showLabel = true }: MascotProps) {
  const cfg = MOOD_CONFIG[mood];
  const s = size / 10; // scale unit

  return (
    <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
      <style>{`
        @keyframes mascot-float   { 0%,100%{transform:translateY(0)}       50%{transform:translateY(-${s*1.2}px)} }
        @keyframes mascot-bounce  { 0%,100%{transform:translateY(0) scaleY(1)} 40%{transform:translateY(-${s*3}px) scaleY(1.1)} 70%{transform:translateY(-${s*0.5}px) scaleY(0.95)} }
        @keyframes mascot-droop   { 0%,100%{transform:translateY(0)}       60%{transform:translateY(${s*0.8}px)} }
        @keyframes mascot-wiggle  { 0%,100%{transform:rotate(0deg)}        25%{transform:rotate(${s*1}deg)} 75%{transform:rotate(-${s*1}deg)} }
        @keyframes mascot-idle    { 0%,100%{transform:translateY(0)}       50%{transform:translateY(-${s*0.4}px)} }
        @keyframes mascot-breathe { 0%,100%{transform:scaleY(1) scaleX(1)} 50%{transform:scaleY(0.97) scaleX(1.01)} }
        @keyframes mascot-sparkle { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(1.3)} }
        @keyframes mascot-zzz     { 0%{opacity:0;transform:translate(0,0) scale(0.5)} 50%{opacity:1} 100%{opacity:0;transform:translate(${s}px,-${s*2}px) scale(1)} }
      `}</style>

      <div style={{ animation: `${cfg.animation} ${cfg.animDuration} ease-in-out infinite`, display: "inline-block" }}>
        <svg
          width={size}
          height={size * 1.3}
          viewBox="0 0 100 130"
          xmlns="http://www.w3.org/2000/svg"
          style={{ imageRendering: "pixelated", overflow: "visible" }}
        >
          {/* Shadow */}
          <ellipse cx="50" cy="125" rx="22" ry="5" fill="rgba(0,0,0,0.12)" />

          {/* Body */}
          <rect x="28" y="70" width="44" height="38" rx="8" fill={cfg.bodyColor} opacity="0.9" />

          {/* Belly highlight */}
          <ellipse cx="50" cy="84" rx="14" ry="11" fill="rgba(255,255,255,0.12)" />

          {/* Arms */}
          <rect x="8"  y="72" width="20" height="12" rx="6" fill={cfg.bodyColor} opacity="0.85"
            style={{ transform: mood === "celebrating" ? "rotate(-30deg)" : "none", transformOrigin: "28px 78px" }} />
          <rect x="72" y="72" width="20" height="12" rx="6" fill={cfg.bodyColor} opacity="0.85"
            style={{ transform: mood === "celebrating" ? "rotate(30deg)" : "none", transformOrigin: "72px 78px" }} />

          {/* Legs */}
          <rect x="34" y="104" width="13" height="18" rx="5" fill={cfg.bodyColor} opacity="0.8" />
          <rect x="53" y="104" width="13" height="18" rx="5" fill={cfg.bodyColor} opacity="0.8" />

          {/* Feet */}
          <ellipse cx="40" cy="122" rx="9"  ry="5" fill={cfg.bodyColor} opacity="0.9" />
          <ellipse cx="60" cy="122" rx="9"  ry="5" fill={cfg.bodyColor} opacity="0.9" />

          {/* Head */}
          <rect x="18" y="12" width="64" height="62" rx="20" fill={cfg.bodyColor} />

          {/* Head highlight */}
          <ellipse cx="50" cy="28" rx="22" ry="12" fill="rgba(255,255,255,0.18)" />

          {/* Ears */}
          <rect x="14" y="22" width="12" height="16" rx="6" fill={cfg.bodyColor} />
          <rect x="74" y="22" width="12" height="16" rx="6" fill={cfg.bodyColor} />
          <rect x="16" y="25" width="8"  height="10" rx="4" fill="rgba(255,255,255,0.2)" />
          <rect x="76" y="25" width="8"  height="10" rx="4" fill="rgba(255,255,255,0.2)" />

          {/* ── Eyes ────────────────────────────────────────────── */}
          {cfg.eyeType === "normal" && <>
            <ellipse cx="37" cy="42" rx="7" ry="8" fill="white" />
            <ellipse cx="63" cy="42" rx="7" ry="8" fill="white" />
            <circle  cx="39" cy="43" r="4"  fill="#222" />
            <circle  cx="65" cy="43" r="4"  fill="#222" />
            <circle  cx="40" cy="41" r="1.5" fill="white" />
            <circle  cx="66" cy="41" r="1.5" fill="white" />
          </>}

          {cfg.eyeType === "happy" && <>
            <path d="M30 44 Q37 36 44 44" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M56 44 Q63 36 70 44" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" />
          </>}

          {cfg.eyeType === "sad" && <>
            <ellipse cx="37" cy="44" rx="7" ry="7" fill="white" />
            <ellipse cx="63" cy="44" rx="7" ry="7" fill="white" />
            <circle  cx="37" cy="45" r="4"  fill="#222" />
            <circle  cx="63" cy="45" r="4"  fill="#222" />
            {/* sad brow */}
            <path d="M30 35 Q37 40 44 37" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.6" />
            <path d="M56 37 Q63 40 70 35" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.6" />
          </>}

          {cfg.eyeType === "star" && <>
            {/* Star eyes */}
            {[37, 63].map((cx) => (
              <g key={cx}>
                <polygon points={`${cx},34 ${cx+3},40 ${cx+8},40 ${cx+4},44 ${cx+6},50 ${cx},46 ${cx-6},50 ${cx-4},44 ${cx-8},40 ${cx-3},40`}
                  fill="white" opacity="0.95" />
              </g>
            ))}
          </>}

          {cfg.eyeType === "sleepy" && <>
            <path d="M30 42 Q37 46 44 42" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.7" />
            <path d="M56 42 Q63 46 70 42" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.7" />
          </>}

          {cfg.eyeType === "closed" && <>
            <path d="M30 42 Q37 38 44 42" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M56 42 Q63 38 70 42" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" />
          </>}

          {/* ── Cheeks ──────────────────────────────────────────── */}
          <ellipse cx="26" cy="54" rx="8" ry="5" fill={cfg.cheekColor} />
          <ellipse cx="74" cy="54" rx="8" ry="5" fill={cfg.cheekColor} />

          {/* ── Mouth ───────────────────────────────────────────── */}
          {cfg.mouthType === "smile" && (
            <path d="M40 60 Q50 68 60 60" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" />
          )}
          {cfg.mouthType === "grin" && (
            <>
              <path d="M38 60 Q50 70 62 60" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" />
              <path d="M42 62 Q50 67 58 62" fill="white" opacity="0.3" />
            </>
          )}
          {cfg.mouthType === "sad" && (
            <path d="M40 65 Q50 58 60 65" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" />
          )}
          {cfg.mouthType === "open" && (
            <>
              <path d="M38 60 Q50 72 62 60" stroke="white" strokeWidth="3" fill="white" opacity="0.9" />
              <path d="M38 60 Q50 72 62 60" fill="rgba(0,0,0,0.3)" />
            </>
          )}
          {cfg.mouthType === "neutral" && (
            <path d="M42 63 L58 63" stroke="white" strokeWidth="3" strokeLinecap="round" />
          )}
          {cfg.mouthType === "tiny" && (
            <ellipse cx="50" cy="62" rx="4" ry="3" fill="white" opacity="0.6" />
          )}

          {/* ── Accessories ─────────────────────────────────────── */}
          {cfg.accessory === "sparkles" && <>
            <text x="76" y="20" fontSize="14" style={{ animation: "mascot-sparkle 0.8s ease-in-out infinite" }}>✨</text>
            <text x="10" y="18" fontSize="10" style={{ animation: "mascot-sparkle 0.8s ease-in-out infinite 0.4s" }}>⭐</text>
          </>}

          {cfg.accessory === "zzz" && (
            <text x="68" y="18" fontSize="13" style={{ animation: "mascot-zzz 2s ease-in-out infinite" }} opacity="0.8">z z z</text>
          )}

          {cfg.accessory === "sweat" && (
            <ellipse cx="72" cy="28" rx="4" ry="6" fill="#6ab0f5" opacity="0.7"  />
          )}

          {cfg.accessory === "moon" && (
            <text x="72" y="20" fontSize="16">🌙</text>
          )}

          {cfg.accessory === "fire" && (
            <text x="72" y="18" fontSize="16" style={{ animation: "mascot-sparkle 0.5s ease-in-out infinite" }}>🔥</text>
          )}
        </svg>
      </div>

      {showLabel && (
        <div style={{
          fontSize: "12px",
          color: "rgba(255,255,255,0.5)",
          textAlign: "center",
          fontStyle: "italic",
          maxWidth: `${size * 1.6}px`,
          lineHeight: 1.4,
        }}>
          {cfg.label}
        </div>
      )}
    </div>
  );
}