"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase/firestore";
import { FaHamburger, FaCoffee, FaPizzaSlice, FaLeaf } from "react-icons/fa";

export default function Home() {
  const [dbStatus, setDbStatus] = useState("Connecting...");

  useEffect(() => {
    async function testFirestore() {
      try {
        const snapshot = await getDocs(collection(db, "test"));
        setDbStatus(`Connected (${snapshot.docs.length} docs)`);
      } catch (error) {
        setDbStatus("Error connecting");
      }
    }
    testFirestore();
  }, []);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", padding: "2rem" }}>
      {/* Navbar */}
      <nav className="glass-panel animate-fade-in" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1.2rem 2rem", marginBottom: "4rem" }}>
        <h2 className="gradient-text" style={{ fontSize: "1.5rem", fontWeight: "700" }}>SmartCampus</h2>
        <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
          <span style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>Status: {dbStatus}</span>
          <button style={{ 
            background: "linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))",
            border: "none", padding: "0.6rem 1.5rem", borderRadius: "100px",
            color: "var(--bg-primary)", fontWeight: "600", cursor: "pointer", transition: "var(--transition-smooth)"
          }} 
          onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.05)"}
          onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}>
            Sign In
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", gap: "2rem", marginTop: "-4rem" }}>
        <h1 className="animate-fade-in" style={{ fontSize: "4rem", fontWeight: "700", lineHeight: "1.1", maxWidth: "800px" }}>
          The Future of <span className="gradient-text">Campus Dining</span> is Here.
        </h1>
        <p className="animate-fade-in" style={{ color: "var(--text-secondary)", fontSize: "1.2rem", maxWidth: "600px", animationDelay: "0.2s" }}>
          Skip the lines. Order ahead. Discover exclusive deals across all campus cafeterias in one seamless experience.
        </p>
        
        <div className="animate-fade-in" style={{ display: "flex", gap: "1rem", marginTop: "1rem", animationDelay: "0.4s" }}>
          <button className="glass-panel" style={{ 
            padding: "1rem 2.5rem", fontSize: "1.1rem", fontWeight: "600", color: "var(--text-primary)",
            cursor: "pointer", transition: "var(--transition-smooth)"
          }}
          onMouseOver={(e) => { e.currentTarget.style.background = "var(--accent-primary)"; e.currentTarget.style.color = "var(--bg-primary)"; }}
          onMouseOut={(e) => { e.currentTarget.style.background = "var(--glass-bg)"; e.currentTarget.style.color = "var(--text-primary)"; }}>
            Order Now
          </button>
          <button style={{ 
            padding: "1rem 2.5rem", fontSize: "1.1rem", fontWeight: "600", color: "var(--text-secondary)",
            background: "transparent", border: "1px solid var(--text-secondary)", borderRadius: "24px",
            cursor: "pointer", transition: "var(--transition-smooth)"
          }}
          onMouseOver={(e) => { e.currentTarget.style.borderColor = "var(--text-primary)"; e.currentTarget.style.color = "var(--text-primary)"; }}
          onMouseOut={(e) => { e.currentTarget.style.borderColor = "var(--text-secondary)"; e.currentTarget.style.color = "var(--text-secondary)"; }}>
            View Menus
          </button>
        </div>

        {/* Categories / Featured Elements */}
        <div className="animate-fade-in" style={{ display: "flex", gap: "2rem", marginTop: "4rem", animationDelay: "0.6s", flexWrap: "wrap", justifyContent: "center" }}>
          {[
            { icon: <FaCoffee size={24} />, name: "Cafes", color: "#FDE68A" },
            { icon: <FaPizzaSlice size={24} />, name: "Fast Food", color: "#FECACA" },
            { icon: <FaLeaf size={24} />, name: "Healthy", color: "#A7F3D0" },
            { icon: <FaHamburger size={24} />, name: "Grill", color: "#FED7AA" }
          ].map((cat, i) => (
            <div key={i} className="glass-panel animate-float" style={{ 
              padding: "1.5rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem",
              minWidth: "120px", cursor: "pointer", animationDelay: `${i * 0.2}s`, transition: "var(--transition-smooth)"
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-5px) scale(1.05)"}
            onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0) scale(1)"}>
              <div style={{ color: cat.color, background: "rgba(255,255,255,0.05)", padding: "1rem", borderRadius: "50%" }}>
                {cat.icon}
              </div>
              <span style={{ fontWeight: "500" }}>{cat.name}</span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
