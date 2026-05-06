"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Activity, Users, Cpu, Server } from "lucide-react";

export function LiveMetrics() {
  const [cpu, setCpu] = useState(25);
  const [cpuHistory, setCpuHistory] = useState<number[]>(Array(20).fill(25));
  const [memory, setMemory] = useState(3.4);
  const [users, setUsers] = useState(42);

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate live metrics
      setCpu((prev) => {
        const change = (Math.random() - 0.5) * 20;
        const next = Math.max(10, Math.min(90, prev + change));
        setCpuHistory((hist) => [...hist.slice(1), next]);
        return next;
      });
      
      setMemory((prev) => {
        const change = (Math.random() - 0.5) * 0.4;
        const next = Math.max(2.5, Math.min(7.2, prev + change));
        return next;
      });

      setUsers((prev) => {
        if (Math.random() > 0.5) {
          const change = Math.floor((Math.random() - 0.5) * 6);
          return Math.max(15, prev + change);
        }
        return prev;
      });
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1, duration: 0.8 }}
      className="fixed bottom-24 right-6 md:bottom-8 md:right-8 z-40 flex flex-col gap-2 font-mono text-[10px] w-56 pointer-events-none"
    >
      <div className="bg-background/80 backdrop-blur-xl border border-border-color rounded-xl p-4 shadow-[0_0_30px_rgba(0,255,255,0.05)]">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-border-color">
          <span className="text-cyan font-bold tracking-widest flex items-center gap-2">
            <Activity className="w-3 h-3 animate-pulse" />
            TELEMETRY
          </span>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-green-500 tracking-wider font-bold">LIVE</span>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {/* CPU Grafana-style Chart */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-text-muted mb-1">
              <span className="flex items-center gap-1"><Cpu className="w-3 h-3" /> CPU_LOAD</span>
              <span className="text-cyan font-bold">{cpu.toFixed(1)}%</span>
            </div>
            
            {/* Sparkline Chart */}
            <div className="w-full h-10 border-b border-l border-border-color/50 relative">
              <svg viewBox="0 0 100 40" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="cpuGradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="var(--cyan)" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="var(--cyan)" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <polygon
                  fill="url(#cpuGradient)"
                  points={`0,40 ${cpuHistory.map((val, i) => `${(i / 19) * 100},${40 - (val / 100) * 40}`).join(" ")} 100,40`}
                  className="transition-all duration-300 ease-linear"
                />
                <polyline
                  fill="none"
                  stroke="var(--cyan)"
                  strokeWidth="1.5"
                  points={cpuHistory.map((val, i) => `${(i / 19) * 100},${40 - (val / 100) * 40}`).join(" ")}
                  className="transition-all duration-300 ease-linear"
                />
              </svg>
            </div>
          </div>

          {/* Memory Bar */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-text-muted">
              <span className="flex items-center gap-1"><Server className="w-3 h-3" /> MEM_USAGE</span>
              <span className="text-purple-400 font-bold">{memory.toFixed(2)} GB / 8.0 GB</span>
            </div>
            <div className="h-1.5 w-full bg-bg-secondary rounded-full overflow-hidden">
              <div 
                className="h-full bg-purple-500 transition-all duration-1000 ease-out relative" 
                style={{ width: `${(memory / 8) * 100}%` }}
              >
                <div className="absolute top-0 right-0 bottom-0 w-4 bg-white/30 animate-[pulse_2s_infinite]" />
              </div>
            </div>
          </div>

          {/* Active Users */}
          <div className="flex justify-between text-text-muted items-center pt-2 border-t border-border-color/50 mt-1">
            <span className="flex items-center gap-1"><Users className="w-3 h-3" /> ACTIVE_USERS</span>
            <span className="text-foreground font-bold text-xs">{users}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
