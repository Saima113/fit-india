"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import {
  Dumbbell,
  Flame,
  Clock,
  RotateCcw,
  User,
  LogOut,
  Utensils,
  TrendingUp,
  Moon,
  Calculator,
} from "lucide-react";
import { useClerk } from "@clerk/nextjs";
import { logWorkoutCompleted } from "@/lib/logworkoutcompleted";
import { useRouter } from "next/navigation";
import Mascot from "@/components/mascot";

interface Exercise {
  exercise: string;
  sets?: number;
  reps?: string;
  rest?: string;
  duration?: string;
  notes?: string;
}

interface WorkoutPlan {
  day_focus: string;
  duration_minutes: number;
  difficulty: string;
  warmup: Exercise[];
  main_workout: Exercise[];
  cooldown: Exercise[];
  trainer_note: string;
}

const SIDEBAR_ITEMS = [
  { icon: Dumbbell, label: "Workout", href: "/dashboard" },
  { icon: Utensils, label: "Meals", href: "/meals" },
  { icon: Calculator, label: "Calories", href: "/calories" },
  { icon: Moon, label: "Fasting", href: "/fasting" },
  { icon: TrendingUp, label: "Progress", href: "/progress" },
  { icon: User, label: "Profile", href: "/profile" },
];

export default function DashboardPage() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const [workout, setWorkout] = useState<WorkoutPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [workoutLogged, setWorkoutLogged] = useState(false);

  const handleLogWorkout = async () => {
    if (!user || !workout) return;
    const result = await logWorkoutCompleted(
      user.id,
      workout.day_focus,
      workout.duration_minutes,
    );
    if (result) setWorkoutLogged(true);
  };

  const fetchWorkout = async () => {
    if (!user) return;
    setLoading(true);
    setError("");
    try {
      const profileRes = await fetch(
        `https://fit-india-f4a8.onrender.com/profile/${user.id}`,
      );
      const profileData = await profileRes.json();

      if (!profileData.exists) {
        // Retry once after 1.5s to handle race condition
        await new Promise((r) => setTimeout(r, 1500));
        const retryRes = await fetch(
          `https://fit-india-f4a8.onrender.com/profile/${user.id}`,
        );
        const retryData = await retryRes.json();
        if (!retryData.exists) {
          window.location.href = "/onboarding";
          return;
        }
        // Profile now exists, continue with retryData
        const workoutRes = await fetch(
          "https://fit-india-f4a8.onrender.com/generate-workout",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ clerk_user_id: user.id, ...retryData }),
          },
        );
        const workoutData = await workoutRes.json();
        setWorkout(workoutData.workout);
        setLoading(false);
        return;
      }

      const workoutRes = await fetch(
        "https://fit-india-f4a8.onrender.com/generate-workout",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            clerk_user_id: user.id,
            ...profileData,
          }),
        },
      );
      const workoutData = await workoutRes.json();
      setWorkout(workoutData.workout);
    } catch (err) {
      setError("Failed to load workout. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchWorkout();
  }, [user]);

  const firstName =
    user?.firstName ||
    user?.emailAddresses?.[0]?.emailAddress?.split("@")[0] ||
    "there";

  const currentPath =
    typeof window !== "undefined" ? window.location.pathname : "/dashboard";

  const getMascotMood = () => {
    if (workoutLogged) return "celebrating";
    if (loading) return "excited";
    return "happy";
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

        {SIDEBAR_ITEMS.map(({ icon: Icon, label, href }) => {
          const active = currentPath === href;
          return (
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
                background: active ? "rgba(207,48,59,0.12)" : "transparent",
                border: active
                  ? "1px solid rgba(207,48,59,0.2)"
                  : "1px solid transparent",
                color: active ? "#cf303b" : "rgba(255,255,255,0.5)",
                fontSize: "14px",
                fontWeight: active ? 600 : 400,
                cursor: "pointer",
                textAlign: "left",
                width: "100%",
                transition: "all 0.2s",
              }}
            >
              <Icon size={16} />
              {label}
            </button>
          );
        })}

        <div style={{ marginTop: "auto" }}>
          <div
            style={{
              fontSize: "13px",
              color: "rgba(255,255,255,0.3)",
              paddingLeft: "8px",
              marginBottom: "12px",
            }}
          >
            {firstName}
          </div>
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

      {/* Main content */}
      <div style={{ flex: 1, overflow: "auto" }}>
        <div
          style={{ maxWidth: "900px", margin: "0 auto", padding: "40px 24px" }}
        >
          {/* Header */}
          <div style={{ marginBottom: "32px" }}>
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
              Today's Plan
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
              Your Workout
            </h1>
            <p
              style={{
                color: "rgba(255,255,255,0.4)",
                fontSize: "15px",
                fontWeight: 300,
              }}
            >
              {new Date().toLocaleDateString("en-IN", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </p>
          </div>

          {/* Loading */}
          {loading && (
            <div
              style={{
                background: "#141414",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "20px",
                padding: "60px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  border: "3px solid rgba(207,48,59,0.2)",
                  borderTop: "3px solid #cf303b",
                  margin: "0 auto 20px",
                  animation: "spin 1s linear infinite",
                }}
              />
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "15px" }}>
                Generating your personalised workout...
              </p>
            </div>
          )}

          {/* Error */}
          {error && !loading && (
            <div
              style={{
                background: "rgba(207,48,59,0.1)",
                border: "1px solid rgba(207,48,59,0.3)",
                borderRadius: "16px",
                padding: "24px",
                marginBottom: "24px",
                color: "#e28389",
              }}
            >
              {error}
            </div>
          )}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: "16px",
            }}
          >
            <Mascot mood={getMascotMood()} size={72} />
          </div>

          {/* Workout plan */}
          {workout && !loading && (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "20px" }}
            >
              {/* Stats row */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: "16px",
                }}
              >
                {[
                  { icon: Dumbbell, label: "Focus", value: workout.day_focus },
                  {
                    icon: Clock,
                    label: "Duration",
                    value: `${workout.duration_minutes} min`,
                  },
                  {
                    icon: Flame,
                    label: "Difficulty",
                    value: workout.difficulty,
                  },
                ].map(({ icon: Icon, label, value }) => (
                  <div
                    key={label}
                    style={{
                      background: "#141414",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: "16px",
                      padding: "20px",
                      display: "flex",
                      alignItems: "center",
                      gap: "14px",
                    }}
                  >
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "10px",
                        background: "rgba(207,48,59,0.1)",
                        border: "1px solid rgba(207,48,59,0.2)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Icon size={18} color="#cf303b" strokeWidth={1.5} />
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: "11px",
                          color: "rgba(255,255,255,0.4)",
                          marginBottom: "4px",
                          textTransform: "uppercase",
                          letterSpacing: "0.08em",
                        }}
                      >
                        {label}
                      </div>
                      <div
                        style={{
                          fontSize: "15px",
                          fontWeight: 600,
                          fontFamily: "var(--font-syne)",
                        }}
                      >
                        {value}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Trainer note */}
              <div
                style={{
                  background:
                    "linear-gradient(135deg, #d85a62 0%, #cf303b 50%, #7c1d23 100%)",
                  borderRadius: "16px",
                  padding: "20px 24px",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "14px",
                }}
              >
                <User
                  size={20}
                  color="rgba(255,255,255,0.8)"
                  style={{ flexShrink: 0, marginTop: "2px" }}
                />
                <div>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "rgba(255,255,255,0.7)",
                      marginBottom: "6px",
                      fontWeight: 600,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                    }}
                  >
                    Trainer Note
                  </div>
                  <div
                    style={{
                      fontSize: "14px",
                      color: "white",
                      lineHeight: 1.6,
                      fontWeight: 300,
                    }}
                  >
                    {workout.trainer_note}
                  </div>
                </div>
              </div>

              <WorkoutSection
                title="Warmup"
                exercises={workout.warmup}
                type="warmup"
              />
              <WorkoutSection
                title="Main Workout"
                exercises={workout.main_workout}
                type="main"
              />
              <WorkoutSection
                title="Cooldown"
                exercises={workout.cooldown}
                type="cooldown"
              />

              {/* Log Workout Button */}
              <button
                onClick={handleLogWorkout}
                disabled={workoutLogged}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  background: workoutLogged
                    ? "rgba(207,48,59,0.15)"
                    : "linear-gradient(135deg, #d85a62 0%, #cf303b 50%, #7c1d23 100%)",
                  border: workoutLogged
                    ? "1px solid rgba(207,48,59,0.3)"
                    : "none",
                  borderRadius: "12px",
                  padding: "16px",
                  color: workoutLogged ? "#e28389" : "white",
                  fontSize: "15px",
                  fontWeight: 600,
                  cursor: workoutLogged ? "default" : "pointer",
                  fontFamily: "var(--font-syne)",
                  transition: "all 0.3s",
                }}
              >
                {workoutLogged
                  ? "✓ Workout Logged! Great work today 🔥"
                  : "Mark Workout as Done"}
              </button>

              {/* Regenerate */}
              <button
                onClick={fetchWorkout}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "12px",
                  padding: "14px",
                  color: "rgba(255,255,255,0.4)",
                  fontSize: "14px",
                  cursor: "pointer",
                }}
              >
                <RotateCcw size={14} /> Generate new plan
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function WorkoutSection({
  title,
  exercises,
  type,
}: {
  title: string;
  exercises: Exercise[];
  type: "warmup" | "main" | "cooldown";
}) {
  return (
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
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
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
          {title}
        </h3>
        <span
          style={{
            fontSize: "12px",
            color: "rgba(255,255,255,0.4)",
            background: "rgba(255,255,255,0.06)",
            padding: "4px 10px",
            borderRadius: "999px",
          }}
        >
          {exercises.length} exercises
        </span>
      </div>

      <div style={{ padding: "8px 0" }}>
        {exercises.map((ex, i) => (
          <div
            key={i}
            style={{
              padding: "16px 24px",
              borderBottom:
                i < exercises.length - 1
                  ? "1px solid rgba(255,255,255,0.04)"
                  : "none",
              display: "flex",
              alignItems: "flex-start",
              gap: "16px",
            }}
          >
            <div
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "8px",
                background:
                  type === "main"
                    ? "rgba(207,48,59,0.15)"
                    : "rgba(255,255,255,0.06)",
                border: `1px solid ${type === "main" ? "rgba(207,48,59,0.3)" : "rgba(255,255,255,0.08)"}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "12px",
                fontWeight: 700,
                color: type === "main" ? "#cf303b" : "rgba(255,255,255,0.4)",
                flexShrink: 0,
              }}
            >
              {i + 1}
            </div>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: 600,
                  marginBottom: "4px",
                }}
              >
                {ex.exercise}
              </div>
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                {ex.sets && (
                  <span style={{ fontSize: "12px", color: "#cf303b" }}>
                    {ex.sets} sets × {ex.reps}
                  </span>
                )}
                {ex.rest && (
                  <span
                    style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)" }}
                  >
                    Rest: {ex.rest}
                  </span>
                )}
                {ex.duration && (
                  <span style={{ fontSize: "12px", color: "#cf303b" }}>
                    {ex.duration}
                  </span>
                )}
              </div>
              {ex.notes && (
                <div
                  style={{
                    fontSize: "12px",
                    color: "rgba(255,255,255,0.3)",
                    marginTop: "4px",
                    fontStyle: "italic",
                  }}
                >
                  {ex.notes}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
