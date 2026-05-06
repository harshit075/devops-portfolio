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

export default function App() {
  const [isPipelineComplete, setIsPipelineComplete] = useState(false);

  return (
    <main className="flex flex-col min-h-screen selection:bg-cyan-500 selection:text-black font-sans bg-background relative">
      <AnimatePresence>
        {!isPipelineComplete && (
          <PipelineLoader onComplete={() => setIsPipelineComplete(true)} />
        )}
      </AnimatePresence>

      <Navbar />
      <div className="flex flex-col w-full pb-24 md:pb-0 transition-all duration-300">
        <ThemeToggle />
        <LiveMetrics />
        <Hero />
        <Projects />
        <About />
        <Skills />
        <GithubSnake />
        <Contact />
        <Footer />
      </div>
    </main>
  );
}
