"use client";

export default function TypingIndicator() {
  return (
    <div className="flex gap-3 items-end">
      <div className="flex-shrink-0 w-9 h-9 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-400 flex items-center justify-center shadow-md shadow-purple-100">
        <span className="text-lg">🌟</span>
      </div>
      <div className="bg-white border border-purple-100 rounded-3xl rounded-tl-sm px-5 py-4 shadow-sm flex items-center gap-1.5">
        <span className="text-xs text-gray-400 mr-1">Zara is thinking</span>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
            style={{ animationDelay: `${i * 150}ms` }}
          />
        ))}
      </div>
    </div>
  );
}
