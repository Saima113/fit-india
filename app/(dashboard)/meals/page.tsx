"use client";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useClerk } from "@clerk/nextjs";
import {
  Utensils, RotateCcw, LogOut, Dumbbell,
  TrendingUp, Moon, Calculator, User
} from "lucide-react";

interface Meal {
  name: string;
  ingredients: string[];
  calories: number;
  protein_g: number;
  prep_time: string;
  time?: string;
  notes?: string | null;
}

interface NormalMealPlan {
  total_calories: number;
  total_protein_g: number;
  diet_type: string;
  fasting_mode: string;
  breakfast: Meal;
  lunch: Meal;
  dinner: Meal;
  snacks: Meal[];
  hydration_tip: string;
  nutritionist_note: string;
}

interface RamzanMealPlan {
  total_calories: number;
  total_protein_g: number;
  diet_type: string;
  fasting_mode: "ramzan";
  sehri: Meal;
  iftar: Meal;
  post_iftar_snack: Meal;
  hydration_tip: string;
  workout_tip?: string;
  nutritionist_note: string;
}

type MealPlan = NormalMealPlan | RamzanMealPlan;

function isRamzan(plan: MealPlan): plan is RamzanMealPlan {
  return plan.fasting_mode === "ramzan" || "sehri" in plan;
}

const SIDEBAR_ITEMS = [
  { icon: Dumbbell,    label: "Workout",  href: "/dashboard" },
  { icon: Utensils,   label: "Meals",    href: "/meals" },
  { icon: Calculator, label: "Calories", href: "/calories" },
  { icon: Moon,       label: "Fasting",  href: "/fasting" },
  { icon: TrendingUp, label: "Progress", href: "/progress" },
  { icon: User, label: "Profile", href: "/profile" },
];

