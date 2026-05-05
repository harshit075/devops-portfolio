"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, ExternalLink } from "lucide-react";

const GithubIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

type ProjectType = {
  num: string;
  title: string;
  description: string;
  device: "mobile" | "laptop";
  github: string;
  live: string;
  tags: string[];
};

const projectsData: ProjectType[] = [
  {
    num: "01",
    title: "KL Code Editor",
    description:
      "A production-grade online code editor and assessment platform supporting multi-language compilation. Built for Kadel Labs with candidate management, test creation, and live code execution.",
    device: "laptop",
    github: "https://github.com/harshit075/KL-code_editor-production",
    live: "https://kl-code-editor-production.vercel.app",
    tags: ["TypeScript", "Next.js", "DevOps"],
  },
  {
    num: "02",
    title: "DevOps Project Tracker",
    description:
      "A comprehensive DevOps project management dashboard to track pipelines, deployments, and infrastructure tasks. A showcase of real-world DevOps workflow tooling.",
    device: "laptop",
    github: "https://github.com/harshit075/DevOps-Project-Tracker",
    live: "https://dev-ops-project-tracker-eight.vercel.app",
    tags: ["TypeScript", "React", "DevOps"],
  },
  {
    num: "03",
    title: "Jal Jeevan",
    description:
      "A TypeScript full-stack civic-tech application tracking water quality and rural water supply metrics across multiple zones. Built for community-level impact monitoring.",
    device: "mobile",
    github: "https://github.com/harshit075/jal_jeevan",
    live: "https://jal-jeevan-rd8wptuas-harshit-boranas-projects.vercel.app",
    tags: ["TypeScript", "Next.js", "Civic Tech"],
  },
  {
    num: "04",
    title: "Udaipur Eco Action Hub",
    description:
      "An environmental civic platform for tracking eco-initiatives, waste reduction goals, and community volunteering events across Udaipur.",
    device: "laptop",
    github: "https://github.com/harshit075/udaipur-eco-action-hub",
    live: "https://udaipur-eco-action-hub.vercel.app",
    tags: ["TypeScript", "React", "Environment"],
  },
];

export function Projects() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const yBg = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);

  return (
    <section ref={containerRef} className="relative w-full min-h-screen py-32 overflow-hidden bg-background">
      <motion.div
        className="absolute top-0 right-[-10%] text-[20vw] font-black text-black/[0.03] dark:text-white/[0.03] select-none whitespace-nowrap pointer-events-none tracking-tighter"
        style={{ y: yBg }}
      >
        プロジェクト
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 z-10 relative">
        <div className="flex flex-col mb-24">
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">
            Selected Works
          </h2>
          <span className="text-lg font-bold tracking-widest text-cyan uppercase opacity-80 mt-2">
            プロジェクト / Projects
          </span>
        </div>

        <div className="space-y-40">
          {projectsData.map((project, index) => {
            const isEven = index % 2 === 0;
            return (
              <ProjectCard key={project.num} project={project} isEven={isEven} />
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project, isEven }: { project: ProjectType; isEven: boolean }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["0 1", "1.2 1"],
  });

  const scaleProgress = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
  const opacityProgress = useTransform(scrollYProgress, [0, 1], [0.6, 1]);

  return (
    <motion.div
      ref={cardRef}
      style={{ scale: scaleProgress, opacity: opacityProgress }}
      className={`relative flex flex-col-reverse md:flex-row items-center gap-12 lg:gap-20 ${
        !isEven ? "md:flex-row-reverse" : ""
      }`}
    >
      <div className="flex-1 flex flex-col justify-center">
        <div className="flex flex-col gap-2 mb-6">
          <div className="flex items-baseline gap-4">
            <span className="text-6xl md:text-8xl font-black text-transparent [-webkit-text-stroke:2px_var(--foreground)] opacity-20">
              {project.num}
            </span>
            <h3 className="text-3xl md:text-5xl font-bold uppercase">{project.title}</h3>
          </div>
          <span className="text-sm font-bold tracking-widest text-cyan uppercase opacity-80">
            {project.device === "mobile" ? "モバイルアプリ / Mobile App" : "ウェブシステム / Web System"}
          </span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs font-bold uppercase tracking-widest px-3 py-1 border border-border-color text-text-muted"
            >
              {tag}
            </span>
          ))}
        </div>

        <p className="text-lg md:text-xl text-text-muted mb-8 leading-relaxed max-w-lg">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-4 mt-2">
          {/* GitHub Button */}
          <a
            href={project.github}
            target="_blank"
            rel="noreferrer"
            className="group relative flex items-center gap-3 px-6 py-3 border-2 border-foreground font-bold uppercase tracking-widest overflow-hidden transition-all hover:border-cyan hover:text-black hover:shadow-[0_0_20px_rgba(0,255,255,0.3)]"
          >
            <div className="absolute inset-0 bg-cyan transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-in-out z-0" />
            <GithubIcon className="w-4 h-4 relative z-10 group-hover:text-black transition-colors" />
            <span className="relative z-10 group-hover:text-black transition-colors">GitHub</span>
          </a>

          {/* Live Demo Button */}
          <a
            href={project.live}
            target="_blank"
            rel="noreferrer"
            className="group relative flex items-center gap-3 px-6 py-3 bg-foreground text-background font-bold uppercase tracking-widest overflow-hidden transition-all hover:shadow-[0_0_20px_rgba(0,255,255,0.3)]"
          >
            <div className="absolute inset-0 bg-cyan transform translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-in-out z-0" />
            <span className="relative z-10 group-hover:text-black transition-colors">Live Demo</span>
            <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 group-hover:text-black transition-all" />
          </a>
        </div>
      </div>

      <div className="flex-1 w-full flex items-center justify-center relative">
        <div className={`relative ${project.device === "mobile" ? "w-[240px] md:w-[300px] aspect-[9/19]" : "w-full aspect-[16/10]"}`}>
          <div className="absolute inset-0 border-2 border-border-color rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden bg-bg-secondary flex flex-col items-center justify-center gap-4 group hover:border-cyan/50 transition-colors duration-500 hover:shadow-[0_0_30px_rgba(0,255,255,0.1)]">
            <div className="absolute inset-0 bg-black/5 dark:bg-white/5" />
            {/* Simulated browser chrome for laptop */}
            {project.device === "laptop" && (
              <div className="absolute top-0 left-0 right-0 h-8 bg-border-color/30 flex items-center px-4 gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
              </div>
            )}
            {/* Simulated notch for mobile */}
            {project.device === "mobile" && (
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-16 h-4 rounded-full bg-border-color/50" />
            )}
            <span className="text-text-muted uppercase text-xs font-bold tracking-widest z-10 px-4 text-center group-hover:text-cyan transition-colors">
              {project.title}
            </span>
            <ExternalLink className="w-6 h-6 text-text-muted group-hover:text-cyan transition-colors z-10" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
