"use client";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useClerk } from "@clerk/nextjs";
import {
  TrendingUp, Dumbbell, Utensils, LogOut,
  Flame, Clock, Calendar, Moon, Calculator, User
} from "lucide-react";

interface WorkoutLog {
  date: string;
  day_focus: string;
  duration_minutes: number;
  completed: boolean;
}

interface ProgressData {
  total_workouts: number;
  current_streak: number;
  workout_logs: WorkoutLog[];
  weight_logs: { date: string; weight_kg: number }[];
}

const SIDEBAR_ITEMS = [
  { icon: Dumbbell,    label: "Workout",  href: "/dashboard" },
  { icon: Utensils,   label: "Meals",    href: "/meals" },
  { icon: Calculator, label: "Calories", href: "/calories" },
  { icon: Moon,       label: "Fasting",  href: "/fasting" },
  { icon: TrendingUp, label: "Progress", href: "/progress" },
  { icon: User, label: "Profile", href: "/profile" },
];

export default function ProgressPage() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState(true);

  const firstName =
    user?.firstName ||
    user?.emailAddresses?.[0]?.emailAddress?.split("@")[0] ||
    "there";

  useEffect(() => {
    if (!user) return;
    fetch(`$\{process.env.NEXT_PUBLIC_API_URL\}/progress/${user.id}`)
      .then((r) => r.json())
      .then((data) => {
        setProgress(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user]);

  const getLast7Days = () => {
    const days = [];
    // Use workout_logs which has a "date" field (YYYY-MM-DD)
    const loggedDates = new Set(
      (progress?.workout_logs ?? [])
        .filter((l) => l.completed)
        .map((l) => l.date)
    );
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      days.push({ date: d, logged: loggedDates.has(dateStr) });
    }
    return days;
  };

  const currentPath = typeof window !== "undefined" ? window.location.pathname : "/progress";

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
        <div style={{ maxWidth: "900px", margin: "0 auto", padding: "40px 24px" }}>
          <p style={{
            fontSize: "13px", color: "#cf303b", fontWeight: 600,
            letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "8px",
          }}>
            Your Journey
          </p>
          <h1 style={{
            fontFamily: "var(--font-syne)", fontSize: "36px", fontWeight: 800,
            lineHeight: 1.1, marginBottom: "32px",
          }}>
            Progress
          </h1>

          {loading ? (
            <div style={{
              background: "#141414", border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "20px", padding: "60px", textAlign: "center",
            }}>
              <div style={{
                width: "48px", height: "48px", borderRadius: "50%",
                border: "3px solid rgba(207,48,59,0.2)", borderTop: "3px solid #cf303b",
                margin: "0 auto 20px", animation: "spin 1s linear infinite",
              }} />
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              <p style={{ color: "rgba(255,255,255,0.4)" }}>Loading your stats...</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

              {/* Stats */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
                {[
                  { icon: Dumbbell, label: "Total Workouts", value: progress?.total_workouts ?? 0 },
                  { icon: Flame,    label: "Current Streak", value: `${progress?.current_streak ?? 0} days` },
                  { icon: Clock,    label: "This Week",      value: getLast7Days().filter((d) => d.logged).length },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} style={{
                    background: "#141414", border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "16px", padding: "24px",
                    display: "flex", alignItems: "center", gap: "14px",
                  }}>
                    <div style={{
                      width: "44px", height: "44px", borderRadius: "12px",
                      background: "rgba(207,48,59,0.1)", border: "1px solid rgba(207,48,59,0.2)",
                      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                    }}>
                      <Icon size={20} color="#cf303b" />
                    </div>
                    <div>
                      <div style={{
                        fontSize: "11px", color: "rgba(255,255,255,0.4)", marginBottom: "4px",
                        textTransform: "uppercase", letterSpacing: "0.08em",
                      }}>
                        {label}
                      </div>
                      <div style={{
                        fontSize: "22px", fontWeight: 800,
                        fontFamily: "var(--font-syne)", color: "white",
                      }}>
                        {value}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* 7-day streak calendar */}
              <div style={{
                background: "#141414", border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "20px", padding: "24px",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
                  <Calendar size={16} color="#cf303b" />
                  <h3 style={{ fontFamily: "var(--font-syne)", fontSize: "16px", fontWeight: 700, margin: 0 }}>
                    Last 7 Days
                  </h3>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "8px" }}>
                  {getLast7Days().map(({ date, logged }, i) => (
                    <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                      <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)" }}>
                        {date.toLocaleDateString("en-IN", { weekday: "short" })}
                      </div>
                      <div style={{
                        width: "40px", height: "40px", borderRadius: "10px",
                        background: logged
                          ? "linear-gradient(135deg, #d85a62, #cf303b)"
                          : "rgba(255,255,255,0.06)",
                        border: logged ? "none" : "1px solid rgba(255,255,255,0.08)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "16px",
                      }}>
                        {logged ? "🔥" : ""}
                      </div>
                      <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)" }}>
                        {date.getDate()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Empty state */}
              {(!progress?.workout_logs || progress.workout_logs.length === 0) && (
                <div style={{
                  background: "#141414", border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "20px", padding: "60px", textAlign: "center",
                }}>
                  <div style={{ fontSize: "48px", marginBottom: "16px" }}>💪</div>
                  <div style={{
                    fontFamily: "var(--font-syne)", fontSize: "20px",
                    fontWeight: 700, marginBottom: "8px",
                  }}>
                    No workouts logged yet
                  </div>
                  <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)" }}>
                    Complete your first workout and mark it done to start tracking!
                  </div>
                  <button
                    onClick={() => router.push("/dashboard")}
                    style={{
                      marginTop: "20px",
                      background: "linear-gradient(135deg, #d85a62, #cf303b)",
                      border: "none", borderRadius: "10px", padding: "12px 24px",
                      color: "white", fontSize: "14px", fontWeight: 600,
                      cursor: "pointer", fontFamily: "var(--font-syne)",
                    }}
                  >
                    Go to Workout →
                  </button>
                </div>
              )}

              {/* Recent workout logs */}
              {progress && progress.workout_logs.length > 0 && (
                <div style={{
                  background: "#141414", border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "20px", overflow: "hidden",
                }}>
                  <div style={{ padding: "16px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    <h3 style={{ fontFamily: "var(--font-syne)", fontSize: "16px", fontWeight: 700, margin: 0 }}>
                      Recent Workouts
                    </h3>
                  </div>
                  {progress.workout_logs.slice(0, 10).map((log, i) => (
                    <div key={i} style={{
                      padding: "16px 24px",
                      borderBottom: i < Math.min(progress.workout_logs.length, 10) - 1
                        ? "1px solid rgba(255,255,255,0.04)" : "none",
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div style={{
                          width: "36px", height: "36px", borderRadius: "10px",
                          background: "rgba(207,48,59,0.1)", border: "1px solid rgba(207,48,59,0.2)",
                          display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px",
                        }}>
                          🔥
                        </div>
                        <div>
                          <div style={{ fontSize: "14px", fontWeight: 600 }}>
                            {log.day_focus || "Workout"}
                          </div>
                          <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>
                            {log.duration_minutes} minutes
                          </div>
                        </div>
                      </div>
                      <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)" }}>
                        {log.date
                          ? new Date(log.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })
                          : ""}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Motivational banner */}
              {progress && (progress.total_workouts ?? 0) > 0 && (
                <div style={{
                  background: "linear-gradient(135deg, #d85a62 0%, #cf303b 50%, #7c1d23 100%)",
                  borderRadius: "16px", padding: "24px", textAlign: "center",
                }}>
                  <div style={{ fontSize: "32px", marginBottom: "8px" }}>
                    {(progress.total_workouts ?? 0) >= 10 ? "🏆"
                      : (progress.total_workouts ?? 0) >= 5 ? "⭐" : "🌱"}
                  </div>
                  <div style={{
                    fontFamily: "var(--font-syne)", fontSize: "18px",
                    fontWeight: 800, marginBottom: "8px",
                  }}>
                    {(progress.total_workouts ?? 0) >= 10 ? "You're crushing it!"
                      : (progress.total_workouts ?? 0) >= 5 ? "Great momentum!" : "Strong start!"}
                  </div>
                  <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.8)", fontWeight: 300 }}>
                    {progress.total_workouts} workout{progress.total_workouts !== 1 ? "s" : ""} completed
                    {" · "}
                    {progress.current_streak} day streak
                    {" · "}
                    Keep going 💪
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}