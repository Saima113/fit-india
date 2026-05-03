export default function Footer() {
  return (
    <>
      {/* CTA Section */}
      <section
        style={{
          position: "relative",
          zIndex: 1,
          padding: "100px 48px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            maxWidth: "580px",
            margin: "0 auto",
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: "28px",
            padding: "64px 48px",
            position: "relative",
            overflow: "hidden",
            backdropFilter: "blur(12px)",
          }}
        >
          {/* Glow */}
          {/* Glow */}
          <div
            style={{
              position: "absolute",
              top: "-60px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "200px",
              height: "200px",
              borderRadius: "50%",
              background: "var(--accent-glow)",
              filter: "blur(80px)",
              pointerEvents: "none",
              opacity: 0.4,
            }}
          />

          <h2
            style={{
              fontFamily: "var(--font-syne)",
              fontSize: "40px",
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              marginBottom: "16px",
              color: "var(--text)",
              position: "relative",
            }}
          >
            Start your
            <br />
            real journey.
          </h2>

          <p
            style={{
              fontSize: "16px",
              color: "var(--text2)",
              marginBottom: "36px",
              fontWeight: 300,
              lineHeight: 1.7,
              fontFamily: "var(--font-dm-sans)",
              position: "relative",
            }}
          >
            Personalised for your body, your lifestyle, your India. Free to get
            started.
          </p>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              alignItems: "center",
              position: "relative",
            }}
          >
            <a
              href="/login"
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
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
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              Get Started Free →
            </a>

            <div
              style={{
                fontSize: "13px",
                color: "var(--text3)",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                width: "100%",
              }}
            >
              <div
                style={{ flex: 1, height: "1px", background: "var(--border2)" }}
              />
              or
              <div
                style={{ flex: 1, height: "1px", background: "var(--border2)" }}
              />
            </div>

            <a
              href="/login"
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                padding: "14px 28px",
                background: "var(--surface)",
                color: "var(--text)",
                fontSize: "15px",
                fontWeight: 500,
                borderRadius: "12px",
                textDecoration: "none",
                border: "1px solid var(--border2)",
                transition: "all 0.25s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.borderColor = "var(--border)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.borderColor = "var(--border2)")
              }
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
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          position: "relative",
          zIndex: 1,
          borderTop: "1px solid var(--border2)",
          padding: "32px 48px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div
          style={{
            fontSize: "13px",
            color: "var(--text3)",
            fontFamily: "var(--font-dm-sans)",
          }}
        >
          © 2026{" "}
          <span style={{ color: "var(--text2)", fontWeight: 600 }}>
            FitIndia
          </span>
          .
        </div>

        <div
          style={{
            fontSize: "12px",
            color: "var(--text3)",
            maxWidth: "400px",
            textAlign: "center",
            lineHeight: 1.5,
            fontFamily: "var(--font-dm-sans)",
          }}
        >
          This app provides general fitness and nutrition guidance only. Consult
          a qualified healthcare professional before making significant dietary
          or lifestyle changes.
        </div>

        <div style={{ display: "flex", gap: "20px" }}>
          {["Privacy", "Terms", "Contact"].map((link) => (
            <a
              key={link}
              href="#"
              style={{
                fontSize: "13px",
                color: "var(--text3)",
                textDecoration: "none",
                fontFamily: "var(--font-dm-sans)",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "var(--accent)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "var(--text3)")
              }
            >
              {link}
            </a>
          ))}
        </div>
      </footer>
    </>
  );
}
