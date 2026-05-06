"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, ChevronRight } from "lucide-react";

const stages = [
  { name: "Initialize Pipeline", logs: ["Fetching repository...", "Resolving dependencies...", "Setting up environment..."] },
  { name: "SonarQube Scanning", logs: ["Running static code analysis...", "Checking for vulnerabilities...", "Analyzing code smells..."] },
  { name: "SonarQube Reporting", logs: ["Generating quality gate report...", "Uploading to Sonar Server...", "Quality Gate: PASSED"] },
  { name: "Prepare Environment", logs: ["Pulling base images...", "Setting up volume mounts...", "Configuring network interfaces..."] },
  { name: "Build Docker Image", logs: ["Step 1/8 : FROM node:18-alpine", "Step 4/8 : RUN npm install", "Successfully built 94f1c7d3b2a1"] },
  { name: "Docker Pull", logs: ["Pushing image to registry...", "Verifying tags...", "Image deployed to remote registry."] },
  { name: "Deploy to Server", logs: ["Restarting containers...", "Health checks passing...", "Deployment successful!"] },
];

export function PipelineLoader({ onComplete }: { onComplete: () => void }) {
  const [currentStage, setCurrentStage] = useState(0);
  const [activeLogIndex, setActiveLogIndex] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.style.overflow = "hidden";
    
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter") {
        onComplete();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onComplete]);

  useEffect(() => {
    if (currentStage < stages.length) {
      // Fast typing effect for fake logs
      const logInterval = setInterval(() => {
        setActiveLogIndex((prev) => Math.min(prev + 1, stages[currentStage].logs.length - 1));
      }, 300);

      // Random duration for each stage between 1s and 1.6s
      const stageDuration = Math.random() * 600 + 1000; 
      const timer = setTimeout(() => {
        setCurrentStage((prev) => prev + 1);
        setActiveLogIndex(0);
      }, stageDuration);

      return () => {
        clearTimeout(timer);
        clearInterval(logInterval);
      };
    } else {
      const timer = setTimeout(() => {
        onComplete();
      }, 1200); // Hold for a moment on success before closing
      return () => clearTimeout(timer);
    }
  }, [currentStage, onComplete]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-xl flex flex-col items-center justify-center font-mono text-sm p-4 md:p-8"
    >
      {/* Skip Button */}
      <button 
        onClick={onComplete}
        className="absolute top-6 right-6 md:top-8 md:right-8 text-[#8b949e] hover:text-[#c9d1d9] text-xs font-mono uppercase tracking-widest bg-white/5 hover:bg-white/10 px-4 py-2 rounded transition-colors border border-white/5 flex items-center gap-2 z-50 cursor-pointer"
      >
        Skip <span className="text-[#58a6ff] border border-[#58a6ff]/30 px-1.5 rounded text-[10px]">ESC</span>
      </button>

      <div className="w-full max-w-3xl rounded-xl overflow-hidden bg-[#0d1117] border border-white/10 shadow-[0_0_60px_rgba(0,0,0,0.8)] flex flex-col">
        {/* Terminal Header */}
        <div className="h-10 bg-[#161b22] border-b border-white/5 flex items-center px-4 relative">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56] shadow-[0_0_5px_rgba(255,95,86,0.5)]" />
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e] shadow-[0_0_5px_rgba(255,189,46,0.5)]" />
            <div className="w-3 h-3 rounded-full bg-[#27c93f] shadow-[0_0_5px_rgba(39,201,63,0.5)]" />
          </div>
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 text-[#8b949e] text-xs font-bold tracking-widest">
            <Terminal className="w-3 h-3" />
            <span>bash - deploy.sh</span>
          </div>
        </div>

        {/* Terminal Body */}
        <div className="p-6 md:p-8 flex flex-col gap-3 min-h-[450px] relative">
          {stages.map((stage, index) => {
            if (index > currentStage) return null; // Only show past and current stages

            const isCompleted = index < currentStage;
            const isCurrent = index === currentStage;

            return (
              <motion.div 
                key={stage.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-col gap-1"
              >
                <div className="flex items-center gap-3">
                  {isCompleted ? (
                    <span className="text-[#3fb950] font-bold">✔</span>
                  ) : (
                    <ChevronRight className="w-4 h-4 text-[#58a6ff] animate-pulse" />
                  )}
                  <span className={`font-bold tracking-wide ${isCompleted ? 'text-[#8b949e]' : 'text-[#c9d1d9]'}`}>
                    {stage.name}
                  </span>
                  
                  {isCurrent && (
                    <span className="ml-auto text-xs text-[#58a6ff] bg-[#58a6ff]/10 px-2 py-0.5 rounded border border-[#58a6ff]/20">
                      In Progress...
                    </span>
                  )}
                  {isCompleted && (
                    <span className="ml-auto text-xs text-[#3fb950] font-mono opacity-80">
                      {Math.floor(Math.random() * 800 + 400)}ms
                    </span>
                  )}
                </div>

                {/* Simulated Logs for Current Stage */}
                <AnimatePresence>
                  {isCurrent && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="ml-7 text-[#8b949e] text-xs flex flex-col gap-1 overflow-hidden font-mono"
                    >
                      {stage.logs.slice(0, activeLogIndex + 1).map((log, i) => (
                        <span key={i} className="opacity-80">&gt; {log}</span>
                      ))}
                      <span className="w-2 h-3 bg-[#c9d1d9] animate-pulse mt-1" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
          
          {currentStage === stages.length && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-4 pt-4 border-t border-white/5 flex flex-col gap-2"
            >
              <span className="text-[#3fb950] font-bold text-base tracking-wide">✨ Deployment completed successfully!</span>
              <span className="text-[#8b949e] text-xs">&gt; Starting application server...</span>
            </motion.div>
          )}

          {/* Progress Bar (Terminal Style) */}
          <div className="mt-auto pt-6">
            <div className="flex justify-between text-[#8b949e] text-xs mb-2 uppercase tracking-widest font-bold">
              <span>Overall Progress</span>
              <span>{Math.round((currentStage / stages.length) * 100)}%</span>
            </div>
            <div className="h-1.5 w-full bg-[#21262d] rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-[#58a6ff] shadow-[0_0_10px_rgba(88,166,255,0.5)]"
                initial={{ width: "0%" }}
                animate={{ width: `${(currentStage / stages.length) * 100}%` }}
                transition={{ ease: "easeInOut", duration: 0.3 }}
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
