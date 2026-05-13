"use client";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useClerk } from "@clerk/nextjs";
import {
  Dumbbell, Utensils, TrendingUp, Moon,
  Calculator, LogOut, User, Edit2,
} from "lucide-react";

interface ProfileData {
  exists: boolean;
  goal: string;
  age: number;
  height_cm: number;
  weight_kg: number;
  activity_level: string;
  diet_type: string;
  medical_conditions: string[];
  lifestyle_mode: string;
  fasting_types: string[];
  workout_location: string;
  bmi: number;
  bmi_category: string;
  fasting_settings: Record<string, any> | null;
  total_workouts: number;
  last_workout: string | null;
  weight_history: { date: string; weight_kg: number }[];
  display_name: string;
}

const NAV_ITEMS = [
  { icon: Dumbbell,    label: "Workout",  href: "/dashboard" },
  { icon: Utensils,   label: "Meals",    href: "/meals" },
  { icon: Calculator, label: "Calories", href: "/calories" },
  { icon: Moon,       label: "Fasting",  href: "/fasting" },
  { icon: TrendingUp, label: "Progress", href: "/progress" },
  { icon: User,       label: "Profile",  href: "/profile" },
];

const BMI_COLOR: Record<string, string> = {
  Underweight: "#6aa0ff",
  Healthy:     "#50b478",
  Overweight:  "#ffa832",
  Obese:       "#cf303b",
};

const GOAL_LABELS: Record<string, string> = {
  "lose_weight":   "Weight Loss",
  "gain_muscle":   "Muscle Gain",
  "maintain":      "Maintain Weight",
  "recomposition": "Body Recomposition",
  "endurance":     "Build Endurance",
};

const ACTIVITY_LABELS: Record<string, string> = {
  "sedentary":   "Sedentary (desk job, little movement)",
  "light":       "Lightly Active (walks, light exercise)",
  "moderate":    "Moderately Active (3-5 days/week)",
  "very_active": "Very Active (6-7 days/week)",
  "athlete":     "Athlete (2x/day training)",
};

