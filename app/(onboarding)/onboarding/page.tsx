"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const steps : { id: string; question: string; subtext?: string; type: string; options?: string[]; descriptions?: string[]; field?: string; }[]= [
  // {
  //   id: "name",
  //   question: "What should we call you?",
  //   subtext: "This is how FitIndia will address you",
  //   type: "text_input",
  //   field: "display_name",
  // },
  {
    id: "goal",
    question: "What is your main fitness goal?",
    type: "single",
    options: [
      "Lose weight",
      "Gain muscle",
      "Body recomposition",
      "Improve fitness",
    ],
  },
  {
    id: "stats",
    question: "Tell us about yourself",
    type: "stats",
  },
  {
    id: "activity_level",
    question: "How active are you currently?",
    type: "single",
    options: [
      "Sedentary",
      "Lightly active",
      "Moderately active",
      "Very active",
    ],
    descriptions: [
      "Desk job, little to no exercise",
      "Light exercise 1-3 days/week",
      "Moderate exercise 3-5 days/week",
      "Hard exercise 6-7 days/week",
    ],
  },
  {
    id: "diet_type",
    question: "What is your diet type?",
    type: "single",
    options: ["Vegetarian", "Non-vegetarian", "Eggetarian", "Vegan"],
  },
  {
    id: "medical_conditions",
    question: "Any medical conditions we should know about?",
    type: "multi",
    options: [
      "None",
      "PCOS/PCOD",
      "Diabetes",
      "Hypothyroidism",
      "High uric acid",
    ],
  },
  {
    id: "lifestyle_mode",
    question: "Which best describes your lifestyle?",
    type: "single",
    options: ["Normal", "Hostel/Mess", "Night shift", "Skinny fat"],
    descriptions: [
      "Regular home/office routine",
      "Living in hostel with mess food",
      "Work night shifts",
      "Low weight but high body fat",
    ],
  },
  {
    id: "fasting_types",
    question: "Do you follow any fasting?",
    type: "multi",
    options: [
      "None",
      "Ramzan",
      "Navratri",
      "Ekadashi",
      "Jain",
      "Intermittent Fasting",
    ],
  },
  {
    id: "workout_location",
    question: "Where do you prefer to work out?",
    type: "single",
    options: ["Gym", "Home", "Outdoor", "Mix of all"],
  },
];

