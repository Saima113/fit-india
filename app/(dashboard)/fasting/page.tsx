"use client";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useClerk } from "@clerk/nextjs";
import {
  Moon, Dumbbell, Utensils, TrendingUp,
  LogOut, Calculator, User
} from "lucide-react";

const FASTING_TYPES = [
  {
    key: "ramzan",
    
    title: "Ramzan",
    subtitle: "Roza / Ramadan",
    description: "Sehri to Iftar. Workout blocked during fast. Post-Iftar training recommended 1.5hrs after breaking fast.",
    color: "#0f2034",
    accent: "#3d8bcd",
  },
  {
    key: "navratri",
  
    title: "Navratri",
    subtitle: "9 Days Fast",
    description: "Allowed foods only: sabudana, kuttu, fruits, paneer, dahi. No grains, no onion-garlic.",
    color: "#1e0f0f",
    accent: "#cf303b",
  },
  {
    key: "ekadashi",
    
    title: "Ekadashi",
    subtitle: "Twice monthly",
    description: "Ekadashi dates auto-marked. Plan switches automatically. No rice, no grains.",
    color: "#0f1e0f",
    accent: "#4caf50",
  },
  {
    key: "jain_mode",
    
    title: "Jain Mode",
    subtitle: "Permanent filter",
    description: "No root vegetables (potato, onion, garlic, carrot). No eating after sunset. Always active.",
    color: "#1a1a0f",
    accent: "#8bc34a",
  },
  {
    key: "intermittent_fasting",
    
    title: "Intermittent Fasting",
    subtitle: "16:8 / 18:6 / OMAD",
    description: "Time-restricted eating. Smart merge with Ramzan if both active. Meal plan adapts to your eating window.",
    color: "#0f0f1e",
    accent: "#7c4dff",
    hasWindow: true,
  },
  {
    key: "custom_fast",
    
    title: "Custom Fast",
    subtitle: "Your own window",
    description: "Set your own fasting start and end times. Full flexibility.",
    color: "#1a0f1a",
    accent: "#e91e8c",
    hasCustomTime: true,
  },
];

const SIDEBAR_ITEMS = [
  { icon: Dumbbell,    label: "Workout",  href: "/dashboard" },
  { icon: Utensils,   label: "Meals",    href: "/meals" },
  { icon: Calculator, label: "Calories", href: "/calories" },
  { icon: Moon,       label: "Fasting",  href: "/fasting" },
  { icon: TrendingUp, label: "Progress", href: "/progress" },
  { icon: User, label: "Profile", href: "/profile" },
];

const DEFAULT_SETTINGS = {
  ramzan: false,
  navratri: false,
  ekadashi: false,
  jain_mode: false,
  intermittent_fasting: false,
  if_window: "16:8",
  custom_fast: false,
  custom_start: "08:00",
  custom_end: "16:00",
};

