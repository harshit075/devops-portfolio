"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Cpu, Network, X, Maximize2, Terminal } from "lucide-react";

export function LiveMetrics() {
  const [cpu, setCpu] = useState(0);
  const [cpuHistory, setCpuHistory] = useState<number[]>(Array(60).fill(0));
  const [memoryUsed, setMemoryUsed] = useState(0);
  const [memoryTotal, setMemoryTotal] = useState(0);
  const [sessionUptime, setSessionUptime] = useState(0);
  const [platform, setPlatform] = useState("Unknown");
  const [cpuCores, setCpuCores] = useState(0);
  const [networkType, setNetworkType] = useState("Unknown");
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // Set static client specs
    setPlatform(navigator.platform || "Unknown");
    setCpuCores(navigator.hardwareConcurrency || 0);
    
    const conn = (navigator as any).connection;
    if (conn) {
      setNetworkType(`${conn.effectiveType?.toUpperCase() || 'WIFI'} (${conn.downlink || 0} Mbps)`);
    }

    // FPS-based CPU Estimation
    let frameCount = 0;
    let lastTime = performance.now();
    let animationFrameId: number;

    const measureFPS = (time: number) => {
      frameCount++;
      const elapsed = time - lastTime;
      
      if (elapsed >= 1000) {
        const fps = (frameCount * 1000) / elapsed;
        
        // Estimate CPU load: if 60fps -> ~5-15% idle load. If drops -> higher load.
        const baseLoad = 5 + Math.random() * 10;
        const loadFromFrameDrops = Math.max(0, (60 - fps) * 2.5); // 30fps drop = +75% load
        const estimatedCpu = Math.min(100, baseLoad + loadFromFrameDrops);
        
        setCpu(estimatedCpu);
        setCpuHistory(prev => [...prev.slice(1), estimatedCpu]);
        
        // Memory (Chrome only, fallback to mock if unsupported)
        const mem = (performance as any).memory;
        if (mem) {
          setMemoryUsed(mem.usedJSHeapSize / 1048576); // MB
          setMemoryTotal(mem.jsHeapSizeLimit / 1048576); // MB
        } else {
          // Mock memory if Firefox/Safari
          setMemoryUsed(50 + Math.random() * 20);
          setMemoryTotal(2048);
        }

        frameCount = 0;
        lastTime = time;
      }
      animationFrameId = requestAnimationFrame(measureFPS);
    };
    
    animationFrameId = requestAnimationFrame(measureFPS);

    // Session Uptime
    const startTime = Date.now();
    const intervalId = setInterval(() => {
      setSessionUptime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearInterval(intervalId);
    };
  }, []);

  return (
    <>
      {/* Small Floating Widget */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 1, ease: "easeOut" }}
        className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-40 flex flex-col font-mono cursor-pointer hover:scale-[1.02] transition-transform duration-300 group"
        onClick={() => setIsExpanded(true)}
      >
        <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
          <Maximize2 className="w-3.5 h-3.5 text-[#58a6ff]" />
        </div>
        <div className="w-64 bg-[#050505]/60 backdrop-blur-3xl border border-white/10 rounded-xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex flex-col">
          {/* Header */}
          <div className="px-4 py-3 bg-white/[0.02] border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-[#58a6ff]" />
              <span className="text-[11px] font-bold text-[#c9d1d9] tracking-widest uppercase">Client Metrics</span>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded border border-[#3fb950]/20 bg-[#3fb950]/5">
              <div className="w-1.5 h-1.5 rounded-full bg-[#3fb950] animate-pulse shadow-[0_0_5px_rgba(63,185,80,0.8)]" />
              <span className="text-[9px] font-bold text-[#3fb950] tracking-widest uppercase">Live</span>
            </div>
          </div>
          {/* Content */}
          <div className="p-4 flex flex-col gap-5">
            {/* CPU */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[#8b949e]">
                  <Cpu className="w-3.5 h-3.5" />
                  <span className="text-[10px] uppercase tracking-wider font-semibold">Local CPU Est.</span>
                </div>
                <span className="text-xs font-bold text-white">{cpu.toFixed(1)}%</span>
              </div>
              <div className="w-full h-12 relative bg-black/20 rounded border border-white/5 overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:8px_8px]" />
                <svg viewBox="0 0 100 40" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="cpuGrad" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#58a6ff" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#58a6ff" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <polygon fill="url(#cpuGrad)" points={`0,40 ${cpuHistory.slice(-30).map((val, i) => `${(i / 29) * 100},${40 - (val / 100) * 40}`).join(" ")} 100,40`} className="transition-all duration-300 ease-linear" />
                  <polyline fill="none" stroke="#58a6ff" strokeWidth="1.2" points={cpuHistory.slice(-30).map((val, i) => `${(i / 29) * 100},${40 - (val / 100) * 40}`).join(" ")} className="transition-all duration-300 ease-linear drop-shadow-[0_0_2px_rgba(88,166,255,0.6)]" />
                </svg>
              </div>
            </div>
            {/* Memory */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[#8b949e]">
                  <Terminal className="w-3.5 h-3.5" />
                  <span className="text-[10px] uppercase tracking-wider font-semibold">JS Heap</span>
                </div>
                <span className="text-[10px] text-white">
                  <span className="font-bold text-[#3fb950]">{memoryUsed.toFixed(0)}</span> MB
                </span>
              </div>
              <div className="h-1.5 w-full bg-[#161b22] rounded-full overflow-hidden flex">
                <div className="h-full bg-[#3fb950] shadow-[0_0_8px_rgba(63,185,80,0.4)] transition-all duration-1000 ease-out" style={{ width: memoryTotal ? `${(memoryUsed / memoryTotal) * 100}%` : '0%' }} />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Expanded Full-Screen Modal */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/60 font-mono"
            onClick={() => setIsExpanded(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-5xl h-[85vh] bg-[#050505]/90 border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
            >
              {/* Modal Header */}
              <div className="px-6 py-4 bg-white/[0.02] border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Activity className="w-5 h-5 text-[#58a6ff]" />
                  <h2 className="text-sm md:text-base font-bold text-[#c9d1d9] tracking-widest uppercase">Client Telemetry</h2>
                </div>
                <div className="flex items-center gap-4">
                  <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded border border-[#3fb950]/20 bg-[#3fb950]/5">
                    <div className="w-2 h-2 rounded-full bg-[#3fb950] animate-pulse shadow-[0_0_8px_rgba(63,185,80,0.8)]" />
                    <span className="text-[10px] font-bold text-[#3fb950] tracking-widest uppercase">Local Stream</span>
                  </div>
                  <button onClick={() => setIsExpanded(false)} className="text-[#8b949e] hover:text-white transition-colors p-1 bg-white/5 rounded hover:bg-white/10">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-4 md:p-6 overflow-y-auto flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Large CPU Graph */}
                <div className="lg:col-span-3 bg-black/40 border border-white/5 rounded-xl p-5 md:p-6 flex flex-col gap-6 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
                  <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-2 text-[#8b949e]">
                      <Cpu className="w-5 h-5" />
                      <span className="text-xs md:text-sm uppercase tracking-wider font-bold">Estimated CPU Utilization</span>
                    </div>
                    <span className="text-2xl md:text-3xl font-black text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">{cpu.toFixed(1)}%</span>
                  </div>
                  <div className="w-full h-48 md:h-64 relative">
                    <svg viewBox="0 0 100 40" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="cpuGradLarge" x1="0" x2="0" y1="0" y2="1">
                          <stop offset="0%" stopColor="#58a6ff" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="#58a6ff" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      <polygon fill="url(#cpuGradLarge)" points={`0,40 ${cpuHistory.map((val, i) => `${(i / 59) * 100},${40 - (val / 100) * 40}`).join(" ")} 100,40`} className="transition-all duration-300 ease-linear" />
                      <polyline fill="none" stroke="#58a6ff" strokeWidth="0.8" points={cpuHistory.map((val, i) => `${(i / 59) * 100},${40 - (val / 100) * 40}`).join(" ")} className="transition-all duration-300 ease-linear drop-shadow-[0_0_5px_rgba(88,166,255,0.8)]" />
                    </svg>
                  </div>
                </div>

                {/* Node.js Heap Memory */}
                <div className="lg:col-span-2 bg-black/40 border border-white/5 rounded-xl p-5 md:p-6 flex flex-col justify-center gap-6 relative">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[#8b949e]">
                      <Terminal className="w-5 h-5" />
                      <span className="text-xs md:text-sm uppercase tracking-wider font-bold">Browser JS Heap (Client)</span>
                    </div>
                    <span className="text-sm text-white font-bold">
                      <span className="text-[#3fb950] text-xl">{memoryUsed.toFixed(1)}</span> / {memoryTotal > 0 ? memoryTotal.toFixed(0) : '2048'} MB
                    </span>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <div className="h-6 w-full bg-[#161b22] rounded-md overflow-hidden flex relative border border-white/5">
                      <div className="h-full bg-gradient-to-r from-[#2ea043] to-[#3fb950] shadow-[0_0_15px_rgba(63,185,80,0.5)] transition-all duration-1000 ease-out" style={{ width: memoryTotal ? `${(memoryUsed / memoryTotal) * 100}%` : '0%' }} />
                    </div>
                  </div>
                </div>

                {/* Network / Client Specs */}
                <div className="lg:col-span-1 bg-black/40 border border-white/5 rounded-xl p-5 md:p-6 flex flex-col justify-center gap-4 relative">
                  <div className="flex items-center gap-2 text-[#8b949e] mb-2">
                    <Network className="w-5 h-5" />
                    <span className="text-xs md:text-sm uppercase tracking-wider font-bold">Client Info</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[#8b949e] uppercase tracking-wider">Network</span>
                    <span className="text-white font-bold">{networkType}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[#8b949e] uppercase tracking-wider">Architecture</span>
                    <span className="text-white font-bold truncate max-w-[100px] text-right">{platform}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[#8b949e] uppercase tracking-wider">Logical Cores</span>
                    <span className="text-white font-bold">{cpuCores} vCPUs</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[#8b949e] uppercase tracking-wider">Session Time</span>
                    <span className="text-[#58a6ff] font-bold">{Math.floor(sessionUptime / 60)}m {sessionUptime % 60}s</span>
                  </div>
                </div>

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
