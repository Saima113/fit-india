"use client";
import Navbar from "@/components/layout/Navbar";
import FeaturesSection from "@/components/layout/FeaturesSection";
import IndiaSection from "@/components/layout/IndiaSection";
import FastingSection from "@/components/layout/FastingSection";
import TestimonialsSection from "@/components/layout/TestimonialsSection";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        overflow: "hidden",
      }}
    >
      {/* Background blobs */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
        }}
      >
        {/* Top left blob */}
        <svg
          style={{
            position: "absolute",
            top: "-200px",
            left: "-200px",
            opacity: 0.15,
          }}
          width="700"
          height="700"
          viewBox="0 0 700 700"
        >
          <defs>
            <radialGradient id="blob1" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.15" />
              <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
            </radialGradient>
          </defs>
          <ellipse cx="350" cy="350" rx="350" ry="300" fill="url(#blob1)" />
        </svg>

        {/* Right blob */}
        <svg
          style={{
            position: "absolute",
            top: "30%",
            right: "-150px",
            opacity: 0.1,
          }}
          width="500"
          height="500"
          viewBox="0 0 500 500"
        >
          <defs>
            <radialGradient id="blob2" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="var(--accent2)" stopOpacity="0.12" />
              <stop offset="100%" stopColor="var(--accent2)" stopOpacity="0" />
            </radialGradient>
          </defs>
          <ellipse cx="250" cy="250" rx="250" ry="220" fill="url(#blob2)" />
        </svg>

        {/* Bottom blob */}
        <svg
          style={{
            position: "absolute",
            bottom: "0",
            left: "25%",
            opacity: 0.08,
          }}
          width="400"
          height="400"
          viewBox="0 0 400 400"
        >
          <defs>
            <radialGradient id="blob3" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="var(--accent3)" stopOpacity="0.1" />
              <stop offset="100%" stopColor="var(--accent3)" stopOpacity="0" />
            </radialGradient>
          </defs>
          <ellipse cx="200" cy="200" rx="200" ry="180" fill="url(#blob3)" />
        </svg>

        {/* Subtle grid */}
        {/* <svg
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.03 }}
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="var(--text)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg> */}
        
      </div>

      <Navbar />

      {/* Hero */}
      <section
        style={{
          position: "relative",
          zIndex: 1,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "120px 24px 80px",
        }}
      >
        {/* Pill */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: "var(--pill-bg)",
            border: "1px solid var(--border)",
            color: "var(--pill-text)",
            padding: "6px 16px",
            borderRadius: "999px",
            fontSize: "13px",
            fontWeight: 500,
            marginBottom: "32px",
          }}
        >
          <span
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: "var(--accent)",
              display: "inline-block",
            }}
          />
          Built for India. Not translated for India.
        </div>

        {/* Headline */}
        <h1
          style={{
            fontFamily: "var(--font-syne)",
            fontSize: "clamp(48px, 7vw, 88px)",
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            marginBottom: "24px",
            color: "var(--text)",
          }}
        >
          Your fitness,
          <br />
          <span
            style={{
              background: "var(--gradient)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            finally personalised.
          </span>
        </h1>

        {/* Subheading */}
        <p
          style={{
            fontSize: "clamp(16px, 2vw, 20px)",
            color: "var(--text2)",
            fontWeight: 300,
            maxWidth: "560px",
            lineHeight: 1.7,
            marginBottom: "48px",
            fontFamily: "var(--font-dm-sans)",
          }}
        >
          AI-powered plans that understand your body type, your diet, your
          fasting schedule, and your real Indian lifestyle — not generic Western
          advice.
        </p>

        {/* CTAs */}
        <div
          style={{
            display: "flex",
            gap: "16px",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <a
            href="/login"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "16px 32px",
              background: "var(--gradient)",
              color: "white",
              fontSize: "16px",
              fontWeight: 500,
              borderRadius: "12px",
              textDecoration: "none",
              boxShadow: "0 8px 30px var(--accent-glow)",
              transition: "all 0.25s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow =
                "0 12px 40px var(--accent-glow)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 8px 30px var(--accent-glow)";
            }}
          >
            Start Free →
          </a>

          <a
            href="/login"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              padding: "16px 28px",
              background: "var(--surface)",
              color: "var(--text)",
              fontSize: "15px",
              fontWeight: 500,
              borderRadius: "12px",
              textDecoration: "none",
              border: "1px solid var(--border2)",
              transition: "all 0.25s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--border)";
              e.currentTarget.style.background = "var(--accent-soft)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--border2)";
              e.currentTarget.style.background = "var(--surface)";
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </a>
        </div>

        {/* Stats */}
        <div
          style={{
            display: "flex",
            gap: "48px",
            marginTop: "72px",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {[
            { num: "10+", label: "Lifestyle Modes" },
            { num: "6", label: "Fasting Types" },
            { num: "100%", label: "Indian Food DB" },
            { num: "AI", label: "Personalised" },
          ].map((stat) => (
            <div key={stat.label} style={{ textAlign: "center" }}>
              <span
                style={{
                  display: "block",
                  fontFamily: "var(--font-syne)",
                  fontSize: "32px",
                  fontWeight: 800,
                  color: "var(--accent3)",
                }}
              >
                {stat.num}
              </span>
              <span
                style={{
                  fontSize: "13px",
                  color: "var(--text3)",
                  marginTop: "4px",
                  display: "block",
                }}
              >
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </section>
      <div
        style={{
          width: "100%",
          height: "1px",
          background: "var(--border2)",
        }}
      />
      <FeaturesSection />
      <IndiaSection />
      <FastingSection />
      <TestimonialsSection />
      <Footer />
    </main>
  );
}
