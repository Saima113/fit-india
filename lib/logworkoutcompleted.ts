// logWorkoutCompleted.ts
// Usage: import { logWorkoutCompleted } from "@/lib/logWorkoutCompleted";
// await logWorkoutCompleted(userId, workout.day_focus, workout.duration_minutes);

export async function logWorkoutCompleted(
  clerkUserId: string,
  dayFocus?: string,
  durationMinutes?: number
) {
  try {
    const res = await fetch("http://localhost:8000/progress/log-workout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clerk_user_id: clerkUserId,
        day_focus: dayFocus,
        duration_minutes: durationMinutes,
        completed: true,
      }),
    });
    if (!res.ok) throw new Error("Server error");
    return await res.json();
  } catch (err) {
    console.error("Failed to log workout:", err);
    return null;
  }
}