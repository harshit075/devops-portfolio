"use client";

import { useEffect, useState } from "react";

const ROWS = 7;
const COLS = 45;
const SNAKE_LENGTH = 7;

type Point = { r: number; c: number };

export function GithubSnake() {
  const [snake, setSnake] = useState<Point[]>([
    { r: 3, c: 5 },
    { r: 3, c: 4 },
    { r: 3, c: 3 },
    { r: 3, c: 2 },
    { r: 3, c: 1 },
  ]);
  const [foods, setFoods] = useState<Set<string>>(new Set());
  const [mounted, setMounted] = useState(false);

  // Initialize random foods
  useEffect(() => {
    setMounted(true);
    const initialFoods = new Set<string>();
    while (initialFoods.size < 40) {
      initialFoods.add(
        `${Math.floor(Math.random() * ROWS)},${Math.floor(Math.random() * COLS)}`
      );
    }
    setFoods(initialFoods);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const interval = setInterval(() => {
      setSnake((prevSnake) => {
        const head = prevSnake[0];
        let target: Point | null = null;
        let minDist = Infinity;

        // Find closest food
        foods.forEach((f) => {
          const [fr, fc] = f.split(",").map(Number);
          const dist = Math.abs(fr - head.r) + Math.abs(fc - head.c);
          if (dist < minDist) {
            minDist = dist;
            target = { r: fr, c: fc };
          }
        });

        // Determine possible moves (prevent 180 turns)
        const moves = [
          { r: 0, c: 1 },
          { r: 0, c: -1 },
          { r: 1, c: 0 },
          { r: -1, c: 0 },
        ].filter(
          (m) =>
            !(
              prevSnake.length > 1 &&
              head.r + m.r === prevSnake[1].r &&
              head.c + m.c === prevSnake[1].c
            )
        );

        if (target) {
          moves.sort((a, b) => {
            const distA =
              Math.abs(head.r + a.r - target!.r) +
              Math.abs(head.c + a.c - target!.c);
            const distB =
              Math.abs(head.r + b.r - target!.r) +
              Math.abs(head.c + b.c - target!.c);
            return distA - distB;
          });
        }

        let bestMove = moves[0];
        // Ensure we don't hit walls if possible
        for (const m of moves) {
          const nr = head.r + m.r;
          const nc = head.c + m.c;
          if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) {
            bestMove = m;
            break;
          }
        }

        const newHead = { r: head.r + bestMove.r, c: head.c + bestMove.c };

        // Handle wall wrapping
        if (newHead.r < 0) newHead.r = ROWS - 1;
        if (newHead.r >= ROWS) newHead.r = 0;
        if (newHead.c < 0) newHead.c = COLS - 1;
        if (newHead.c >= COLS) newHead.c = 0;

        const newSnake = [newHead, ...prevSnake];

        // Eat food
        const foodKey = `${newHead.r},${newHead.c}`;
        if (foods.has(foodKey)) {
          setFoods((prevFoods) => {
            const nextFoods = new Set(prevFoods);
            nextFoods.delete(foodKey);
            // Spawn new food
            let spawned = false;
            while (!spawned) {
              const nr = Math.floor(Math.random() * ROWS);
              const nc = Math.floor(Math.random() * COLS);
              const nk = `${nr},${nc}`;
              if (!nextFoods.has(nk)) {
                nextFoods.add(nk);
                spawned = true;
              }
            }
            return nextFoods;
          });
        } else {
          newSnake.pop(); // Keep fixed length if no food eaten
        }

        // Limit maximum length to simulate the "eating but staying a snake" effect
        if (newSnake.length > SNAKE_LENGTH) {
          newSnake.pop();
        }

        return newSnake;
      });
    }, 120);

    return () => clearInterval(interval);
  }, [foods, mounted]);

  if (!mounted) return null;

  return (
    <section className="w-full py-20 flex flex-col items-center bg-background border-t border-border-color overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 flex flex-col items-center">
        <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tighter mb-8 text-center text-foreground">
          Contributions <span className="text-cyan">/ 貢献</span>
        </h3>

        <div className="relative p-6 bg-bg-secondary rounded-xl border border-border-color shadow-lg overflow-x-auto max-w-full no-scrollbar">
          <div
            className="grid gap-[4px] md:gap-[6px]"
            style={{
              gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))`,
            }}
          >
            {Array.from({ length: ROWS }).map((_, r) =>
              Array.from({ length: COLS }).map((_, c) => {
                const isSnake = snake.some((p) => p.r === r && p.c === c);
                const isHead = snake[0].r === r && snake[0].c === c;
                const isFood = foods.has(`${r},${c}`);

                let bgClass = "bg-black/5 dark:bg-white/5"; // Empty cell

                if (isHead) bgClass = "bg-[#a855f7] dark:bg-[#c084fc] drop-shadow-[0_0_8px_rgba(168,85,247,0.8)] z-10 scale-110";
                else if (isSnake) bgClass = "bg-[#9333ea] dark:bg-[#a855f7]";
                else if (isFood) bgClass = "bg-[#22c55e] dark:bg-[#4ade80] drop-shadow-[0_0_4px_rgba(34,197,94,0.4)]";

                return (
                  <div
                    key={`${r}-${c}`}
                    className={`w-[12px] h-[12px] md:w-[14px] md:h-[14px] rounded-sm transition-all duration-300 ${bgClass}`}
                  />
                );
              })
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
