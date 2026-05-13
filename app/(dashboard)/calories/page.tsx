import API_URL from "@/lib/api";
"use client";
import { useEffect, useRef, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useClerk } from "@clerk/nextjs";
import {
  Flame,
  Plus,
  Trash2,
  Dumbbell,
  Utensils,
  TrendingUp,
  LogOut,
  User,
} from "lucide-react";
import { Moon, Calculator } from "lucide-react";

interface CalorieEntry {
  food_name: string;
  calories: number;
  protein_g: number;
  meal_type: string;
  logged_at: string;
}

// ✅ MEAL_TYPES stays outside — it's a constant, not state, so this is fine
const MEAL_TYPES = ["Breakfast", "Lunch", "Dinner", "Snack"];

const SIDEBAR_ITEMS = [
  { icon: Dumbbell, label: "Workout", href: "/dashboard" },
  { icon: Utensils, label: "Meals", href: "/meals" },
  { icon: Calculator, label: "Calories", href: "/calories" },
  { icon: Moon, label: "Fasting", href: "/fasting" },
  { icon: TrendingUp, label: "Progress", href: "/progress" },
  { icon: User, label: "Profile", href: "/profile" },
];

const COMMON_FOODS = [
  { name: "Roti (1 piece)", calories: 80, protein_g: 3 },
  { name: "Rice (1 cup cooked)", calories: 206, protein_g: 4 },
  { name: "Dal (1 cup)", calories: 120, protein_g: 9 },
  { name: "Paneer (100g)", calories: 265, protein_g: 18 },
  { name: "Egg (1 whole)", calories: 78, protein_g: 6 },
  { name: "Banana (1 medium)", calories: 89, protein_g: 1 },
  { name: "Chicken breast (100g)", calories: 165, protein_g: 31 },
  { name: "Dahi (1 cup)", calories: 98, protein_g: 9 },
  { name: "Poha (1 cup)", calories: 270, protein_g: 5 },
  { name: "Samosa (1 piece)", calories: 150, protein_g: 3 },
  { name: "Idli (2 pieces)", calories: 132, protein_g: 4 },
  { name: "Dosa (1 plain)", calories: 168, protein_g: 4 },
];