export default function FastingPage() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const [settings, setSettings] = useState<Record<string, any>>(DEFAULT_SETTINGS);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [fetchError, setFetchError] = useState(false);

  const firstName =
    user?.firstName ||
    user?.emailAddresses?.[0]?.emailAddress?.split("@")[0] ||
    "there";

  useEffect(() => {
    if (!user) return;
    fetch(`http://localhost:8000/fasting/${user.id}`)
      .then((r) => {
        if (!r.ok) throw new Error("fetch failed");
        return r.json();
      })
      .then((data) => setSettings({ ...DEFAULT_SETTINGS, ...data }))
      .catch(() => {
        // Backend not running or table missing — just use defaults silently
        setFetchError(true);
        setSettings(DEFAULT_SETTINGS);
      });
  }, [user]);

  const toggle = (key: string) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
    setSaved(false);
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await fetch(`http://localhost:8000/fasting/${user.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      // silently fail
    } finally {
      setSaving(false);
    }
  };

  const activeCount = FASTING_TYPES.filter((f) => settings[f.key]).length;
  const currentPath = typeof window !== "undefined" ? window.location.pathname : "/fasting";

  return (
    <div style={{
      minHeight: "100vh", background: "#0d0d0d", color: "white",
      fontFamily: "var(--font-dm-sans)", display: "flex",
    }}>
      {/* Sidebar */}
      <div style={{
        width: "220px", flexShrink: 0, background: "#141414",
        borderRight: "1px solid rgba(255,255,255,0.06)",
        display: "flex", flexDirection: "column",
        padding: "24px 16px", position: "sticky", top: 0, height: "100vh",
      }}>
        <div style={{
          fontFamily: "var(--font-syne)", fontSize: "20px", fontWeight: 800,
          marginBottom: "40px", paddingLeft: "8px",
        }}>
          Fit<span style={{ color: "#cf303b" }}>India</span>
        </div>

        {SIDEBAR_ITEMS.map(({ icon: Icon, label, href }) => {
          const active = currentPath === href;
          return (
            <button key={label} onClick={() => router.push(href)} style={{
              display: "flex", alignItems: "center", gap: "12px",
              padding: "12px 16px", borderRadius: "10px", marginBottom: "4px",
              background: active ? "rgba(207,48,59,0.12)" : "transparent",
              border: active ? "1px solid rgba(207,48,59,0.2)" : "1px solid transparent",
              color: active ? "#cf303b" : "rgba(255,255,255,0.5)",
              fontSize: "14px", fontWeight: active ? 600 : 400,
              cursor: "pointer", textAlign: "left", width: "100%", transition: "all 0.2s",
            }}>
              <Icon size={16} />{label}
            </button>
          );
        })}

        <div style={{ marginTop: "auto" }}>
          <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.3)", paddingLeft: "8px", marginBottom: "12px" }}>
            {firstName}
          </div>
          <button onClick={() => signOut({ redirectUrl: "/" })} style={{
            display: "flex", alignItems: "center", gap: "8px",
            padding: "10px 16px", borderRadius: "10px", width: "100%",
            background: "transparent", border: "1px solid rgba(255,255,255,0.06)",
            color: "rgba(255,255,255,0.3)", fontSize: "13px", cursor: "pointer",
          }}>
            <LogOut size={14} /> Sign out
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: "auto" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 24px" }}>
          <p style={{
            fontSize: "13px", color: "#cf303b", fontWeight: 600,
            letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "8px",
          }}>
            Fasting Intelligence
          </p>
          <h1 style={{
            fontFamily: "var(--font-syne)", fontSize: "36px", fontWeight: 800,
            lineHeight: 1.1, marginBottom: "8px",
          }}>
            Fasting Modes
          </h1>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "15px", marginBottom: "32px" }}>
            Toggle your active fasting mode. Your meal and workout plans adapt automatically.
          </p>

          {fetchError && (
            <div style={{
              background: "rgba(207,48,59,0.08)", border: "1px solid rgba(207,48,59,0.2)",
              borderRadius: "12px", padding: "14px 20px", marginBottom: "20px",
              fontSize: "13px", color: "#e28389",
            }}>
              Could not load saved settings — backend may be offline. Changes here won't be saved until backend is running.
            </div>
          )}

          {activeCount > 0 && (
            <div style={{
              background: "linear-gradient(135deg, #d85a62 0%, #cf303b 50%, #7c1d23 100%)",
              borderRadius: "16px", padding: "16px 24px", marginBottom: "24px",
              display: "flex", alignItems: "center", gap: "12px",
            }}>
              <Moon size={20} color="white" />
              <span style={{ fontSize: "14px", fontWeight: 600 }}>
                {activeCount} fasting mode{activeCount > 1 ? "s" : ""} active — your plans are adapting
              </span>
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "24px" }}>
            {FASTING_TYPES.map(({ key, emoji, title, subtitle, description, color, accent, hasWindow, hasCustomTime }: any) => {
              const isOn = !!settings[key];
              return (
                <div key={key} style={{
                  background: isOn ? color : "#141414",
                  border: `1px solid ${isOn ? accent + "50" : "rgba(255,255,255,0.08)"}`,
                  borderRadius: "20px", padding: "24px", transition: "all 0.3s",
                }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "16px", flex: 1 }}>
                      <span style={{ fontSize: "32px", lineHeight: 1 }}>{emoji}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                          <span style={{ fontFamily: "var(--font-syne)", fontSize: "18px", fontWeight: 700 }}>
                            {title}
                          </span>
                          <span style={{
                            fontSize: "11px",
                            color: isOn ? accent : "rgba(255,255,255,0.3)",
                            background: isOn ? `${accent}20` : "rgba(255,255,255,0.06)",
                            border: `1px solid ${isOn ? accent + "40" : "rgba(255,255,255,0.08)"}`,
                            borderRadius: "999px", padding: "2px 8px",
                          }}>
                            {subtitle}
                          </span>
                        </div>
                        <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", lineHeight: 1.5, margin: 0 }}>
                          {description}
                        </p>

                        {hasWindow && isOn && (
                          <div style={{ marginTop: "12px" }}>
                            <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", marginBottom: "8px" }}>
                              Fasting Window
                            </div>
                            <div style={{ display: "flex", gap: "8px" }}>
                              {["16:8", "18:6", "OMAD"].map((w) => (
                                <button key={w}
                                  onClick={() => setSettings((prev) => ({ ...prev, if_window: w }))}
                                  style={{
                                    padding: "6px 14px", borderRadius: "8px", fontSize: "13px", cursor: "pointer",
                                    background: settings.if_window === w ? accent : "rgba(255,255,255,0.06)",
                                    border: `1px solid ${settings.if_window === w ? accent : "rgba(255,255,255,0.1)"}`,
                                    color: settings.if_window === w ? "white" : "rgba(255,255,255,0.6)",
                                    fontWeight: settings.if_window === w ? 600 : 400,
                                  }}
                                >
                                  {w}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {hasCustomTime && isOn && (
                          <div style={{ marginTop: "12px", display: "flex", gap: "16px" }}>
                            <div>
                              <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", marginBottom: "6px" }}>
                                Fast Start
                              </div>
                              <input
                                type="time"
                                value={settings.custom_start || "08:00"}
                                onChange={(e) => setSettings((prev) => ({ ...prev, custom_start: e.target.value }))}
                                style={{
                                  background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)",
                                  borderRadius: "8px", padding: "8px 12px", color: "white", fontSize: "14px",
                                }}
                              />
                            </div>
                            <div>
                              <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", marginBottom: "6px" }}>
                                Fast End
                              </div>
                              <input
                                type="time"
                                value={settings.custom_end || "16:00"}
                                onChange={(e) => setSettings((prev) => ({ ...prev, custom_end: e.target.value }))}
                                style={{
                                  background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)",
                                  borderRadius: "8px", padding: "8px 12px", color: "white", fontSize: "14px",
                                }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Toggle */}
                    <button
                      onClick={() => toggle(key)}
                      style={{
                        width: "52px", height: "28px", borderRadius: "999px",
                        background: isOn ? accent : "rgba(255,255,255,0.1)",
                        border: "none", cursor: "pointer", position: "relative",
                        flexShrink: 0, transition: "all 0.3s", marginLeft: "16px",
                      }}
                    >
                      <div style={{
                        position: "absolute", top: "4px",
                        left: isOn ? "28px" : "4px",
                        width: "20px", height: "20px", borderRadius: "50%",
                        background: "white", transition: "left 0.3s",
                      }} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              width: "100%", padding: "16px",
              background: saved
                ? "rgba(76,175,80,0.2)"
                : "linear-gradient(135deg, #d85a62, #cf303b)",
              border: saved ? "1px solid rgba(76,175,80,0.4)" : "none",
              borderRadius: "12px",
              color: saved ? "#81c784" : "white",
              fontSize: "15px", fontWeight: 700, cursor: saving ? "default" : "pointer",
              fontFamily: "var(--font-syne)", transition: "all 0.3s",
            }}
          >
            {saving ? "Saving..." : saved ? "✓ Saved!" : "Save Fasting Settings"}
          </button>
        </div>
      </div>
    </div>
  );
}