export default function OnboardingPage() {
  const { user } = useUser();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [stats, setStats] = useState({ age: "", height: "", weight: "" });
  const [loading, setLoading] = useState(false);

  const current = steps[step];
  const progress = ((step + 1) / steps.length) * 100;

  const handleSingle = (option: string) => {
    setAnswers((prev) => ({ ...prev, [current.id]: option }));
    setTimeout(() => nextStep(), 300);
  };

  const handleMulti = (option: string) => {
    const current_answers = answers[current.id] || [];
    if (option === "None") {
      setAnswers((a) => ({ ...a, [current.id]: ["None"] }));
      return;
    }
    const filtered = current_answers.filter((o: string) => o !== "None");
    if (filtered.includes(option)) {
      setAnswers((a) => ({
        ...a,
        [current.id]: filtered.filter((o: string) => o !== option),
      }));
    } else {
      setAnswers((a) => ({ ...a, [current.id]: [...filtered, option] }));
    }
  };

  const nextStep = () => {
    if (step < steps.length - 1) setStep((s) => s + 1);
    else handleSubmit();
  };

  const handleSubmit = async () => {
    if (!user) return;
    setLoading(true);
    try {
      await fetch("process.env.NEXT_PUBLIC_API_URL/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clerk_user_id: user.id,
          display_name: answers.display_name || "",
          goal: answers.goal,
          age: parseInt(stats.age),
          height_cm: parseInt(stats.height),
          weight_kg: parseFloat(stats.weight),
          activity_level: answers.activity_level,
          diet_type: answers.diet_type,
          medical_conditions: answers.medical_conditions || [],
          lifestyle_mode: answers.lifestyle_mode,
          fasting_types: answers.fasting_types || [],
          workout_location: answers.workout_location,
        }),
      });
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0d0d0d",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        fontFamily: "var(--font-dm-sans)",
      }}
    >
      {/* Progress bar */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: "3px",
          background: "rgba(255,255,255,0.08)",
          zIndex: 100,
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${progress}%`,
            background: "linear-gradient(90deg, #d85a62, #cf303b)",
            transition: "width 0.4s ease",
          }}
        />
      </div>

      {/* Step counter */}
      <div
        style={{
          position: "fixed",
          top: "20px",
          right: "24px",
          fontSize: "13px",
          color: "rgba(255,255,255,0.3)",
          fontFamily: "var(--font-dm-sans)",
        }}
      >
        {step + 1} / {steps.length}
      </div>

      {/* Logo */}
      <div
        style={{
          position: "fixed",
          top: "16px",
          left: "24px",
          fontFamily: "var(--font-syne)",
          fontSize: "20px",
          fontWeight: 800,
          color: "white",
        }}
      >
        Fit<span style={{ color: "var(--accent)" }}>India</span>
      </div>

      {/* Card */}
      <div
        style={{
          width: "100%",
          maxWidth: "580px",
          background: "#141414",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "24px",
          padding: "48px",
          boxShadow: "0 40px 80px rgba(0,0,0,0.4)",
        }}
      >
        {/* Question */}
        <h2
          style={{
            fontFamily: "var(--font-syne)",
            fontSize: "26px",
            fontWeight: 800,
            color: "white",
            marginBottom: "32px",
            lineHeight: 1.2,
          }}
        >
          {current.question}
        </h2>

        {/* Single select */}
        {current.type === "single" && (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            {current.options!.map((option, i) => (
              <button
                key={option}
                onClick={() => handleSingle(option)}
                style={{
                  padding: "16px 20px",
                  background:
                    answers[current.id] === option
                      ? "linear-gradient(135deg, #d85a62, #cf303b)"
                      : "rgba(255,255,255,0.04)",
                  border: `1px solid ${answers[current.id] === option ? "transparent" : "rgba(255,255,255,0.08)"}`,
                  borderRadius: "12px",
                  color: "white",
                  fontSize: "15px",
                  fontWeight: 500,
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.2s ease",
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px",
                }}
                onMouseEnter={(e) => {
                  if (answers[current.id] !== option)
                    e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                }}
                onMouseLeave={(e) => {
                  if (answers[current.id] !== option)
                    e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                }}
              >
                <span>{option}</span>
                {current.descriptions?.[i] && (
                  <span
                    style={{
                      fontSize: "12px",
                      color: "rgba(255,255,255,0.4)",
                      fontWeight: 300,
                    }}
                  >
                    {current.descriptions[i]}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Multi select */}
        {current.type === "multi" && (
          <>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                marginBottom: "24px",
              }}
            >
              {current.options!.map((option) => {
                const selected = (answers[current.id] || []).includes(option);
                return (
                  <button
                    key={option}
                    onClick={() => handleMulti(option)}
                    style={{
                      padding: "16px 20px",
                      background: selected
                        ? "linear-gradient(135deg, #d85a62, #cf303b)"
                        : "rgba(255,255,255,0.04)",
                      border: `1px solid ${selected ? "transparent" : "rgba(255,255,255,0.08)"}`,
                      borderRadius: "12px",
                      color: "white",
                      fontSize: "15px",
                      fontWeight: 500,
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
            <button
              onClick={nextStep}
              style={{
                width: "100%",
                padding: "16px",
                background: "linear-gradient(135deg, #d85a62, #cf303b)",
                border: "none",
                borderRadius: "12px",
                color: "white",
                fontSize: "15px",
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "var(--font-syne)",
              }}
            >
              {step === steps.length - 1
                ? loading
                  ? "Saving..."
                  : "Complete Setup →"
                : "Continue →"}
            </button>
          </>
        )}

        {/* Stats step */}
        {current.type === "stats" && (
          <>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                marginBottom: "24px",
              }}
            >
              {[
                {
                  label: "Age",
                  key: "age",
                  placeholder: "e.g. 21",
                  suffix: "years",
                },
                {
                  label: "Height",
                  key: "height",
                  placeholder: "e.g. 170",
                  suffix: "cm",
                },
                {
                  label: "Weight",
                  key: "weight",
                  placeholder: "e.g. 65",
                  suffix: "kg",
                },
              ].map((field) => (
                <div key={field.key}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "13px",
                      color: "rgba(255,255,255,0.5)",
                      marginBottom: "8px",
                      fontWeight: 500,
                    }}
                  >
                    {field.label}
                  </label>
                  <div style={{ position: "relative" }}>
                    <input
                      type="number"
                      placeholder={field.placeholder}
                      value={stats[field.key as keyof typeof stats]}
                      onChange={(e) =>
                        setStats((s) => ({ ...s, [field.key]: e.target.value }))
                      }
                      style={{
                        width: "100%",
                        padding: "14px 48px 14px 16px",
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: "12px",
                        color: "white",
                        fontSize: "15px",
                        outline: "none",
                        boxSizing: "border-box",
                      }}
                    />
                    <span
                      style={{
                        position: "absolute",
                        right: "16px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        fontSize: "13px",
                        color: "rgba(255,255,255,0.3)",
                      }}
                    >
                      {field.suffix}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={nextStep}
              disabled={!stats.age || !stats.height || !stats.weight}
              style={{
                width: "100%",
                padding: "16px",
                background: "linear-gradient(135deg, #d85a62, #cf303b)",
                border: "none",
                borderRadius: "12px",
                color: "white",
                fontSize: "15px",
                fontWeight: 600,
                cursor:
                  !stats.age || !stats.height || !stats.weight
                    ? "not-allowed"
                    : "pointer",
                opacity: !stats.age || !stats.height || !stats.weight ? 0.5 : 1,
                fontFamily: "var(--font-syne)",
              }}
            >
              {/* Text input step (display name) */}
              {/* @ts-ignore */}
              {current.type === "text_input" && (
                <>
                  <input
                    type="text"
                    value={answers[current.id] || ""}
                    onChange={(e) =>
                      setAnswers((a) => ({
                        ...a,
                        [current.id]: e.target.value,
                      }))
                    }
                    placeholder="e.g. Saima, Rohan, Priya..."
                    autoFocus
                    style={{
                      width: "100%",
                      padding: "16px 20px",
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      borderRadius: "12px",
                      color: "white",
                      fontSize: "18px",
                      outline: "none",
                      boxSizing: "border-box" as const,
                      marginBottom: "16px",
                      fontFamily: "var(--font-dm-sans)",
                    }}
                    onFocus={(e) =>
                      (e.currentTarget.style.borderColor = "#cf303b")
                    }
                    onBlur={(e) =>
                      (e.currentTarget.style.borderColor =
                        "rgba(255,255,255,0.12)")
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && answers[current.id]?.trim())
                        nextStep();
                    }}
                  />
                  <button
                    onClick={nextStep}
                    disabled={!answers[current.id]?.trim()}
                    style={{
                      width: "100%",
                      padding: "16px",
                      background: answers[current.id]?.trim()
                        ? "linear-gradient(135deg, #d85a62, #cf303b)"
                        : "rgba(255,255,255,0.06)",
                      border: "none",
                      borderRadius: "12px",
                      color: "white",
                      fontSize: "15px",
                      fontWeight: 600,
                      fontFamily: "var(--font-syne)",
                      cursor: answers[current.id]?.trim()
                        ? "pointer"
                        : "not-allowed",
                      opacity: answers[current.id]?.trim() ? 1 : 0.5,
                    }}
                  >
                    Continue →
                  </button>
                </>
              )}
              Continue →
            </button>
          </>
        )}

        {/* Back button */}
        {step > 0 && (
          <button
            onClick={() => setStep((s) => s - 1)}
            style={{
              background: "none",
              border: "none",
              color: "rgba(255,255,255,0.3)",
              fontSize: "13px",
              cursor: "pointer",
              marginTop: "16px",
              padding: 0,
            }}
          >
            ← Back
          </button>
        )}
      </div>
    </div>
  );
}
