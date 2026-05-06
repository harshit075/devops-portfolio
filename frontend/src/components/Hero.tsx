"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";

const typewriterWords = [
  "Cloud Architect / クラウドアーキテクト",
  "C/C++ Programmer / C/C++プログラマー",
  "Problem Solver / 問題解決者",
  "System Optimizer / システム最適化",
];

export function Hero() {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(true);

  // Name hover state
  const [isNameHovered, setIsNameHovered] = useState(false);
  const [nameDisplay, setNameDisplay] = useState("Harshit Borana");

  // Blinking cursor
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setCursorVisible((v) => !v);
    }, 500);
    return () => clearInterval(cursorInterval);
  }, []);

  // Typewriter effect
  useEffect(() => {
    const word = typewriterWords[currentWordIndex];
    let timeout: NodeJS.Timeout;

    if (isDeleting) {
      if (currentText === "") {
        setIsDeleting(false);
        setCurrentWordIndex((prev) => (prev + 1) % typewriterWords.length);
      } else {
        timeout = setTimeout(() => {
          setCurrentText(currentText.slice(0, -1));
        }, 50); // Deleting speed
      }
    } else {
      if (currentText === word) {
        timeout = setTimeout(() => {
          setIsDeleting(true);
        }, 2000); // Pause before deleting
      } else {
        timeout = setTimeout(() => {
          setCurrentText(word.slice(0, currentText.length + 1));
        }, 100); // Typing speed
      }
    }

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, currentWordIndex]);

  // Name hover translation effect
  useEffect(() => {
    if (!isNameHovered) {
      setNameDisplay("Harshit Borana");
      return;
    }

    const translations = [
      "Harshit Borana", // English/Spanish/French
      "ハルシット・ボラナ", // Japanese
      "Харшит Борана", // Russian
      "हर्षित बोराना", // Hindi
      "ஹர்ஷித் போரானா", // Tamil
      "हर्षितः बोराना", // Sanskrit
      "Harshit Borana", // Backup
    ];

    let currentIndex = 0;
    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % translations.length;
      setNameDisplay(translations[currentIndex]);
    }, 800);

    return () => clearInterval(interval);
  }, [isNameHovered]);

  return (
    <section id="hero" className="relative h-screen flex flex-col justify-center items-center px-6 md:px-20 overflow-hidden">
      {/* Engaging Background Grid & Glow */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border-color)_1px,transparent_1px),linear-gradient(to_bottom,var(--border-color)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_10%,transparent_100%)] opacity-20 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan/10 blur-[120px] rounded-full pointer-events-none z-0" />

      {/* Background text decoration */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[12vw] font-black text-black/[0.04] dark:text-white/[0.04] select-none whitespace-nowrap z-0 pointer-events-none tracking-tighter"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        DEV/OPS
      </motion.div>

      <div className="z-10 text-center flex flex-col items-center mt-[-10vh]">
        {/* Eyebrow */}
        <motion.div
          className="text-sm md:text-base tracking-[0.4em] font-semibold text-text-muted mb-8 flex flex-col items-center gap-2 cursor-pointer h-[40px] justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          onMouseEnter={() => setIsNameHovered(true)}
          onMouseLeave={() => setIsNameHovered(false)}
        >
          <motion.span
            className="uppercase drop-shadow-[0_0_8px_rgba(0,255,255,0.4)] whitespace-nowrap"
            style={{ color: isNameHovered ? "var(--foreground)" : "var(--cyan)" }}
            animate={
              isNameHovered
                ? {
                    scale: typeof window !== "undefined" && window.innerWidth > 768 ? 1.8 : 1.3,
                    x: [0, 15, 30, 15, 0, -15, -30, -15, 0],
                    y: [0, -15, 0, 15, 0, -15, 0, 15, 0],
                  }
                : { scale: 1, x: 0, y: 0 }
            }
            transition={
              isNameHovered
                ? {
                    scale: { type: "spring", stiffness: 300, damping: 15 },
                    x: { repeat: Infinity, duration: 2, ease: "linear" },
                    y: { repeat: Infinity, duration: 2, ease: "linear" },
                  }
                : { type: "spring", stiffness: 300, damping: 15 }
            }
          >
            {nameDisplay}
          </motion.span>
          {!isNameHovered && (
            <span className="text-xs tracking-[0.2em] opacity-80 transition-opacity">
              ハルシット・ボラナ
            </span>
          )}
        </motion.div>
        
        {/* Main Title Group */}
        <motion.div
          className="relative mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter uppercase relative z-10 leading-none">
            DevOps Engineer
          </h1>
          {/* Japanese Translation overlaid or below */}
          <div className="absolute -bottom-4 md:-bottom-6 left-0 w-full text-center z-0">
            <span className="text-2xl md:text-4xl lg:text-5xl font-black tracking-widest text-transparent [-webkit-text-stroke:1px_var(--border-color)] dark:[-webkit-text-stroke:1px_var(--border-color)] opacity-40 select-none">
              デブオプスエンジニア
            </span>
          </div>
        </motion.div>

        {/* Typewriter Subheading */}
        <motion.div
          className="text-xl md:text-3xl lg:text-4xl font-light text-text-muted mt-12 md:mt-16 h-12 md:h-16 flex items-center bg-background/50 backdrop-blur-sm px-6 py-4 rounded-full border border-border-color shadow-[0_0_30px_rgba(0,255,255,0.05)]"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <span className="text-cyan font-bold mr-3">+</span>
          <span className="min-w-[280px] md:min-w-[480px] text-left">{currentText}</span>
          <span
            className="w-[3px] md:w-[4px] h-[24px] md:h-[32px] bg-cyan ml-1 drop-shadow-[0_0_5px_rgba(0,255,255,0.8)]"
            style={{ opacity: cursorVisible ? 1 : 0 }}
          />
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center cursor-pointer group"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        onClick={() => {
          window.scrollTo({
            top: window.innerHeight,
            behavior: "smooth",
          });
        }}
      >
        <span className="text-[10px] uppercase tracking-widest text-text-muted mb-2">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        >
          <ChevronDown className="w-5 h-5 text-text-muted" />
        </motion.div>
      </motion.div>
    </section>
  );
}
