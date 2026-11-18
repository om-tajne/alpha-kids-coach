"use client";

import { useEffect, useState } from "react";

const STARS = [
  { emoji: "⭐", size: "text-2xl", x: 5, y: 10, delay: 0, duration: 6 },
  { emoji: "✨", size: "text-lg", x: 90, y: 15, delay: 1.5, duration: 7 },
  { emoji: "🌸", size: "text-xl", x: 15, y: 80, delay: 0.8, duration: 8 },
  { emoji: "🦋", size: "text-2xl", x: 85, y: 70, delay: 2, duration: 9 },
  { emoji: "⭐", size: "text-sm", x: 50, y: 5, delay: 3, duration: 5 },
  { emoji: "✨", size: "text-2xl", x: 70, y: 85, delay: 0.5, duration: 7.5 },
  { emoji: "🌈", size: "text-lg", x: 3, y: 50, delay: 1.2, duration: 8.5 },
  { emoji: "💫", size: "text-xl", x: 95, y: 40, delay: 2.5, duration: 6.5 },
];

export default function FloatingStars() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden>
      {STARS.map((star, i) => (
        <div
          key={i}
          className={`absolute ${star.size} opacity-20 select-none`}
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            animation: `floatStar ${star.duration}s ease-in-out ${star.delay}s infinite alternate`,
          }}
        >
          {star.emoji}
        </div>
      ))}
      <style>{`
        @keyframes floatStar {
          0% { transform: translateY(0px) rotate(0deg); }
          100% { transform: translateY(-18px) rotate(10deg); }
        }
      `}</style>
    </div>
  );
}
