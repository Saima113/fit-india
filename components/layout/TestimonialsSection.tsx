const testimonials = [
  {
    stars: 5,
    text: "First time I actually lost weight during Ramzan. The Sehri and Iftar guidance was exactly what I needed. No other app even tries to address this.",
    name: "Aisha Khan",
    meta: "Lost 4kg in Ramzan · Delhi",
    initial: "A",
  },
  {
    stars: 5,
    text: "The PCOS mode is genuinely thoughtful. It understands how PCOS works and why standard advice doesn't apply to us. Finally an app that gets it.",
    name: "Priya Sharma",
    meta: "Managing PCOS · Mumbai",
    initial: "P",
  },
  {
    stars: 5,
    text: "Hostel mess mode is a lifesaver. I always thought healthy eating was impossible in hostel. This app proved me wrong with actual practical advice.",
    name: "Rahul Verma",
    meta: "College student · Pune",
    initial: "R",
  },
];

export default function TestimonialsSection() {
  return (
    <section
      id="stories"
      style={{
        position: "relative",
        zIndex: 1,
        padding: "100px 48px",
        background: "var(--bg2)",
        borderTop: "1px solid var(--border2)",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>

        {/* Label */}
        <span style={{
          display: "inline-block",
          fontSize: "12px",
          fontWeight: 600,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "var(--accent)",
          marginBottom: "16px",
        }}>
          Stories
        </span>

        {/* Title */}
        <h2 style={{
          fontFamily: "var(--font-syne)",
          fontSize: "clamp(32px, 4vw, 52px)",
          fontWeight: 800,
          lineHeight: 1.1,
          letterSpacing: "-0.02em",
          marginBottom: "64px",
          color: "var(--text)",
        }}>
          Real people.<br />Real results.
        </h2>

        {/* Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "20px",
        }}>
          {testimonials.map((t) => (
            <div
              key={t.name}
              style={{
                background: "var(--card)",
                border: "1px solid var(--border2)",
                borderRadius: "20px",
                padding: "28px",
                transition: "all 0.3s ease",
                cursor: "default",
                backdropFilter: "blur(12px)",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.08)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = "var(--border2)";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {/* Stars */}
              <div style={{
                display: "flex",
                gap: "3px",
                marginBottom: "16px",
              }}>
                {Array.from({ length: t.stars }).map((_, i) => (
                  <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="#cf303b">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>

              {/* Text */}
              <p style={{
                fontSize: "15px",
                color: "var(--text2)",
                lineHeight: 1.7,
                fontWeight: 300,
                fontStyle: "italic",
                marginBottom: "20px",
                fontFamily: "var(--font-dm-sans)",
              }}>
                "{t.text}"
              </p>

              {/* Author */}
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  background: "var(--gradient)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "14px",
                  fontWeight: 700,
                  color: "white",
                  fontFamily: "var(--font-syne)",
                  flexShrink: 0,
                }}>
                  {t.initial}
                </div>
                <div>
                  <div style={{
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "var(--text)",
                    fontFamily: "var(--font-syne)",
                  }}>
                    {t.name}
                  </div>
                  <div style={{
                    fontSize: "12px",
                    color: "var(--text3)",
                    marginTop: "2px",
                    fontFamily: "var(--font-dm-sans)",
                  }}>
                    {t.meta}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}