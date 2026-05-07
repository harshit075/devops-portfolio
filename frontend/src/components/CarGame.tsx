import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX, Trophy, AlertTriangle } from 'lucide-react';

const LANE_WIDTH = 60;
const CAR_WIDTH = 40;
const CAR_HEIGHT = 70;
const ROAD_HEIGHT = 400;
const LANES = 3;

// Web Audio API context
let audioCtx: AudioContext | null = null;
let engineOscillator: OscillatorNode | null = null;
let engineGain: GainNode | null = null;

export function CarGame() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [playerLane, setPlayerLane] = useState(1); // 0, 1, 2
  const [obstacles, setObstacles] = useState<{ id: number; lane: number; y: number; text: string }[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  const gameLoopRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);
  const obstacleTimerRef = useRef<number>(0);
  const obstacleIdCounter = useRef(0);
  
  // Physics state (to avoid dependency cycles)
  const physicsState = useRef({
    score: 0,
    playerLane: 1,
    obstacles: [] as { id: number; lane: number; y: number; text: string }[]
  });

  const BAD_COMMANDS = ['rm -rf /', 'chmod 000', 'kill -9', 'OOM', '502 Error', 'Kernel Panic', 'Drop Table', 'Fork Bomb'];

  // Sync React state to Physics state
  useEffect(() => {
    physicsState.current.playerLane = playerLane;
  }, [playerLane]);

  // Initialize audio
  const initAudio = () => {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  };

  // Engine sound
  const startEngineSound = useCallback(() => {
    if (!soundEnabled || !audioCtx) return;
    if (engineOscillator) engineOscillator.stop();
    
    engineOscillator = audioCtx.createOscillator();
    engineGain = audioCtx.createGain();
    
    engineOscillator.type = 'triangle';
    engineOscillator.frequency.value = 60;
    engineGain.gain.value = 0.1;
    
    engineOscillator.connect(engineGain);
    engineGain.connect(audioCtx.destination);
    engineOscillator.start();
  }, [soundEnabled]);

  const stopEngineSound = () => {
    if (engineOscillator) {
      try { engineOscillator.stop(); } catch(e) {}
      engineOscillator = null;
    }
  };

  const playCrashSound = () => {
    if (!soundEnabled || !audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + 0.5);
    
    gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.5);
  };

  const playScoreSound = () => {
    if (!soundEnabled || !audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(600, audioCtx.currentTime + 0.1);
    
    gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.1);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.1);
  };

  const startGame = () => {
    initAudio();
    setIsPlaying(true);
    setIsGameOver(false);
    setScore(0);
    setPlayerLane(1);
    setObstacles([]);
    physicsState.current = { score: 0, playerLane: 1, obstacles: [] };
    obstacleIdCounter.current = 0;
    obstacleTimerRef.current = 0;
    lastTimeRef.current = performance.now();
    startEngineSound();
  };

  const stopGame = useCallback(() => {
    setIsPlaying(false);
    setIsGameOver(true);
    stopEngineSound();
    playCrashSound();
    if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
  }, []);

  // Controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying) return;
      if (e.key === 'ArrowLeft') {
        setPlayerLane(prev => Math.max(0, prev - 1));
      } else if (e.key === 'ArrowRight') {
        setPlayerLane(prev => Math.min(LANES - 1, prev + 1));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying]);

  // Game loop (physics & rendering logic)
  useEffect(() => {
    if (!isPlaying) return;

    const loop = (time: number) => {
      const dt = (time - lastTimeRef.current) / 1000;
      lastTimeRef.current = time;

      // Update Score
      physicsState.current.score += dt * 20; // 20 points per second
      
      const currentScore = Math.floor(physicsState.current.score);
      const prevScore = Math.floor(physicsState.current.score - dt * 20);
      
      if (currentScore > 0 && currentScore % 100 === 0 && currentScore !== prevScore) {
        playScoreSound();
      }

      const speed = 300 + Math.min(physicsState.current.score, 500);

      // Move obstacles
      let newObstacles = physicsState.current.obstacles.map(obs => ({
        ...obs,
        y: obs.y + speed * dt
      })).filter(obs => obs.y < ROAD_HEIGHT + 100);

      // Collision detection
      const playerY = ROAD_HEIGHT - CAR_HEIGHT - 20;
      const currentLane = physicsState.current.playerLane;
      
      let crashed = false;
      for (const obs of newObstacles) {
        if (
          obs.lane === currentLane &&
          obs.y + CAR_HEIGHT > playerY &&
          obs.y < playerY + CAR_HEIGHT
        ) {
          crashed = true;
          break;
        }
      }

      if (crashed) {
        stopGame();
        return;
      }

      // Spawn new obstacles
      obstacleTimerRef.current += dt;
      const spawnInterval = Math.max(0.4, 1.2 - physicsState.current.score / 1500);
      
      if (obstacleTimerRef.current > spawnInterval) {
        obstacleTimerRef.current = 0;
        const randomLane = Math.floor(Math.random() * LANES);
        const text = BAD_COMMANDS[Math.floor(Math.random() * BAD_COMMANDS.length)];
        newObstacles.push({ id: obstacleIdCounter.current++, lane: randomLane, y: -CAR_HEIGHT, text });
      }

      // Sync refs to React State for rendering (only occasionally to save frames, or every frame)
      physicsState.current.obstacles = newObstacles;
      
      setScore(currentScore);
      setObstacles([...newObstacles]);

      if (engineOscillator) {
        engineOscillator.frequency.setTargetAtTime(60 + currentScore / 20, audioCtx!.currentTime, 0.1);
      }

      gameLoopRef.current = requestAnimationFrame(loop);
    };

    gameLoopRef.current = requestAnimationFrame(loop);
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [isPlaying, stopGame]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopEngineSound();
      if (audioCtx) {
        audioCtx.close();
        audioCtx = null;
      }
    };
  }, []);

  // Update engine sound pitch based on speed/score
  useEffect(() => {
    if (engineOscillator && isPlaying) {
      engineOscillator.frequency.setTargetAtTime(60 + score / 20, audioCtx!.currentTime, 0.1);
    }
  }, [score, isPlaying]);

  return (
    <section className="w-full py-16 bg-background border-t border-border-color flex flex-col items-center">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-black uppercase tracking-tighter flex items-center justify-center gap-3">
          <Trophy className="w-6 h-6 text-cyan" /> 
          Terminal Racer
        </h2>
        <p className="text-sm text-text-muted mt-2 tracking-widest uppercase">Dodge the traffic. Survive.</p>
      </div>

      <div className="relative flex flex-col items-center select-none">
        
        {/* Top UI */}
        <div className="w-[300px] flex justify-between items-center mb-4 px-2">
          <div className="font-mono text-xl text-cyan font-bold">SCORE: {score}</div>
          <button 
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="text-text-muted hover:text-cyan transition-colors"
          >
            {soundEnabled ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
          </button>
        </div>

        {/* Game Container */}
        <div 
          className="relative bg-[#111] border-2 border-cyan overflow-hidden shadow-[0_0_30px_rgba(0,255,255,0.1)]"
          style={{ width: LANE_WIDTH * LANES + 20, height: ROAD_HEIGHT }}
        >
          {/* Road markings */}
          <div className="absolute inset-0 flex justify-evenly pointer-events-none opacity-20">
            <div className="w-0.5 h-full border-l border-dashed border-white opacity-50" />
            <div className="w-0.5 h-full border-l border-dashed border-white opacity-50" />
          </div>

          {/* Player Car */}
          <motion.div
            className="absolute bottom-[20px] bg-cyan border border-white flex items-center justify-center shadow-[0_0_15px_rgba(0,255,255,0.5)] z-20"
            style={{ 
              width: CAR_WIDTH, 
              height: CAR_HEIGHT,
              borderRadius: "4px 4px 2px 2px",
            }}
            animate={{ x: 10 + playerLane * LANE_WIDTH + (LANE_WIDTH - CAR_WIDTH) / 2 }}
            transition={{ type: "spring", stiffness: 500, damping: 25 }}
          >
            <div className="w-full h-full relative">
              <div className="absolute top-2 left-1 right-1 h-3 bg-black/40 rounded-sm" />
              <div className="absolute bottom-4 left-1 right-1 h-6 bg-black/40 rounded-sm" />
            </div>
          </motion.div>

          {/* Obstacles */}
          {obstacles.map(obs => (
            <div
              key={obs.id}
              className="absolute bg-red-600 border border-red-400 shadow-[0_0_15px_rgba(255,0,0,0.6)] flex items-center justify-center z-10"
              style={{
                width: CAR_WIDTH,
                height: CAR_HEIGHT,
                left: 10 + obs.lane * LANE_WIDTH + (LANE_WIDTH - CAR_WIDTH) / 2,
                top: obs.y,
                borderRadius: "4px 4px 2px 2px",
              }}
            >
               <div className="w-full h-full relative opacity-50">
                 <div className="absolute top-2 left-1 right-1 h-3 bg-black/60 rounded-sm" />
                 <div className="absolute bottom-4 left-1 right-1 h-6 bg-black/60 rounded-sm" />
               </div>
               <span className="absolute text-white font-mono font-bold text-[10px] leading-none whitespace-nowrap -rotate-90 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] pointer-events-none">
                 {obs.text}
               </span>
            </div>
          ))}

          {/* Overlays */}
          {!isPlaying && !isGameOver && (
            <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-10 backdrop-blur-sm">
              <button 
                onClick={startGame}
                className="px-6 py-3 border-2 border-cyan text-cyan font-bold uppercase tracking-widest hover:bg-cyan hover:text-black transition-all shadow-[0_0_20px_rgba(0,255,255,0.3)]"
              >
                Start Engine
              </button>
              <p className="text-xs text-text-muted mt-4 uppercase">Use ← and → arrows to steer</p>
            </div>
          )}

          {isGameOver && (
            <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-10 backdrop-blur-md">
              <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
              <h3 className="text-2xl font-black uppercase text-red-500 tracking-widest mb-2">CRASHED</h3>
              <p className="font-mono text-xl mb-6">Final Score: {score}</p>
              <button 
                onClick={startGame}
                className="px-6 py-3 border-2 border-cyan text-cyan font-bold uppercase tracking-widest hover:bg-cyan hover:text-black transition-all shadow-[0_0_20px_rgba(0,255,255,0.3)]"
              >
                Play Again
              </button>
            </div>
          )}
        </div>
        
        {/* Mobile controls */}
        <div className="flex gap-4 mt-8 md:hidden">
          <button 
            className="w-16 h-16 bg-bg-secondary border border-cyan flex items-center justify-center active:bg-cyan active:text-black transition-colors rounded-lg"
            onClick={() => isPlaying && playerLane > 0 && setPlayerLane(prev => prev - 1)}
          >
            <span className="text-2xl">←</span>
          </button>
          <button 
            className="w-16 h-16 bg-bg-secondary border border-cyan flex items-center justify-center active:bg-cyan active:text-black transition-colors rounded-lg"
            onClick={() => isPlaying && playerLane < LANES - 1 && setPlayerLane(prev => prev + 1)}
          >
            <span className="text-2xl">→</span>
          </button>
        </div>
      </div>
    </section>
  );
}