export default function CaloriesPage() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const [entries, setEntries] = useState<CalorieEntry[]>([]);
  const [totalCal, setTotalCal] = useState(0);
  const [totalProtein, setTotalProtein] = useState(0);
  const [foodName, setFoodName] = useState("");
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [mealType, setMealType] = useState("snack");
  const [adding, setAdding] = useState(false);
  const [showQuick, setShowQuick] = useState(false);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const CALORIE_GOAL = 2000;
  const PROTEIN_GOAL = 80;

  // Close only when clicking OUTSIDE the dropdown wrapper
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  const fetchToday = async () => {
    if (!user) return;
    const res = await fetch(`API_URL/calories/${user.id}/today`);
    const data = await res.json();
    setEntries(data.entries || []);
    setTotalCal(data.total_calories || 0);
    setTotalProtein(data.total_protein || 0);
  };

  useEffect(() => {
    if (user) fetchToday();
  }, [user]);

  const handleAdd = async () => {
    if (!user || !foodName || !calories) return;
    setAdding(true);
    await fetch("API_URL/calories/log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clerk_user_id: user.id,
        food_name: foodName,
        calories: parseInt(calories),
        protein_g: parseFloat(protein) || 0,
        meal_type: mealType,
      }),
    });
    setFoodName("");
    setCalories("");
    setProtein("");
    await fetchToday();
    setAdding(false);
  };

  const handleQuickAdd = async (food: (typeof COMMON_FOODS)[0]) => {
    if (!user) return;
    await fetch("API_URL/calories/log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clerk_user_id: user.id,
        food_name: food.name,
        calories: food.calories,
        protein_g: food.protein_g,
        meal_type: mealType,
      }),
    });
    await fetchToday();
  };

  const calPct = Math.min((totalCal / CALORIE_GOAL) * 100, 100);
  const protPct = Math.min((totalProtein / PROTEIN_GOAL) * 100, 100);

  const inputStyle: React.CSSProperties = {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "10px",
    padding: "12px 16px",
    color: "white",
    fontSize: "14px",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0d0d0d",
        color: "white",
        fontFamily: "var(--font-dm-sans)",
        display: "flex",
      }}
    >
      {/* Sidebar */}
      <div
        style={{
          width: "220px",
          flexShrink: 0,
          background: "#141414",
          borderRight: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          flexDirection: "column",
          padding: "24px 16px",
          position: "sticky",
          top: 0,
          height: "100vh",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-syne)",
            fontSize: "20px",
            fontWeight: 800,
            marginBottom: "40px",
            paddingLeft: "8px",
          }}
        >
          Fit<span style={{ color: "#cf303b" }}>India</span>
        </div>
        {SIDEBAR_ITEMS.map(({ icon: Icon, label, href }) => (
          <button
            key={label}
            onClick={() => router.push(href)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "12px 16px",
              borderRadius: "10px",
              marginBottom: "4px",
              background:
                href === "/dashboard/calories"
                  ? "rgba(207,48,59,0.12)"
                  : "transparent",
              border:
                href === "/dashboard/calories"
                  ? "1px solid rgba(207,48,59,0.2)"
                  : "1px solid transparent",
              color:
                href === "/dashboard/calories"
                  ? "#cf303b"
                  : "rgba(255,255,255,0.5)",
              fontSize: "14px",
              fontWeight: href === "/dashboard/calories" ? 600 : 400,
              cursor: "pointer",
              textAlign: "left" as const,
              width: "100%",
            }}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
        <div style={{ marginTop: "auto" }}>
          <button
            onClick={() => signOut({ redirectUrl: "/" })}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 16px",
              borderRadius: "10px",
              width: "100%",
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.06)",
              color: "rgba(255,255,255,0.3)",
              fontSize: "13px",
              cursor: "pointer",
            }}
          >
            <LogOut size={14} /> Sign out
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: "auto" }}>
        <div
          style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 24px" }}
        >
          <p
            style={{
              fontSize: "13px",
              color: "#cf303b",
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: "8px",
            }}
          >
            Daily Tracking
          </p>
          <h1
            style={{
              fontFamily: "var(--font-syne)",
              fontSize: "36px",
              fontWeight: 800,
              lineHeight: 1.1,
              marginBottom: "8px",
            }}
          >
            Calorie Tracker
          </h1>
          <p
            style={{
              color: "rgba(255,255,255,0.4)",
              fontSize: "15px",
              marginBottom: "32px",
            }}
          >
            {new Date().toLocaleDateString("en-IN", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </p>

          {/* Progress rings */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
              marginBottom: "24px",
            }}
          >
            {[
              {
                label: "Calories",
                current: totalCal,
                goal: CALORIE_GOAL,
                unit: "kcal",
                pct: calPct,
              },
              {
                label: "Protein",
                current: Math.round(totalProtein),
                goal: PROTEIN_GOAL,
                unit: "g",
                pct: protPct,
              },
            ].map(({ label, current, goal, unit, pct }) => (
              <div
                key={label}
                style={{
                  background: "#141414",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "20px",
                  padding: "24px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "16px",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: "11px",
                        color: "rgba(255,255,255,0.4)",
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        marginBottom: "4px",
                      }}
                    >
                      {label}
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--font-syne)",
                        fontSize: "28px",
                        fontWeight: 800,
                      }}
                    >
                      {current}
                      <span
                        style={{
                          fontSize: "14px",
                          fontWeight: 400,
                          color: "rgba(255,255,255,0.4)",
                          marginLeft: "4px",
                        }}
                      >
                        {unit}
                      </span>
                    </div>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "rgba(255,255,255,0.3)",
                        marginTop: "2px",
                      }}
                    >
                      of {goal}
                      {unit} goal
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: "22px",
                      fontWeight: 800,
                      fontFamily: "var(--font-syne)",
                      color: pct >= 100 ? "#cf303b" : "#e28389",
                    }}
                  >
                    {Math.round(pct)}%
                  </div>
                </div>
                <div
                  style={{
                    height: "6px",
                    background: "rgba(255,255,255,0.08)",
                    borderRadius: "999px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${pct}%`,
                      background:
                        pct >= 100
                          ? "linear-gradient(90deg, #d85a62, #cf303b)"
                          : "linear-gradient(90deg, #e28389, #cf303b)",
                      borderRadius: "999px",
                      transition: "width 0.5s ease",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Remaining */}
          <div
            style={{
              background:
                "linear-gradient(135deg, #d85a62 0%, #cf303b 50%, #7c1d23 100%)",
              borderRadius: "16px",
              padding: "20px 24px",
              marginBottom: "24px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "12px",
                  color: "rgba(255,255,255,0.7)",
                  marginBottom: "4px",
                }}
              >
                Remaining today
              </div>
              <div
                style={{
                  fontFamily: "var(--font-syne)",
                  fontSize: "28px",
                  fontWeight: 800,
                }}
              >
                {Math.max(0, CALORIE_GOAL - totalCal)}{" "}
                <span style={{ fontSize: "14px", fontWeight: 400 }}>kcal</span>
              </div>
            </div>
            <Flame size={36} color="rgba(255,255,255,0.3)" />
          </div>

          {/* Add food form */}
          <div
            style={{
              background: "#141414",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "20px",
              padding: "24px",
              marginBottom: "24px",
            }}
          >
            <h3
              style={{
                fontFamily: "var(--font-syne)",
                fontSize: "16px",
                fontWeight: 700,
                marginBottom: "20px",
                marginTop: 0,
              }}
            >
              Log Food
            </h3>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr 1fr",
                gap: "12px",
                marginBottom: "12px",
              }}
            >
              <input
                value={foodName}
                onChange={(e) => setFoodName(e.target.value)}
                placeholder="Food name (e.g. Dal chawal)"
                style={inputStyle}
              />
              <input
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                placeholder="Calories"
                type="number"
                style={inputStyle}
              />
              <input
                value={protein}
                onChange={(e) => setProtein(e.target.value)}
                placeholder="Protein (g)"
                type="number"
                style={inputStyle}
              />
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr auto auto",
                gap: "12px",
                alignItems: "center",
              }}
            >
              <div
                ref={dropdownRef}
                style={{ position: "relative" }}
              >
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  style={{
                    ...inputStyle,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    textAlign: "left",
                    textTransform: "capitalize",
                  }}
                >
                  {mealType}
                  <span style={{ fontSize: "10px", opacity: 0.5 }}>▼</span>
                </button>

                {dropdownOpen && (
                  <div
                    style={{
                      position: "absolute",
                      top: "calc(100% + 6px)",
                      left: 0,
                      right: 0,
                      background: "#1e1e1e",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "10px",
                      overflow: "hidden",
                      zIndex: 100,
                      boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
                    }}
                  >
                    {MEAL_TYPES.map((type) => (
                      <button
                        key={type}
                        onClick={() => {
                          setMealType(type.toLowerCase());
                          setDropdownOpen(false);
                        }}
                        style={{
                          width: "100%",
                          padding: "12px 16px",
                          background:
                            mealType === type.toLowerCase()
                              ? "rgba(207,48,59,0.15)"
                              : "transparent",
                          border: "none",
                          borderBottom: "1px solid rgba(255,255,255,0.04)",
                          color:
                            mealType === type.toLowerCase()
                              ? "#cf303b"
                              : "white",
                          fontSize: "14px",
                          cursor: "pointer",
                          textAlign: "left",
                          fontWeight:
                            mealType === type.toLowerCase() ? 600 : 400,
                          transition: "background 0.15s",
                        }}
                        onMouseEnter={(e) => {
                          if (mealType !== type.toLowerCase())
                            e.currentTarget.style.background =
                              "rgba(255,255,255,0.06)";
                        }}
                        onMouseLeave={(e) => {
                          if (mealType !== type.toLowerCase())
                            e.currentTarget.style.background = "transparent";
                        }}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={() => setShowQuick(!showQuick)}
                style={{
                  padding: "12px 16px",
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "10px",
                  color: "rgba(255,255,255,0.6)",
                  fontSize: "13px",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                Quick Add
              </button>
              <button
                onClick={handleAdd}
                disabled={adding || !foodName || !calories}
                style={{
                  padding: "12px 20px",
                  background: "linear-gradient(135deg, #d85a62, #cf303b)",
                  border: "none",
                  borderRadius: "10px",
                  color: "white",
                  fontSize: "14px",
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  opacity: !foodName || !calories ? 0.5 : 1,
                  fontFamily: "var(--font-syne)",
                }}
              >
                <Plus size={16} /> Add
              </button>
            </div>

            {/* Quick add grid */}
            {showQuick && (
              <div
                style={{
                  marginTop: "16px",
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: "8px",
                }}
              >
                {COMMON_FOODS.map((food) => (
                  <button
                    key={food.name}
                    onClick={() => handleQuickAdd(food)}
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: "8px",
                      padding: "10px 12px",
                      textAlign: "left" as const,
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.borderColor =
                        "rgba(207,48,59,0.4)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.borderColor =
                        "rgba(255,255,255,0.08)")
                    }
                  >
                    <div
                      style={{
                        fontSize: "12px",
                        color: "white",
                        fontWeight: 500,
                        marginBottom: "2px",
                      }}
                    >
                      {food.name}
                    </div>
                    <div style={{ fontSize: "11px", color: "#cf303b" }}>
                      {food.calories} kcal · {food.protein_g}g protein
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Today's log */}
          {entries.length > 0 && (
            <div
              style={{
                background: "#141414",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "20px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  padding: "16px 24px",
                  borderBottom: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <h3
                  style={{
                    fontFamily: "var(--font-syne)",
                    fontSize: "16px",
                    fontWeight: 700,
                    margin: 0,
                  }}
                >
                  Today's Log
                </h3>
              </div>
              {entries.map((entry, i) => (
                <div
                  key={i}
                  style={{
                    padding: "14px 24px",
                    borderBottom:
                      i < entries.length - 1
                        ? "1px solid rgba(255,255,255,0.04)"
                        : "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "11px",
                        background: "rgba(207,48,59,0.1)",
                        border: "1px solid rgba(207,48,59,0.2)",
                        borderRadius: "6px",
                        padding: "3px 8px",
                        color: "#e28389",
                        textTransform: "capitalize",
                      }}
                    >
                      {entry.meal_type}
                    </span>
                    <div>
                      <div style={{ fontSize: "14px", fontWeight: 500 }}>
                        {entry.food_name}
                      </div>
                      <div
                        style={{
                          fontSize: "12px",
                          color: "rgba(255,255,255,0.3)",
                        }}
                      >
                        {entry.calories} kcal · {entry.protein_g}g protein
                      </div>
                    </div>
                  </div>
                  <div
                    style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)" }}
                  >
                    {new Date(
                      entry.logged_at.endsWith("Z")
                        ? entry.logged_at
                        : entry.logged_at + "Z",
                    ).toLocaleTimeString("en-IN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {entries.length === 0 && (
            <div
              style={{
                background: "#141414",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "20px",
                padding: "40px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "40px", marginBottom: "12px" }}>🍽️</div>
              <div
                style={{
                  fontFamily: "var(--font-syne)",
                  fontSize: "18px",
                  fontWeight: 700,
                  marginBottom: "8px",
                }}
              >
                Nothing logged yet today
              </div>
              <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)" }}>
                Use the form above or Quick Add to start tracking
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
