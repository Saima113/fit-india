"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isDark, setIsDark] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
    setIsDark(!isDark);
  };

  return (
    <nav style={{
      position: "fixed",
      top: 0, left: 0, right: 0,
      zIndex: 100,
      height: "68px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 48px",
      background: scrolled ? "var(--nav-bg)" : "transparent",
      backdropFilter: scrolled ? "blur(20px)" : "none",
      borderBottom: scrolled ? "1px solid var(--border2)" : "none",
      transition: "all 0.3s ease",
    }}>

      {/* Logo — text only */}
      <Link href="/" style={{
        textDecoration: "none",
        fontFamily: "var(--font-syne)",
        fontSize: "22px",
        fontWeight: 800,
        color: "var(--text)",
        letterSpacing: "-0.02em",
      }}>
        Fit<span style={{ color: "var(--accent)" }}>India</span>
      </Link>

      {/* Nav Links */}
      <ul style={{
        display: "flex",
        gap: "36px",
        listStyle: "none",
        margin: 0,
        padding: 0,
      }}>
        {[
          { label: "Features", href: "#features" },
          { label: "For India", href: "#india" },
          { label: "Fasting", href: "#fasting" },
          { label: "Stories", href: "#stories" },
        ].map((item) => (
          <li key={item.label}>
            <a href={item.href} style={{
              fontSize: "14px",
              fontWeight: 500,
              color: "var(--text2)",
              textDecoration: "none",
              transition: "color 0.2s",
            }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--text)")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--text2)")}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>

      {/* Right */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          style={{
            width: "48px", height: "26px",
            background: "var(--surface2)",
            border: "1px solid var(--border)",
            borderRadius: "999px",
            cursor: "pointer",
            position: "relative",
            transition: "all 0.3s ease",
          }}
        >
          <span style={{
            position: "absolute",
            width: "18px", height: "18px",
            borderRadius: "50%",
            background: "var(--accent)",
            top: "3px",
            left: isDark ? "27px" : "3px",
            transition: "left 0.3s ease",
            boxShadow: "0 0 8px var(--accent-glow)",
          }} />
        </button>

        {/* Get Started */}
        <Link href="/login" style={{
          padding: "9px 22px",
          background: "var(--gradient)",
          color: "white",
          fontSize: "14px",
          fontWeight: 500,
          borderRadius: "8px",
          textDecoration: "none",
          boxShadow: "0 4px 15px var(--accent-glow)",
          transition: "all 0.2s ease",
          whiteSpace: "nowrap",
        }}
          onMouseEnter={e => {
            e.currentTarget.style.opacity = "0.88";
            e.currentTarget.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.opacity = "1";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          Get Started
        </Link>
      </div>
    </nav>
  );
}