"use client";

import { SignIn, SignUp } from "@clerk/nextjs";
import { useState } from "react";

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const isLogin = mode === "login";

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#0d0d0d",
      fontFamily: "var(--font-dm-sans)",
      padding: "24px",
    }}>
      <div style={{
        width: "100%",
        maxWidth: "900px",
        minHeight: "560px",
        borderRadius: "24px",
        overflow: "hidden",
        display: "flex",
        boxShadow: "0 40px 80px rgba(0,0,0,0.5)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}>

        {/* Left panel — crimson branding */}
        <div style={{
          width: "42%",
          background: "linear-gradient(135deg, #d85a62 0%, #cf303b 50%, #7c1d23 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "48px",
          position: "relative",
          overflow: "hidden",
          order: isLogin ? 1 : 2,
          flexShrink: 0,
        }}>
          <div style={{
            position: "absolute", top: "-80px", right: "-80px",
            width: "280px", height: "280px", borderRadius: "50%",
            background: "rgba(255,255,255,0.06)",
          }} />
          <div style={{
            position: "absolute", bottom: "-60px", left: "-60px",
            width: "200px", height: "200px", borderRadius: "50%",
            background: "rgba(255,255,255,0.04)",
          }} />

          <div style={{
            fontFamily: "var(--font-syne)", fontSize: "28px", fontWeight: 800,
            color: "white", marginBottom: "24px", letterSpacing: "-0.02em", position: "relative",
          }}>
            Fit<span style={{ opacity: 0.7 }}>India</span>
          </div>

          <h2 style={{
            fontFamily: "var(--font-syne)", fontSize: "24px", fontWeight: 800,
            color: "white", textAlign: "center", lineHeight: 1.3,
            marginBottom: "16px", position: "relative",
          }}>
            {isLogin ? "Welcome back." : "Start your journey."}
          </h2>

          <p style={{
            fontSize: "14px", color: "rgba(255,255,255,0.7)", textAlign: "center",
            lineHeight: 1.6, fontWeight: 300, position: "relative", maxWidth: "240px",
          }}>
            {isLogin
              ? "Your personalised fitness plan is waiting for you."
              : "AI-powered fitness built for your real Indian lifestyle."}
          </p>

          <div style={{
            position: "absolute", bottom: "32px", fontSize: "13px",
            color: "rgba(255,255,255,0.6)", textAlign: "center",
          }}>
            {isLogin ? "No account yet?" : "Already have an account?"}
            <button
              onClick={() => setMode(isLogin ? "signup" : "login")}
              style={{
                background: "none", border: "none", color: "white", fontWeight: 600,
                cursor: "pointer", marginLeft: "6px", fontSize: "13px", textDecoration: "underline",
              }}
            >
              {isLogin ? "Sign up" : "Log in"}
            </button>
          </div>
        </div>

        {/* Right panel — Clerk form */}
        <div style={{
          flex: 1,
          background: "#141414",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "48px",
          order: isLogin ? 2 : 1,
        }}>
          {isLogin ? (
            <SignIn
              // routing="hash"
              forceRedirectUrl="/dashboard"
              appearance={{
                variables: {
                  colorPrimary: "#cf303b",
                  colorBackground: "#141414",
                  colorText: "#ffffff",
                  colorInputBackground: "rgba(255,255,255,0.05)",
                  colorInputText: "#ffffff",
                  borderRadius: "10px",
                },
                elements: {
                  rootBox: { width: "100%" },
                  card: { background: "transparent", boxShadow: "none", border: "none", padding: 0 },
                  headerTitle: { color: "white", fontFamily: "var(--font-syne)", fontSize: "26px", fontWeight: 800 },
                  headerSubtitle: { color: "rgba(255,255,255,0.4)" },
                  socialButtonsBlockButton: { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "white" },
                  dividerLine: { background: "rgba(255,255,255,0.08)" },
                  dividerText: { color: "rgba(255,255,255,0.3)" },
                  formFieldInput: { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "white" },
                  formFieldLabel: { color: "rgba(255,255,255,0.6)" },
                  footerActionLink: { color: "#cf303b" },
                  footer: { display: "none" },
                }
              }}
            />
          ) : (
            <SignUp
              // routing="hash"
              forceRedirectUrl="/onboarding"
              appearance={{
                variables: {
                  colorPrimary: "#cf303b",
                  colorBackground: "#141414",
                  colorText: "#ffffff",
                  colorInputBackground: "rgba(255,255,255,0.05)",
                  colorInputText: "#ffffff",
                  borderRadius: "10px",
                },
                elements: {
                  rootBox: { width: "100%" },
                  card: { background: "transparent", boxShadow: "none", border: "none", padding: 0 },
                  headerTitle: { color: "white", fontFamily: "var(--font-syne)", fontSize: "26px", fontWeight: 800 },
                  headerSubtitle: { color: "rgba(255,255,255,0.4)" },
                  socialButtonsBlockButton: { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "white" },
                  dividerLine: { background: "rgba(255,255,255,0.08)" },
                  dividerText: { color: "rgba(255,255,255,0.3)" },
                  formFieldInput: { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "white" },
                  formFieldLabel: { color: "rgba(255,255,255,0.6)" },
                  footerActionLink: { color: "#cf303b" },
                  footer: { display: "none" },
                }
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}