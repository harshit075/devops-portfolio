"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";

export function About() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const yBg = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);

  return (
    <section ref={containerRef} className="relative w-full min-h-screen py-32 overflow-hidden bg-background">
      <motion.div
        className="absolute top-[20%] right-[-10%] text-[20vw] font-black text-black/[0.03] dark:text-white/[0.03] select-none whitespace-nowrap pointer-events-none tracking-tighter z-0"
        style={{ y: yBg }}
      >
        PROFILE
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 z-10 relative">
        <div className="flex flex-col mb-16">
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">
            About Me
          </h2>
          <span className="text-lg font-bold tracking-widest text-cyan uppercase opacity-80 mt-2">
            私について / Profile
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col space-y-8"
          >
            <p className="text-xl md:text-2xl font-medium leading-relaxed">
              Hi there. I&apos;m <span className="text-cyan bg-foreground px-2 inline-block -rotate-2">Harshit</span>, a DevOps Engineer focused on building robust, scalable infrastructure and seamless deployment pipelines.
            </p>
            
            <p className="text-lg md:text-xl text-text-muted leading-relaxed">
              My technical foundation is rooted heavily in C and C++, with a strong grasp of Data Structures and Algorithms (DSA) and Object-Oriented Programming (OOPS). Whether I&apos;m optimizing memory management or designing a centralized vulnerability detection system, I love tackling complex backend challenges.
            </p>

            <p className="text-lg md:text-xl text-text-muted leading-relaxed">
              When I&apos;m not configuring servers or writing scripts, I&apos;m usually exploring new tech or preparing for my next big challenge. Feel free to connect with me!
            </p>

            <div className="pt-8">
              <a
                href="https://www.linkedin.com/in/harshit-borana-🇮🇳-3a685a257/"
                target="_blank"
                rel="noreferrer"
                className="group relative inline-flex items-center gap-4 text-xl font-bold uppercase tracking-widest"
              >
                <span className="relative z-10 transition-colors group-hover:text-cyan">Connect on LinkedIn</span>
                <ArrowUpRight className="w-8 h-8 relative z-10 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform group-hover:text-cyan" />
                <div className="absolute bottom-0 left-0 w-full h-[3px] bg-foreground group-hover:bg-cyan transition-colors" />
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50, y: 50 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="w-full flex justify-center lg:justify-end"
          >
            <div className="relative w-full max-w-md aspect-[3/4] bg-bg-secondary overflow-hidden group border border-transparent hover:border-cyan/50 transition-colors duration-500 hover:shadow-[0_0_30px_rgba(0,255,255,0.15)]">
              <div className="absolute inset-0 z-10 bg-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              {/* Image Placeholder */}
              <img 
                src="/avatar.png" 
                alt="Harshit Borana Portrait" 
                className="w-full h-full object-cover grayscale transition-transform duration-700 ease-in-out group-hover:scale-105 group-hover:grayscale-0"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-foreground/10 to-transparent pointer-events-none" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
