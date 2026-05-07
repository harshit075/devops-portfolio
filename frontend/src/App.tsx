import { Hero } from "@/components/Hero";
import { Projects } from "@/components/Projects";
import { About } from "@/components/About";
import { Skills } from "@/components/Skills";
import { GithubSnake } from "@/components/GithubSnake";
import { Footer } from "@/components/Footer";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Contact } from "@/components/Contact";
import { Navbar } from "@/components/Navbar";
import { LiveMetrics } from "@/components/LiveMetrics";
import { PipelineLoader } from "@/components/PipelineLoader";
import { CarGame } from "@/components/CarGame";
import { StatusPage } from "@/components/StatusPage";
import { ExperienceTimeline } from "@/components/ExperienceTimeline";
import { CliMode } from "@/components/CliMode";

export default function App() {
  const [isPipelineComplete, setIsPipelineComplete] = useState(false);
  const [isCliMode, setIsCliMode] = useState(false);

  return (
    <main className="flex flex-col min-h-screen selection:bg-cyan-500 selection:text-black font-sans bg-background relative">
      <AnimatePresence>
        {!isPipelineComplete && (
          <PipelineLoader onComplete={() => setIsPipelineComplete(true)} />
        )}
        {isCliMode && (
          <CliMode onClose={() => setIsCliMode(false)} />
        )}
      </AnimatePresence>

      <Navbar onOpenCli={() => setIsCliMode(true)} />
      <div className="flex flex-col w-full pb-24 md:pb-0 transition-all duration-300">
        <ThemeToggle />
        <LiveMetrics />
        <Hero />
        <Projects />
        <About />
        <ExperienceTimeline />
        <Skills />
        <GithubSnake />
        <Contact />
        <StatusPage />
        <CarGame />
        <Footer />
      </div>
    </main>
  );
}
