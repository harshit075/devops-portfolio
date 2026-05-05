import { Hero } from "@/components/Hero";
import { Projects } from "@/components/Projects";
import { About } from "@/components/About";
import { GithubSnake } from "@/components/GithubSnake";
import { Footer } from "@/components/Footer";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Contact } from "@/components/Contact";

export default function App() {
  return (
    <main className="flex flex-col min-h-screen selection:bg-cyan-500 selection:text-black font-sans">
      <ThemeToggle />
      <Hero />
      <Projects />
      <About />
      <GithubSnake />
      <Contact />
      <Footer />
    </main>
  );
}
