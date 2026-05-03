"use client";

import { HeartPulse, Home, Moon, Wallet, Users, Zap } from "lucide-react";

const items = [
  {
    icon: HeartPulse,
    title: "PCOS & Diabetes Modes",
    desc: "Specialised plans following established nutritional guidelines for the most common Indian health conditions.",
  },
  {
    icon: Home,
    title: "Hostel & Mess Mode",
    desc: "Stuck with mess food? We tell you exactly what to eat, what to skip, and cheap snacks to fill the gaps.",
  },
  {
    icon: Moon,
    title: "Night Shift Mode",
    desc: "Meal timing and workout suggestions completely flipped for people whose day starts at 10pm.",
  },
  {
    icon: Wallet,
    title: "Budget-Aware Plans",
    desc: "Set your daily food budget. We give you plans that fit ₹150/day without sacrificing nutrition.",
  },
  {
    icon: Users,
    title: "Skinny Fat & Postpartum",
    desc: "Plans for body types and life stages that every other app completely ignores.",
  },
  {
    icon: Zap,
    title: "Plateau Detection",
    desc: "No progress in 3 weeks? App automatically detects it and adjusts your plan without you asking.",
  },
];

export default function IndiaSection() {
  return (
    <section
      id="india"
      style={{
        position: "relative",
        zIndex: 1,
        padding: "100px 48px",
        background: "var(--bg2)",
        borderTop: "1px solid var(--border2)",
        borderBottom: "1px solid var(--border2)",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: "64px" }}>
          <span style={{
            display: "inline-block",
            fontSize: "12px",
            fontWeight: 600,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--accent)",
            marginBottom: "16px",
          }}>
            Built for India
          </span>

          <div style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "24px",
          }}>
            <h2 style={{
              fontFamily: "var(--font-syne)",
              fontSize: "clamp(32px, 4vw, 52px)",
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              color: "var(--text)",
              margin: 0,
            }}>
              Finally, an app<br />that gets it
            </h2>

            <p style={{
              fontSize: "17px",
              color: "var(--text2)",
              fontWeight: 300,
              maxWidth: "420px",
              lineHeight: 1.7,
              fontFamily: "var(--font-dm-sans)",
              margin: 0,
            }}>
              Generic fitness apps were built for Western users and awkwardly translated for India. We started from scratch — for real Indian lives.
            </p>
          </div>
        </div>

        {/* 3x2 list grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "16px",
        }}>
          {items.map((item, i) => {
            const Icon = item.icon;
            const isAccent = i === 1 || i === 3 || i === 5;

            return (
              <div
                key={item.title}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "14px",
                  padding: "24px",
                  background: isAccent ? "var(--gradient)" : "var(--card)",
                  border: `1px solid ${isAccent ? "transparent" : "var(--border2)"}`,
                  borderRadius: "16px",
                  transition: "all 0.25s ease",
                  cursor: "default",
                  boxShadow: isAccent ? "0 8px 24px var(--accent-glow)" : "none",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = "translateY(-3px)";
                  if (!isAccent) e.currentTarget.style.borderColor = "var(--border)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "translateY(0)";
                  if (!isAccent) e.currentTarget.style.borderColor = "var(--border2)";
                }}
              >
                <div style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                  background: isAccent ? "rgba(255,255,255,0.15)" : "var(--accent-soft)",
                  border: `1px solid ${isAccent ? "rgba(255,255,255,0.2)" : "var(--border)"}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}>
                  <Icon
                    size={18}
                    color={isAccent ? "white" : "var(--accent)"}
                    strokeWidth={1.5}
                  />
                </div>
                <div>
                  <div style={{
                    fontSize: "14px",
                    fontWeight: 700,
                    color: isAccent ? "white" : "var(--text)",
                    marginBottom: "6px",
                    fontFamily: "var(--font-syne)",
                  }}>
                    {item.title}
                  </div>
                  <div style={{
                    fontSize: "13px",
                    color: isAccent ? "rgba(255,255,255,0.8)" : "var(--text2)",
                    fontWeight: 300,
                    lineHeight: 1.6,
                    fontFamily: "var(--font-dm-sans)",
                  }}>
                    {item.desc}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}