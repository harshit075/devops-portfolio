"use client";

import { useEffect, useState } from "react";
import { Home, Briefcase, User, Code, Mail } from "lucide-react";
import { motion } from "framer-motion";

const navItems = [
  { id: "hero", label: "Home", icon: Home },
  { id: "projects", label: "Projects", icon: Briefcase },
  { id: "about", label: "About", icon: User },
  { id: "skills", label: "Skills", icon: Code },
  { id: "contact", label: "Contact", icon: Mail },
];

export function Navbar() {
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.5 } // Trigger when 50% of the section is visible
    );

    navItems.forEach((item) => {
      const section = document.getElementById(item.id);
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <motion.nav 
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed bottom-6 md:bottom-auto md:top-1/2 left-1/2 md:left-8 -translate-x-1/2 md:-translate-x-0 md:-translate-y-1/2 w-[90%] max-w-sm md:w-16 md:max-w-none h-16 md:h-auto md:py-8 rounded-full bg-bg-secondary/40 backdrop-blur-xl border border-white/10 dark:border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.2)] dark:shadow-[0_8px_32px_rgba(0,255,255,0.05)] flex md:flex-col items-center justify-around md:justify-center md:gap-8 z-50"
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeSection === item.id;
        
        return (
          <button
            key={item.id}
            onClick={() => scrollToSection(item.id)}
            className="relative group flex flex-col items-center p-3 outline-none"
            title={item.label}
          >
            {/* Active background glow */}
            {isActive && (
              <motion.div
                layoutId="activeNavIndicator"
                className="absolute inset-0 bg-cyan/20 rounded-full shadow-[0_0_15px_rgba(0,255,255,0.3)]"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            
            <Icon 
              className={`w-5 h-5 md:w-6 md:h-6 relative z-10 transition-colors duration-300 ${
                isActive ? "text-cyan drop-shadow-[0_0_8px_rgba(0,255,255,0.8)]" : "text-text-muted group-hover:text-foreground"
              }`} 
            />
            
            {/* Tooltip for desktop */}
            <span className="hidden md:block absolute left-full ml-6 px-3 py-1.5 bg-foreground text-background text-xs font-bold uppercase tracking-widest rounded shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
              {item.label}
              {/* Tooltip triangle */}
              <span className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-foreground" />
            </span>
          </button>
        );
      })}
    </motion.nav>
  );
}
