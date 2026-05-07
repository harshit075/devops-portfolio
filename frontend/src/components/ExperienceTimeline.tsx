"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { GitCommit, GitBranch, GitMerge, GitPullRequest } from "lucide-react";

const timelineData = [
  {
    id: "commit-1",
    hash: "a1b2c3d",
    type: "init",
    date: "2021",
    title: "git init",
    description: "Started B.Tech in Computer Science & Engineering. Discovered the world of programming.",
    icon: GitCommit,
    color: "text-[#8b949e]",
    bgColor: "bg-[#8b949e]/10",
    borderColor: "border-[#8b949e]/30"
  },
  {
    id: "commit-2",
    hash: "f4e5d6c",
    type: "branch",
    date: "2022",
    title: "git checkout -b fullstack",
    description: "Mastered C/C++, DSA, and web development. Built first full-stack projects.",
    icon: GitBranch,
    color: "text-[#d2a8ff]",
    bgColor: "bg-[#d2a8ff]/10",
    borderColor: "border-[#d2a8ff]/30"
  },
  {
    id: "commit-3",
    hash: "9h8g7f6",
    type: "commit",
    date: "2023",
    title: "git commit -m 'DevOps Awakening'",
    description: "Pivoted focus to infrastructure. Learned Docker, CI/CD, and AWS. Set up first automated pipeline.",
    icon: GitCommit,
    color: "text-[#58a6ff]",
    bgColor: "bg-[#58a6ff]/10",
    borderColor: "border-[#58a6ff]/30"
  },
  {
    id: "commit-4",
    hash: "j5k4l3m",
    type: "merge",
    date: "2024",
    title: "git merge devops-internship",
    description: "Joined Kadel Labs. Managed enterprise deployments, Kubernetes clusters, and production monitoring.",
    icon: GitMerge,
    color: "text-[#a371f7]",
    bgColor: "bg-[#a371f7]/10",
    borderColor: "border-[#a371f7]/30"
  },
  {
    id: "commit-5",
    hash: "p2o1n0m",
    type: "pr",
    date: "Present",
    title: "Ready for Production",
    description: "Actively seeking full-time DevOps Engineering roles. Building robust, scalable systems.",
    icon: GitPullRequest,
    color: "text-[#3fb950]",
    bgColor: "bg-[#3fb950]/10",
    borderColor: "border-[#3fb950]/30"
  }
];

export function ExperienceTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section className="relative w-full py-32 overflow-hidden bg-background font-mono" ref={containerRef}>
      <div className="max-w-4xl mx-auto px-6 lg:px-10 z-10 relative">
        <div className="flex flex-col mb-20 items-center text-center">
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter flex items-center gap-4">
            <GitBranch className="w-10 h-10 text-[#58a6ff]" />
            git log --oneline
          </h2>
          <span className="text-sm md:text-base font-bold tracking-widest text-[#8b949e] mt-4">
            Experience & Education History
          </span>
        </div>

        <div className="relative">
          {/* Animated Git Branch Line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 md:-ml-[0.5px] bg-[#21262d] rounded-full overflow-hidden z-0">
            <motion.div 
              className="absolute top-0 left-0 w-full bg-gradient-to-b from-[#58a6ff] via-[#d2a8ff] to-[#3fb950] origin-top"
              style={{ scaleY: pathLength, height: '100%' }}
            />
          </div>

          <div className="flex flex-col gap-12 md:gap-24">
            {timelineData.map((item, index) => {
              const isEven = index % 2 === 0;
              const Icon = item.icon;

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className={`relative flex flex-col md:flex-row items-start ${isEven ? 'md:flex-row-reverse' : ''} gap-8 md:gap-16`}
                >
                  {/* Timeline Node */}
                  <div className="absolute left-8 md:left-1/2 -translate-x-1/2 flex items-center justify-center z-10 mt-1 md:mt-0">
                    <div className={`w-12 h-12 rounded-full border-4 border-[#0d1117] ${item.bgColor} ${item.color} flex items-center justify-center relative`}>
                      <Icon className="w-5 h-5" />
                      {/* Pulse effect for latest node */}
                      {index === timelineData.length - 1 && (
                        <div className="absolute inset-0 rounded-full border-2 border-[#3fb950] animate-ping opacity-50" />
                      )}
                    </div>
                  </div>

                  {/* Content Card */}
                  <div className={`ml-20 md:ml-0 flex-1 w-full md:w-1/2 ${isEven ? 'md:pr-16 md:text-right' : 'md:pl-16 md:text-left'}`}>
                    <div className={`p-6 rounded-xl border bg-[#161b22]/50 hover:bg-[#161b22] transition-colors group ${item.borderColor}`}>
                      <div className={`flex items-center gap-3 mb-3 ${isEven ? 'md:justify-end' : ''}`}>
                        <span className="text-[#8b949e] font-bold text-xs tracking-widest uppercase bg-white/5 px-2 py-1 rounded">
                          {item.date}
                        </span>
                        <span className={`text-xs font-bold ${item.color}`}>
                          [{item.hash}]
                        </span>
                      </div>
                      <h3 className="text-xl md:text-2xl font-bold text-[#c9d1d9] mb-2 font-sans tracking-tight">
                        {item.title}
                      </h3>
                      <p className="text-[#8b949e] text-sm md:text-base leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
