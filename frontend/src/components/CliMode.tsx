"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Terminal, X, Maximize2, Minus } from "lucide-react";

type Command = {
  text: string;
  output: React.ReactNode;
  dir: string;
};

export function CliMode({ onClose }: { onClose: () => void }) {
  const [history, setHistory] = useState<Command[]>([
    {
      text: "init",
      output: "Welcome to Harshit's Interactive Shell v1.0.0\nType 'help' to see available commands.",
      dir: "~"
    }
  ]);
  const [input, setInput] = useState("");
  const [currentDir, setCurrentDir] = useState("~");
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const fullCmd = input.trim().toLowerCase();
    const cmdArgs = fullCmd.split(" ");
    const cmd = cmdArgs[0];
    
    if (!cmd) return;

    // Play "Enter" key sound
    playMechanicalClick(0.3);

    let output: React.ReactNode = "";
    let nextDir = currentDir;

    switch (cmd) {
      case "help":
        output = (
          <div className="flex flex-col gap-1 text-[#8b949e]">
            <span><strong className="text-[#58a6ff]">ls</strong>          - List directory contents</span>
            <span><strong className="text-[#58a6ff]">cd [dir]</strong>    - Change directory</span>
            <span><strong className="text-[#58a6ff]">cat [file]</strong>  - Read a file</span>
            <span><strong className="text-[#58a6ff]">pwd</strong>         - Print working directory</span>
            <span><strong className="text-[#58a6ff]">ping harshit</strong>  - Open connection (Contact)</span>
            <span><strong className="text-[#58a6ff]">whoami</strong>      - Display current user</span>
            <span><strong className="text-[#58a6ff]">clear</strong>       - Clear terminal output</span>
            <span><strong className="text-[#58a6ff]">exit</strong>        - Close CLI mode</span>
          </div>
        );
        break;
      case "pwd":
        output = `/home/guest/${currentDir.replace("~", "")}`;
        break;
      case "cd":
        const target = cmdArgs[1] || "~";
        if (target === "~" || target === "/") {
          nextDir = "~";
        } else if (target === ".." || target === "../") {
          nextDir = "~";
        } else if (target === "projects" || target === "projects/") {
          nextDir = "~/projects";
        } else if (target === "skills" || target === "skills/") {
          nextDir = "~/skills";
        } else {
          output = `bash: cd: ${target}: No such file or directory`;
        }
        break;
      case "ls":
        if (currentDir === "~") {
          output = (
            <div className="flex gap-4 text-[#3fb950]">
              <span className="font-bold text-[#58a6ff]">projects/</span>
              <span className="font-bold text-[#58a6ff]">skills/</span>
              <span>about.txt</span>
              <span>resume.pdf</span>
            </div>
          );
        } else if (currentDir === "~/projects") {
          output = (
            <div className="flex gap-4 text-[#3fb950]">
              <span>kl-code-editor.yaml</span>
              <span>devops-tracker.tf</span>
              <span>jal-jeevan.dockerfile</span>
            </div>
          );
        } else if (currentDir === "~/skills") {
          output = (
            <div className="flex gap-4 text-[#3fb950]">
              <span>docker.sh</span>
              <span>kubernetes.yml</span>
              <span>aws.config</span>
              <span>terraform.tfstate</span>
            </div>
          );
        }
        break;
      case "cat":
        const file = cmdArgs[1];
        if (!file) {
          output = "cat: missing file operand";
        } else if (file === "about.txt" && currentDir === "~") {
          output = "Hi, I'm Harshit. A DevOps Engineer focused on scalable infrastructure, CI/CD, and robust cloud architectures. I love fixing what's broken and automating what's boring.";
        } else if (file === "resume.pdf" && currentDir === "~") {
          output = "Downloading resume... (Please click the Download button in the About section!)";
        } else {
          output = `cat: ${file}: No such file or directory`;
        }
        break;
      case "ping":
        if (cmdArgs[1] === "harshit") {
          output = "Pinging harshitborana2@gmail.com with 32 bytes of data...\nReply from Harshit: Ready to work!\n(Hint: Scroll down to the contact section to send an email!)";
        } else {
          output = `ping: unknown host ${cmdArgs[1]}`;
        }
        break;
      case "whoami":
        output = "guest_visitor_" + Math.floor(Math.random() * 1000);
        break;
      case "sudo":
        if (cmdArgs[1] === "hire" && cmdArgs[2] === "harshit") {
          output = "Access Granted. Initializing onboarding sequence... (Please reach out via LinkedIn or Email!)";
        } else {
          output = `bash: sudo: ${cmdArgs.slice(1).join(" ")}: command not found`;
        }
        break;
      case "clear":
        setHistory([]);
        setInput("");
        setCurrentDir(nextDir);
        return;
      case "exit":
        onClose();
        return;
      default:
        output = "bash: " + cmd + ": command not found";
    }

    setHistory(prev => [...prev, { text: fullCmd, output, dir: currentDir }]);
    setInput("");
    setCurrentDir(nextDir);
  };

  const playMechanicalClick = (volume = 0.1) => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      if (!audioCtx) return;
      
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      osc.type = "square";
      // Randomize pitch slightly for realism
      osc.frequency.setValueAtTime(150 + Math.random() * 50, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + 0.05);
      
      gainNode.gain.setValueAtTime(volume, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.05);
      
      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      osc.start();
      osc.stop(audioCtx.currentTime + 0.05);
    } catch (e) {
      // Ignore audio errors (e.g. autoplay restrictions)
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    playMechanicalClick();
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm p-4 md:p-10 flex items-center justify-center font-mono"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-4xl h-full max-h-[70vh] bg-[#0d1117] border border-[#30363d] rounded-xl shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Terminal Header */}
        <div className="h-10 bg-[#161b22] border-b border-[#30363d] flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-[#8b949e]" />
            <span className="text-[#8b949e] text-xs font-bold tracking-widest">harshit@devops-portfolio:{currentDir}</span>
          </div>
          <div className="flex gap-2">
            <button className="w-3 h-3 rounded-full bg-[#ff5f56] hover:opacity-80 flex items-center justify-center group" onClick={onClose}>
              <X className="w-2 h-2 opacity-0 group-hover:opacity-100 text-black" />
            </button>
            <button className="w-3 h-3 rounded-full bg-[#ffbd2e] hover:opacity-80 flex items-center justify-center group">
              <Minus className="w-2 h-2 opacity-0 group-hover:opacity-100 text-black" />
            </button>
            <button className="w-3 h-3 rounded-full bg-[#27c93f] hover:opacity-80 flex items-center justify-center group">
              <Maximize2 className="w-2 h-2 opacity-0 group-hover:opacity-100 text-black" />
            </button>
          </div>
        </div>

        {/* Terminal Body */}
        <div 
          ref={scrollRef}
          className="flex-1 p-4 overflow-y-auto bg-[#0d1117] text-[#c9d1d9] text-sm flex flex-col gap-2"
          onClick={() => inputRef.current?.focus()}
        >
          {history.map((cmd, i) => (
            <div key={i} className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-[#58a6ff]">
                <span className="text-[#3fb950]">guest@portfolio</span>
                <span className="text-white">:</span>
                <span className="text-[#58a6ff]">{cmd.dir}</span>
                <span className="text-white">$</span>
                <span className="text-[#c9d1d9]">{cmd.text}</span>
              </div>
              {cmd.output && <div className="whitespace-pre-wrap">{cmd.output}</div>}
            </div>
          ))}
          
          <form onSubmit={handleCommand} className="flex items-center gap-2 text-[#58a6ff] mt-2">
            <span className="text-[#3fb950]">guest@portfolio</span>
            <span className="text-white">:</span>
            <span className="text-[#58a6ff]">{currentDir}</span>
            <span className="text-white">$</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={handleInputChange}
              className="flex-1 bg-transparent border-none outline-none text-[#c9d1d9] caret-white"
              autoFocus
              autoComplete="off"
              spellCheck="false"
            />
          </form>
        </div>
      </div>
    </motion.div>
  );
}