export default function MealsPage() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const [meals, setMeals] = useState<MealPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const firstName =
    user?.firstName ||
    user?.emailAddresses?.[0]?.emailAddress?.split("@")[0] ||
    "there";

  const fetchMeals = async () => {
    if (!user) return;
    setLoading(true);
    setError("");
    try {
      const profileRes = await fetch(`http://localhost:8000/profile/${user.id}`);
      const profileData = await profileRes.json();
      if (!profileData.exists) { router.push("/onboarding"); return; }
      const res = await fetch("http://localhost:8000/generate-meals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clerk_user_id: user.id, ...profileData }),
      });
      const data = await res.json();
      setMeals(data.meal_plan);
    } catch {
      setError("Failed to load meal plan. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (user) fetchMeals(); }, [user]);

  const currentPath = typeof window !== "undefined" ? window.location.pathname : "/meals";

  return (
    <div style={{ minHeight: "100vh", background: "#0d0d0d", color: "white", fontFamily: "var(--font-dm-sans)", display: "flex" }}>

      {/* Sidebar */}
      <div style={{ width: "220px", flexShrink: 0, background: "#141414", borderRight: "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "column", padding: "24px 16px", position: "sticky", top: 0, height: "100vh" }}>
        <div style={{ fontFamily: "var(--font-syne)", fontSize: "20px", fontWeight: 800, marginBottom: "40px", paddingLeft: "8px" }}>
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
          <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.3)", paddingLeft: "8px", marginBottom: "12px" }}>{firstName}</div>
          <button onClick={() => signOut({ redirectUrl: "/" })} style={{
            display: "flex", alignItems: "center", gap: "8px", padding: "10px 16px",
            borderRadius: "10px", width: "100%", background: "transparent",
            border: "1px solid rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.3)",
            fontSize: "13px", cursor: "pointer",
          }}>
            <LogOut size={14} /> Sign out
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: "auto" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", padding: "40px 24px" }}>
          <p style={{ fontSize: "13px", color: "#cf303b", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "8px" }}>Today's Nutrition</p>
          <h1 style={{ fontFamily: "var(--font-syne)", fontSize: "36px", fontWeight: 800, lineHeight: 1.1, marginBottom: "8px" }}>Your Meal Plan</h1>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "15px", fontWeight: 300, marginBottom: "32px" }}>
            {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
          </p>

          {loading && (
            <div style={{ background: "#141414", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "20px", padding: "60px", textAlign: "center" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "50%", border: "3px solid rgba(207,48,59,0.2)", borderTop: "3px solid #cf303b", margin: "0 auto 20px", animation: "spin 1s linear infinite" }} />
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              <p style={{ color: "rgba(255,255,255,0.4)" }}>Generating your personalised Indian meal plan...</p>
            </div>
          )}

          {error && !loading && (
            <div style={{ background: "rgba(207,48,59,0.1)", border: "1px solid rgba(207,48,59,0.3)", borderRadius: "16px", padding: "24px", color: "#e28389" }}>
              {error}
            </div>
          )}

          {meals && !loading && (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

              {/* Ramzan badge */}
              {isRamzan(meals) && (
                <div style={{ background: "linear-gradient(135deg, #0f2034, #1a3a5c)", border: "1px solid rgba(61,139,205,0.3)", borderRadius: "16px", padding: "16px 24px", display: "flex", alignItems: "center", gap: "12px" }}>
                  {/* <span style={{ fontSize: "24px" }}></span> */}
                  <div>
                    <div style={{ fontSize: "13px", fontWeight: 700, color: "#3d8bcd", marginBottom: "2px" }}>Ramzan Mubarak — Roza Mode Active</div>
                    <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)" }}>Your plan follows Sehri → Iftar → Dinner timing</div>
                  </div>
                </div>
              )}

              {/* Macro stats */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
                {[
                  { label: "Total Calories", value: `${meals.total_calories} kcal` },
                  { label: "Total Protein",  value: `${meals.total_protein_g}g` },
                  { label: "Diet Type",      value: meals.diet_type },
                ].map(({ label, value }) => (
                  <div key={label} style={{ background: "#141414", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "20px" }}>
                    <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>{label}</div>
                    <div style={{ fontSize: "18px", fontWeight: 700, fontFamily: "var(--font-syne)", color: "#cf303b" }}>{value}</div>
                  </div>
                ))}
              </div>

              {/* Nutritionist note */}
              <div style={{ background: "linear-gradient(135deg, #d85a62 0%, #cf303b 50%, #7c1d23 100%)", borderRadius: "16px", padding: "20px 24px" }}>
                <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.7)", marginBottom: "6px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>Nutritionist Note</div>
                <div style={{ fontSize: "14px", color: "white", lineHeight: 1.6, fontWeight: 300 }}>{meals.nutritionist_note}</div>
              </div>

              {/* ── Ramzan layout ── */}
              {isRamzan(meals) ? (
                <>
                  <MealCard title="Sehri"             meal={meals.sehri}            emoji="" timeLabel={meals.sehri?.time} />
                  <MealCard title="Iftar"             meal={meals.iftar}            emoji="" timeLabel={meals.iftar?.time} />
                  <MealCard title="Post-Iftar Dinner" meal={meals.post_iftar_snack} emoji="" timeLabel={meals.post_iftar_snack?.time} />

                  {meals.workout_tip && (
                    <div style={{ background: "#141414", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "20px 24px", display: "flex", gap: "12px", alignItems: "flex-start" }}>
                      <span style={{ fontSize: "22px" }}>🏋️</span>
                      <div>
                        <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.08em" }}>Workout Tip</div>
                        <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.8)" }}>{meals.workout_tip}</div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                /* ── Normal layout ── */
                <>
                  {(meals as NormalMealPlan).breakfast && <MealCard title="Breakfast" meal={(meals as NormalMealPlan).breakfast} emoji="" />}
                  {(meals as NormalMealPlan).lunch     && <MealCard title="Lunch"     meal={(meals as NormalMealPlan).lunch}     emoji="" />}
                  {(meals as NormalMealPlan).dinner    && <MealCard title="Dinner"    meal={(meals as NormalMealPlan).dinner}    emoji="" />}

                  {(meals as NormalMealPlan).snacks?.length > 0 && (
                    <div style={{ background: "#141414", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "20px", overflow: "hidden" }}>
                      <div style={{ padding: "16px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                        <h3 style={{ fontFamily: "var(--font-syne)", fontSize: "16px", fontWeight: 700, margin: 0 }}> Snacks</h3>
                      </div>
                      {(meals as NormalMealPlan).snacks.map((snack, i) => (
                        <div key={i} style={{ padding: "16px 24px", borderBottom: i < (meals as NormalMealPlan).snacks.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                          <div style={{ fontSize: "14px", fontWeight: 600, marginBottom: "4px" }}>{snack.name}</div>
                          <div style={{ fontSize: "12px", color: "#cf303b" }}>{snack.calories} kcal · {snack.protein_g}g protein</div>
                          {snack.notes && <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)", marginTop: "4px", fontStyle: "italic" }}>{snack.notes}</div>}
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* Hydration */}
              <div style={{ background: "#141414", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "20px 24px", display: "flex", gap: "12px", alignItems: "center" }}>
                <span style={{ fontSize: "24px" }}>💧</span>
                <div>
                  <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.08em" }}>Hydration Tip</div>
                  <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.8)" }}>{meals.hydration_tip}</div>
                </div>
              </div>

              <button onClick={fetchMeals} style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "12px", padding: "14px", color: "rgba(255,255,255,0.4)",
                fontSize: "14px", cursor: "pointer",
              }}>
                <RotateCcw size={14} /> Generate new meal plan
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// REPLACE your MealCard function at the bottom of meals/page.tsx with this.
// Changes: ingredient pills are now colored, have emojis, better contrast and visibility.

function MealCard({ title, meal, emoji, timeLabel }: {
  title: string;
  meal: Meal | undefined;
  emoji: string;
  timeLabel?: string;
}) {
  if (!meal) return null;

  // Assign subtle accent colors to ingredient pills by cycling
  const pillColors = [
    { bg: "rgba(207,48,59,0.12)",  border: "rgba(207,48,59,0.25)",  text: "#e28389" },
    { bg: "rgba(255,160,50,0.12)", border: "rgba(255,160,50,0.25)", text: "#ffa832" },
    { bg: "rgba(80,180,120,0.12)", border: "rgba(80,180,120,0.25)", text: "#50b478" },
    { bg: "rgba(100,160,255,0.1)", border: "rgba(100,160,255,0.25)", text: "#6aa0ff" },
    { bg: "rgba(200,120,255,0.1)", border: "rgba(200,120,255,0.25)", text: "#c878ff" },
  ];

  return (
    <div style={{
      background: "#141414",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: "20px",
      overflow: "hidden",
    }}>
      {/* Header */}
      <div style={{
        padding: "16px 24px",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <h3 style={{ fontFamily: "var(--font-syne)", fontSize: "16px", fontWeight: 700, margin: 0 }}>
          {emoji} {title}
        </h3>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          {timeLabel && (
            <span style={{
              fontSize: "12px", color: "#cf303b",
              background: "rgba(207,48,59,0.1)", border: "1px solid rgba(207,48,59,0.2)",
              padding: "3px 10px", borderRadius: "999px", fontWeight: 600,
            }}>
              {timeLabel}
            </span>
          )}
          {meal.prep_time && (
            <span style={{
              fontSize: "12px", color: "rgba(255,255,255,0.4)",
              background: "rgba(255,255,255,0.06)",
              padding: "4px 10px", borderRadius: "999px",
            }}>
              ⏱ {meal.prep_time}
            </span>
          )}
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "20px 24px" }}>
        {/* Meal name */}
        <div style={{ fontSize: "17px", fontWeight: 700, marginBottom: "10px", fontFamily: "var(--font-syne)" }}>
          {meal.name}
        </div>

        {/* Macros */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "16px", flexWrap: "wrap" }}>
          <span style={{
            fontSize: "13px", color: "white", fontWeight: 700,
            background: "rgba(207,48,59,0.15)", border: "1px solid rgba(207,48,59,0.3)",
            borderRadius: "8px", padding: "4px 12px",
          }}>
             {meal.calories} kcal
          </span>
          <span style={{
            fontSize: "13px", color: "white", fontWeight: 600,
            background: "rgba(80,180,120,0.12)", border: "1px solid rgba(80,180,120,0.25)",
            borderRadius: "8px", padding: "4px 12px",
          }}>
             {meal.protein_g}g protein
          </span>
        </div>

        {/* Ingredients label */}
        {meal.ingredients?.length > 0 && (
          <>
            <div style={{
              fontSize: "11px", color: "rgba(255,255,255,0.35)",
              textTransform: "uppercase", letterSpacing: "0.1em",
              marginBottom: "10px", fontWeight: 600,
            }}>
              Ingredients
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {meal.ingredients.map((ing, i) => {
                const col = pillColors[i % pillColors.length];
                return (
                  <span key={i} style={{
                    fontSize: "13px",
                    background: col.bg,
                    border: `1px solid ${col.border}`,
                    borderRadius: "8px",
                    padding: "6px 14px",
                    color: col.text,
                    fontWeight: 500,
                    lineHeight: 1,
                  }}>
                    {ing}
                  </span>
                );
              })}
            </div>
          </>
        )}

        {/* Notes */}
        {meal.notes && (
          <div style={{
            fontSize: "13px", color: "rgba(255,255,255,0.45)",
            marginTop: "14px", fontStyle: "italic",
            borderLeft: "2px solid rgba(207,48,59,0.3)",
            paddingLeft: "12px", lineHeight: 1.5,
          }}>
             {meal.notes}
          </div>
        )}
      </div>
    </div>
  );
}