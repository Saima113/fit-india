"use client";

import { useState } from "react";

const fastingModes = [
  {
    title: "Ramzan Mode",
    desc: "Sehri & Iftar timed meal plans. Workout blocked during fast. Post-Iftar training recommended.",
    status: "Active",
    statusOn: true,
  },
  {
    title: "Navratri Mode",
    desc: "Allowed foods only — sabudana, kuttu, fruits, paneer. Toggle off on any day you skip.",
    status: "Off today",
    statusOn: false,
  },
  {
    title: "Ekadashi Mode",
    desc: "Calendar auto-marks Ekadashi dates. Plan switches automatically when toggle is on.",
    status: "Auto",
    statusOn: true,
  },
  {
    title: "Jain Mode",
    desc: "No root vegetables, no eating after sunset. Applied as a permanent dietary filter.",
    status: "Always on",
    statusOn: true,
  },
  {
    title: "Intermittent Fasting",
    desc: "16:8, 18:6, OMAD or custom window. All meals scheduled within your eating window only.",
    status: "Active",
    statusOn: true,
  },
  {
    title: "Custom Fast",
    desc: "Any fasting schedule you follow. Set your own window and the app adapts your entire plan.",
    status: "Custom",
    statusOn: false,
  },
];

export default function FastingSection() {
  const [toggles, setToggles] = useState(
    fastingModes.map((m) => m.statusOn)
  );

  const handleToggle = (i: number) => {
    setToggles((prev) => prev.map((v, idx) => (idx === i ? !v : v)));
  };

  return (
    <section
      id="fasting"
      style={{
        position: "relative",
        zIndex: 1,
        padding: "100px 48px",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      {/* Label */}
      <span style={{
        display: "inline-block",
        fontSize: "12px",
        fontWeight: 600,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color: "var(--accent)",
        marginBottom: "16px",
      }}>
        Fasting Intelligence
      </span>

      {/* Title */}
      <h2 style={{
        fontFamily: "var(--font-syne)",
        fontSize: "clamp(32px, 4vw, 52px)",
        fontWeight: 800,
        lineHeight: 1.1,
        letterSpacing: "-0.02em",
        marginBottom: "16px",
        color: "var(--text)",
      }}>
        Every fast.<br />Every toggle.
      </h2>

      {/* Subtitle */}
      <p style={{
        fontSize: "17px",
        color: "var(--text2)",
        fontWeight: 300,
        maxWidth: "500px",
        lineHeight: 1.7,
        marginBottom: "64px",
        fontFamily: "var(--font-dm-sans)",
      }}>
        Six fasting types, all with daily on/off toggles. The app never assumes you are fasting — you are always in control.
      </p>

      {/* Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "16px",
      }}>
        {fastingModes.map((mode, i) => (
          <div
            key={mode.title}
            style={{
              background: "var(--card)",
              border: "1px solid var(--border2)",
              borderRadius: "16px",
              padding: "24px",
              transition: "all 0.3s ease",
              cursor: "default",
              backdropFilter: "blur(12px)",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = "var(--border)";
              e.currentTarget.style.transform = "translateY(-3px)";
              e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.08)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = "var(--border2)";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            {/* Top row — title + toggle */}
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "16px",
            }}>
              <h3 style={{
                fontFamily: "var(--font-syne)",
                fontSize: "15px",
                fontWeight: 700,
                color: "var(--text)",
                margin: 0,
              }}>
                {mode.title}
              </h3>

              {/* Interactive toggle */}
              <button
                onClick={() => handleToggle(i)}
                aria-label={`Toggle ${mode.title}`}
                style={{
                  width: "40px",
                  height: "22px",
                  borderRadius: "999px",
                  border: "none",
                  background: toggles[i]
                    ? "var(--gradient)"
                    : "var(--border2)",
                  cursor: "pointer",
                  position: "relative",
                  transition: "all 0.3s ease",
                  flexShrink: 0,
                  boxShadow: toggles[i] ? "0 2px 8px var(--accent-glow)" : "none",
                }}
              >
                <span style={{
                  position: "absolute",
                  width: "16px",
                  height: "16px",
                  borderRadius: "50%",
                  background: "white",
                  top: "3px",
                  left: toggles[i] ? "21px" : "3px",
                  transition: "left 0.3s ease",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
                }} />
              </button>
            </div>

            {/* Status chip */}
            <div style={{ marginBottom: "12px" }}>
              <span style={{
                fontSize: "10px",
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                padding: "3px 8px",
                borderRadius: "999px",
                background: toggles[i]
                  ? "rgba(34,197,94,0.1)"
                  : "rgba(156,163,175,0.15)",
                color: toggles[i] ? "#16a34a" : "var(--text3)",
                border: `1px solid ${toggles[i] ? "rgba(34,197,94,0.2)" : "var(--border2)"}`,
              }}>
                {toggles[i] ? mode.status : "Off"}
              </span>
            </div>

            {/* Desc */}
            <p style={{
              fontSize: "13px",
              color: "var(--text2)",
              lineHeight: 1.6,
              fontWeight: 300,
              fontFamily: "var(--font-dm-sans)",
              margin: 0,
            }}>
              {mode.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}