export default function ProfilePage() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editWeight, setEditWeight] = useState("");
  const [editGoal, setEditGoal] = useState("");
  const [editName, setEditName] = useState("");   // ← correctly inside component
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const firstName = user?.firstName || user?.emailAddresses?.[0]?.emailAddress?.split("@")[0] || "there";
  const displayName = profile?.display_name || firstName;
  const currentPath = typeof window !== "undefined" ? window.location.pathname : "/profile";

  const fetchProfile = async () => {
    if (!user) return;
    const res = await fetch(`process.env.NEXT_PUBLIC_API_URL/profile-full/${user.id}`);
    const data = await res.json();
    setProfile(data);
    setEditWeight(String(data.weight_kg || ""));
    setEditGoal(data.goal || "");
    setEditName(data.display_name || "");  // ← seed from fetched data
    setLoading(false);
  };

  useEffect(() => { if (user) fetchProfile(); }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    await fetch(`process.env.NEXT_PUBLIC_API_URL/profile/${user.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        weight_kg: parseFloat(editWeight) || undefined,
        goal: editGoal || undefined,
        display_name: editName || undefined,
      }),
    });
    await fetchProfile();
    setSaving(false); setSaved(true); setEditing(false);
    setTimeout(() => setSaved(false), 2000);
  };

  const getActiveFastings = () => {
    if (!profile?.fasting_settings) return [];
    const s = profile.fasting_settings;
    const active = [];
    if (s.ramzan)               active.push({ name: "Ramzan", emoji: "🌙" });
    if (s.navratri)             active.push({ name: "Navratri", emoji: "🪔" });
    if (s.ekadashi)             active.push({ name: "Ekadashi", emoji: "⭐" });
    if (s.jain_mode)            active.push({ name: "Jain Mode", emoji: "🌿" });
    if (s.intermittent_fasting) active.push({ name: `IF ${s.if_window}`, emoji: "⏱️" });
    if (s.custom_fast)          active.push({ name: "Custom Fast", emoji: "⚙️" });
    return active;
  };

  // BMI gauge component — defined inside so it can be used in JSX below
  const BmiGauge = ({ bmi, category }: { bmi: number; category: string }) => {
    const pct = Math.min(Math.max(((bmi - 10) / 30) * 100, 0), 100);
    const color = BMI_COLOR[category] || "#cf303b";
    return (
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
          <span style={{ fontFamily: "var(--font-syne)", fontSize: "32px", fontWeight: 800, color }}>{bmi}</span>
          <span style={{ fontSize: "13px", color, background: `${color}20`, border: `1px solid ${color}40`, borderRadius: "8px", padding: "4px 12px", alignSelf: "center", fontWeight: 600 }}>
            {category}
          </span>
        </div>
        <div style={{ height: "8px", background: "rgba(255,255,255,0.08)", borderRadius: "999px", overflow: "hidden", marginBottom: "8px" }}>
          <div style={{ height: "100%", width: `${pct}%`, background: `linear-gradient(90deg, #50b478, ${color})`, borderRadius: "999px", transition: "width 0.8s ease" }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "rgba(255,255,255,0.3)" }}>
          <span>Underweight &lt;18.5</span>
          <span>Healthy 18.5-25</span>
          <span>Overweight 25-30</span>
          <span>Obese 30+</span>
        </div>
      </div>
    );
  };

  const inputStyle: React.CSSProperties = {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "10px", padding: "12px 16px",
    color: "white", fontSize: "14px",
    width: "100%", boxSizing: "border-box",
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0d0d0d", color: "white", fontFamily: "var(--font-dm-sans)", display: "flex" }}>

      {/* Sidebar */}
      <div style={{ width: "220px", flexShrink: 0, background: "#141414", borderRight: "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "column", padding: "24px 16px", position: "sticky", top: 0, height: "100vh" }}>
        <div style={{ fontFamily: "var(--font-syne)", fontSize: "20px", fontWeight: 800, marginBottom: "40px", paddingLeft: "8px" }}>
          Fit<span style={{ color: "#cf303b" }}>India</span>
        </div>
        {NAV_ITEMS.map(({ icon: Icon, label, href }) => {
          const active = currentPath === href;
          return (
            <button key={label} onClick={() => router.push(href)} style={{
              display: "flex", alignItems: "center", gap: "12px",
              padding: "12px 16px", borderRadius: "10px", marginBottom: "4px",
              background: active ? "rgba(207,48,59,0.12)" : "transparent",
              border: active ? "1px solid rgba(207,48,59,0.2)" : "1px solid transparent",
              color: active ? "#cf303b" : "rgba(255,255,255,0.5)",
              fontSize: "14px", fontWeight: active ? 600 : 400,
              cursor: "pointer", textAlign: "left", width: "100%",
            }}>
              <Icon size={16} />{label}
            </button>
          );
        })}
        <div style={{ marginTop: "auto" }}>
          <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.3)", paddingLeft: "8px", marginBottom: "12px" }}>{displayName}</div>
          <button onClick={() => signOut({ redirectUrl: "/" })} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 16px", borderRadius: "10px", width: "100%", background: "transparent", border: "1px solid rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.3)", fontSize: "13px", cursor: "pointer" }}>
            <LogOut size={14} /> Sign out
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: "auto" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", padding: "40px 24px" }}>
          <p style={{ fontSize: "13px", color: "#cf303b", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "8px" }}>Your Account</p>
          <h1 style={{ fontFamily: "var(--font-syne)", fontSize: "36px", fontWeight: 800, lineHeight: 1.1, marginBottom: "32px" }}>Profile</h1>

          {loading && (
            <div style={{ background: "#141414", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "20px", padding: "60px", textAlign: "center" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "50%", border: "3px solid rgba(207,48,59,0.2)", borderTop: "3px solid #cf303b", margin: "0 auto 20px", animation: "spin 1s linear infinite" }} />
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          )}

          {profile && !loading && (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

              {/* Avatar + name card */}
              <div style={{ background: "linear-gradient(135deg, #d85a62 0%, #cf303b 50%, #7c1d23 100%)", borderRadius: "20px", padding: "28px 32px", display: "flex", alignItems: "center", gap: "20px" }}>
                <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px", flexShrink: 0 }}>
                  {displayName[0]?.toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "var(--font-syne)", fontSize: "22px", fontWeight: 800 }}>{displayName}</div>
                  <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)", marginTop: "2px" }}>{user?.emailAddresses?.[0]?.emailAddress}</div>
                  <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)", marginTop: "6px" }}>
                    🎯 {GOAL_LABELS[profile.goal] || profile.goal} · 💪 {profile.total_workouts} workouts completed
                  </div>
                </div>
                <button
                  onClick={() => setEditing(!editing)}
                  style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "10px", padding: "8px 16px", color: "white", fontSize: "13px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}
                >
                  <Edit2 size={14} /> Edit
                </button>
              </div>

              {/* Edit panel */}
              {editing && (
                <div style={{ background: "#141414", border: "1px solid rgba(207,48,59,0.2)", borderRadius: "20px", padding: "24px" }}>
                  <h3 style={{ fontFamily: "var(--font-syne)", fontSize: "16px", fontWeight: 700, marginBottom: "20px", marginTop: 0 }}>Update Details</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                    <div>
                      <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", marginBottom: "8px" }}>Display Name</div>
                      <input
                        value={editName}
                        onChange={e => setEditName(e.target.value)}
                        placeholder="How should we call you?"
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", marginBottom: "8px" }}>Current Weight (kg)</div>
                      <input
                        type="number"
                        value={editWeight}
                        onChange={e => setEditWeight(e.target.value)}
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", marginBottom: "8px" }}>Goal</div>
                      <select
                        value={editGoal}
                        onChange={e => setEditGoal(e.target.value)}
                        style={{ ...inputStyle, cursor: "pointer" }}
                      >
                        {Object.entries(GOAL_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                      </select>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "12px" }}>
                    <button onClick={handleSave} disabled={saving} style={{ flex: 1, padding: "12px", background: "linear-gradient(135deg, #d85a62, #cf303b)", border: "none", borderRadius: "10px", color: "white", fontSize: "14px", fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-syne)" }}>
                      {saving ? "Saving..." : saved ? "✓ Saved!" : "Save Changes"}
                    </button>
                    <button onClick={() => setEditing(false)} style={{ padding: "12px 20px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", color: "rgba(255,255,255,0.5)", fontSize: "14px", cursor: "pointer" }}>
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Stats grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
                {[
                  { label: "Age",      value: `${profile.age} yrs` },
                  { label: "Height",   value: `${profile.height_cm} cm` },
                  { label: "Weight",   value: `${profile.weight_kg} kg` },
                  { label: "Workouts", value: profile.total_workouts },
                ].map(({ label, value }) => (
                  <div key={label} style={{ background: "#141414", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "20px", textAlign: "center" }}>
                    <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>{label}</div>
                    <div style={{ fontSize: "22px", fontWeight: 800, fontFamily: "var(--font-syne)" }}>{value}</div>
                  </div>
                ))}
              </div>

              {/* BMI card */}
              {profile.bmi && (
                <div style={{ background: "#141414", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "20px", padding: "24px" }}>
                  <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "16px" }}>Body Mass Index (BMI)</div>
                  <BmiGauge bmi={profile.bmi} category={profile.bmi_category} />
                  <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", marginTop: "12px" }}>
                    {profile.bmi_category === "Healthy"     && "Great! Your BMI is in the healthy range. Keep it up! 🌟"}
                    {profile.bmi_category === "Underweight" && "Your plan is adjusted to help you build healthy weight through nutrition and strength training."}
                    {profile.bmi_category === "Overweight"  && "Your meal and workout plans are personalised to help you reach a healthier range at your own pace. No rush. 💪"}
                    {profile.bmi_category === "Obese"       && "Your plans focus on sustainable, gradual progress. Every step counts. You're already doing the right thing by being here. 🌱"}
                  </div>
                </div>
              )}

              {/* Profile details */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>

                {/* Left: goal + lifestyle */}
                <div style={{ background: "#141414", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "20px", padding: "24px" }}>
                  <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "16px" }}>Your Profile</div>
                  {[
                    { label: "Goal",             value: GOAL_LABELS[profile.goal] || profile.goal },
                    { label: "Activity Level",   value: ACTIVITY_LABELS[profile.activity_level] || profile.activity_level },
                    { label: "Diet Type",        value: profile.diet_type },
                    { label: "Workout Location", value: profile.workout_location },
                    { label: "Lifestyle Mode",   value: profile.lifestyle_mode || "Standard" },
                  ].map(({ label, value }) => value ? (
                    <div key={label} style={{ marginBottom: "14px" }}>
                      <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", marginBottom: "4px" }}>{label}</div>
                      <div style={{ fontSize: "14px", fontWeight: 500 }}>{value}</div>
                    </div>
                  ) : null)}
                </div>

                {/* Right: medical + fasting */}
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

                  {/* Medical conditions */}
                  <div style={{ background: "#141414", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "20px", padding: "24px", flex: 1 }}>
                    <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "16px" }}>Medical Conditions</div>
                    {profile.medical_conditions?.length > 0 ? (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                        {profile.medical_conditions.map((c, i) => (
                          <span key={i} style={{ fontSize: "12px", background: "rgba(207,48,59,0.1)", border: "1px solid rgba(207,48,59,0.2)", borderRadius: "8px", padding: "5px 12px", color: "#e28389", fontWeight: 500 }}>
                            {c}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.3)" }}>None selected</span>
                    )}
                    {profile.medical_conditions?.length > 0 && (
                      <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)", marginTop: "12px" }}>
                        ✓ Your meal and workout plans are adjusted for these conditions
                      </div>
                    )}
                  </div>

                  {/* Active fasting modes */}
                  <div style={{ background: "#141414", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "20px", padding: "24px", flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                      <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Active Fasting Modes</div>
                      <button onClick={() => router.push("/fasting")} style={{ fontSize: "12px", color: "#cf303b", background: "transparent", border: "none", cursor: "pointer", textDecoration: "underline" }}>
                        Manage →
                      </button>
                    </div>
                    {getActiveFastings().length > 0 ? (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                        {getActiveFastings().map((f, i) => (
                          <span key={i} style={{ fontSize: "12px", background: "rgba(61,139,205,0.1)", border: "1px solid rgba(61,139,205,0.25)", borderRadius: "8px", padding: "5px 12px", color: "#6aa0ff", fontWeight: 500 }}>
                            {f.emoji} {f.name}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.3)" }}>No fasting modes active</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Weight history */}
              {profile.weight_history?.length > 1 && (
                <div style={{ background: "#141414", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "20px", padding: "24px" }}>
                  <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "20px" }}>Weight History</div>
                  <div style={{ display: "flex", alignItems: "flex-end", gap: "8px", height: "80px" }}>
                    {profile.weight_history.slice(-12).map((w, i) => {
                      const all = profile.weight_history.slice(-12);
                      const min = Math.min(...all.map(x => x.weight_kg));
                      const max = Math.max(...all.map(x => x.weight_kg));
                      const range = max - min || 1;
                      const pct = ((w.weight_kg - min) / range) * 60 + 20;
                      return (
                        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                          <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)" }}>{w.weight_kg}</div>
                          <div style={{ width: "100%", height: `${pct}px`, background: i === all.length - 1 ? "#cf303b" : "rgba(207,48,59,0.3)", borderRadius: "4px 4px 0 0" }} />
                          <div style={{ fontSize: "9px", color: "rgba(255,255,255,0.2)" }}>
                            {new Date(w.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: "12px", fontSize: "13px" }}>
                    <span style={{ color: "rgba(255,255,255,0.4)" }}>
                      Start: <span style={{ color: "white", fontWeight: 600 }}>{profile.weight_history[0]?.weight_kg} kg</span>
                    </span>
                    <span style={{ color: "rgba(255,255,255,0.4)" }}>
                      Now: <span style={{ color: "#cf303b", fontWeight: 600 }}>{profile.weight_history[profile.weight_history.length - 1]?.weight_kg} kg</span>
                    </span>
                    <span style={{ color: "rgba(255,255,255,0.4)" }}>
                      Change: <span style={{ color: "#50b478", fontWeight: 600 }}>
                        {(profile.weight_history[profile.weight_history.length - 1]?.weight_kg - profile.weight_history[0]?.weight_kg).toFixed(1)} kg
                      </span>
                    </span>
                  </div>
                </div>
              )}

              {/* Quick links */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px" }}>
                {[
                  { label: "View Progress Photos", href: "/photos" },
                  { label: "Track Calories Today", href: "/calories" },
                ].map(({ label, href }) => (
                  <button key={label} onClick={() => router.push(href)} style={{
                    background: "#141414", border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "16px", padding: "20px", cursor: "pointer",
                    textAlign: "center" as const, color: "white", transition: "all 0.2s",
                  }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(207,48,59,0.3)")}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
                  >
                    {/* <div style={{ fontSize: "24px", marginBottom: "8px" }}>{emoji}</div> */}
                    <div style={{ fontSize: "13px", fontWeight: 500 }}>{label}</div>
                  </button>
                ))}
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}
