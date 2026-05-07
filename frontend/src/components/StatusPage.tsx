"use client";

import { motion } from "framer-motion";
import { CheckCircle2, AlertCircle, Clock, ShieldCheck } from "lucide-react";

export function StatusPage() {
  const metrics = [
    { name: "Problem Solving Engine", status: "Operational", uptime: "100%", type: "core" },
    { name: "Coffee Levels", status: "Degraded Performance", uptime: "42%", type: "warning" },
    { name: "Willingness to Relocate", status: "Operational", uptime: "100%", type: "core" },
    { name: "Current Deployment Pipeline", status: "Idle - Ready for Hire", uptime: "100%", type: "info" },
  ];

  return (
    <section className="w-full py-20 bg-[#0d1117] border-y border-white/5 font-mono">
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-[#c9d1d9] flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-[#3fb950]" />
              System Status
            </h2>
            <p className="text-[#8b949e] text-sm">Real-time status of Harshit's core systems and APIs.</p>
          </div>
          
          <div className="flex items-center gap-2 bg-[#3fb950]/10 border border-[#3fb950]/30 px-4 py-2 rounded-lg">
            <div className="w-2.5 h-2.5 rounded-full bg-[#3fb950] animate-pulse shadow-[0_0_8px_rgba(63,185,80,0.8)]" />
            <span className="text-[#3fb950] font-bold text-sm uppercase tracking-widest">All Systems Normal</span>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {metrics.map((metric, i) => (
            <motion.div 
              key={metric.name}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-4 md:p-5 bg-[#161b22] border border-white/5 rounded-xl gap-4 hover:border-white/10 transition-colors"
            >
              <div className="flex items-center gap-3">
                {metric.type === "warning" ? (
                  <AlertCircle className="w-5 h-5 text-[#d29922]" />
                ) : metric.type === "info" ? (
                  <Clock className="w-5 h-5 text-[#58a6ff]" />
                ) : (
                  <CheckCircle2 className="w-5 h-5 text-[#3fb950]" />
                )}
                <span className="font-bold text-[#c9d1d9]">{metric.name}</span>
              </div>
              
              <div className="flex items-center gap-6 text-sm">
                <span className="hidden sm:block text-[#8b949e]">Uptime: {metric.uptime}</span>
                <span className={`font-bold tracking-widest uppercase text-xs px-3 py-1 rounded-full border
                  \${metric.type === 'warning' ? 'text-[#d29922] bg-[#d29922]/10 border-[#d29922]/20' : 
                    metric.type === 'info' ? 'text-[#58a6ff] bg-[#58a6ff]/10 border-[#58a6ff]/20' : 
                    'text-[#3fb950] bg-[#3fb950]/10 border-[#3fb950]/20'}`}
                >
                  {metric.status}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-8 pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between text-[#8b949e] text-xs gap-4">
          <span>Last updated: Just now</span>
          <a href="#contact" className="hover:text-[#58a6ff] transition-colors flex items-center gap-2">
            Report an incident (Hire Me) &rarr;
          </a>
        </div>
      </div>
    </section>
  );
}
