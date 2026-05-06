"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Activity, Cpu, Server, Network } from "lucide-react";

export function LiveMetrics() {
  const [cpu, setCpu] = useState(0);
  const [cpuHistory, setCpuHistory] = useState<number[]>(Array(30).fill(0));
  const [memory, setMemory] = useState(0);
  const [memoryTotal, setMemoryTotal] = useState(8.0);
  const [users, setUsers] = useState(1);

  const { scrollYProgress } = useScroll();

  // Polished Scroll Transitions - Reveals happen smoothly as you scroll
  const cpuOpacity = useTransform(scrollYProgress, [0.02, 0.1], [0, 1]);
  const cpuY = useTransform(scrollYProgress, [0.02, 0.1], [15, 0]);

  const memOpacity = useTransform(scrollYProgress, [0.15, 0.25], [0, 1]);
  const memY = useTransform(scrollYProgress, [0.15, 0.25], [15, 0]);

  const usersOpacity = useTransform(scrollYProgress, [0.3, 0.4], [0, 1]);
  const usersY = useTransform(scrollYProgress, [0.3, 0.4], [15, 0]);

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
    const eventSource = new EventSource(`${apiUrl}/api/telemetry`);

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setCpu(data.cpu);
        setCpuHistory((hist) => [...hist.slice(1), data.cpu]);
        setMemory(data.memoryUsed);
        setMemoryTotal(data.memoryTotal);
        setUsers(data.activeUsers);
      } catch (err) {}
    };

    return () => eventSource.close();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1, duration: 1, ease: "easeOut" }}
      className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-40 flex flex-col font-mono pointer-events-none"
    >
      {/* Main Container - Ultra Premium Glassmorphism */}
      <div className="w-64 bg-[#050505]/60 backdrop-blur-3xl border border-white/10 rounded-xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex flex-col">
        
        {/* Header Bar */}
        <div className="px-4 py-3 bg-white/[0.02] border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-[#58a6ff]" />
            <span className="text-[11px] font-bold text-[#c9d1d9] tracking-widest uppercase">System</span>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded border border-[#3fb950]/20 bg-[#3fb950]/5">
            <div className="w-1.5 h-1.5 rounded-full bg-[#3fb950] animate-pulse shadow-[0_0_5px_rgba(63,185,80,0.8)]" />
            <span className="text-[9px] font-bold text-[#3fb950] tracking-widest uppercase">Live</span>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="p-4 flex flex-col gap-5">
          
          {/* CPU Chart Section */}
          <motion.div style={{ opacity: cpuOpacity, y: cpuY }} className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[#8b949e]">
                <Cpu className="w-3.5 h-3.5" />
                <span className="text-[10px] uppercase tracking-wider font-semibold">CPU Usage</span>
              </div>
              <span className="text-xs font-bold text-white">{cpu.toFixed(1)}%</span>
            </div>
            
            {/* Precision Area Chart */}
            <div className="w-full h-12 relative bg-black/20 rounded border border-white/5 overflow-hidden">
              {/* Grid Paper Background */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:8px_8px]" />
              
              <svg viewBox="0 0 100 40" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="cpuGrad" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#58a6ff" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#58a6ff" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <polygon
                  fill="url(#cpuGrad)"
                  points={`0,40 ${cpuHistory.map((val, i) => `${(i / 29) * 100},${40 - (val / 100) * 40}`).join(" ")} 100,40`}
                  className="transition-all duration-300 ease-linear"
                />
                <polyline
                  fill="none"
                  stroke="#58a6ff"
                  strokeWidth="1.2"
                  points={cpuHistory.map((val, i) => `${(i / 29) * 100},${40 - (val / 100) * 40}`).join(" ")}
                  className="transition-all duration-300 ease-linear drop-shadow-[0_0_2px_rgba(88,166,255,0.6)]"
                />
              </svg>
            </div>
          </motion.div>

          {/* Memory Allocation Section */}
          <motion.div style={{ opacity: memOpacity, y: memY }} className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[#8b949e]">
                <Server className="w-3.5 h-3.5" />
                <span className="text-[10px] uppercase tracking-wider font-semibold">Memory Alloc</span>
              </div>
              <span className="text-[10px] text-white">
                <span className="font-bold text-[#d2a8ff]">{memory.toFixed(2)}</span> / {memoryTotal.toFixed(1)} GB
              </span>
            </div>
            
            {/* Precision Progress Bar */}
            <div className="h-1.5 w-full bg-[#161b22] rounded-full overflow-hidden flex">
              <div 
                className="h-full bg-[#d2a8ff] shadow-[0_0_8px_rgba(210,168,255,0.4)] transition-all duration-1000 ease-out" 
                style={{ width: `${(memory / memoryTotal) * 100}%` }}
              />
            </div>
          </motion.div>

          {/* Active Connections Section */}
          <motion.div style={{ opacity: usersOpacity, y: usersY }} className="flex items-center justify-between pt-2 border-t border-white/5">
            <div className="flex items-center gap-1.5 text-[#8b949e]">
              <Network className="w-3.5 h-3.5" />
              <span className="text-[10px] uppercase tracking-wider font-semibold">TCP Connections</span>
            </div>
            <div className="flex items-center justify-center h-5 px-2 bg-[#161b22] rounded border border-white/5">
              <span className="text-[10px] font-bold text-white">{users}</span>
            </div>
          </motion.div>

        </div>
      </div>
    </motion.div>
  );
}
