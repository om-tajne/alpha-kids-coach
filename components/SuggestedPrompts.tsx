"use client";

interface Props {
  onSelect: (prompt: string) => void;
}

const PROMPTS = [
  { emoji: "😴", label: "Sleep trouble", text: "My 2-year-old won't sleep through the night. What can I do?" },
  { emoji: "🍽️", label: "Picky eater", text: "My 4-year-old refuses to eat vegetables. Any tips?" },
  { emoji: "😤", label: "Tantrums", text: "My toddler has intense tantrums every day. How do I handle them calmly?" },
  { emoji: "📱", label: "Screen time", text: "My 7-year-old is addicted to YouTube. How much screen time is okay?" },
  { emoji: "🏫", label: "School anxiety", text: "میرا بچہ اسکول جانے سے ڈرتا ہے۔ کیا کروں؟" },
  { emoji: "😢", label: "Separation anxiety", text: "My baby cries every time I leave the room. Is this normal?" },
];

export default function SuggestedPrompts({ onSelect }: Props) {
  return (
    <div className="mt-8">
      <p className="text-center text-xs font-medium text-gray-400 mb-3 uppercase tracking-wide">
        Common questions to get started
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {PROMPTS.map((p) => (
          <button
            key={p.label}
            onClick={() => onSelect(p.text)}
            className="group bg-white hover:bg-purple-50 border border-purple-100 hover:border-purple-300 rounded-2xl px-3 py-3 text-left transition-all hover:shadow-md hover:shadow-purple-100 hover:-translate-y-0.5 active:translate-y-0"
          >
            <span className="text-xl block mb-1">{p.emoji}</span>
            <span className="text-xs font-semibold text-gray-700 group-hover:text-purple-700 leading-snug block">
              {p.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
