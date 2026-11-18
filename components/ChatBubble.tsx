"use client";

import ReactMarkdown from "react-markdown";
import { Message } from "@/app/api/chat/route";
import { useState, useEffect } from "react";

interface Props {
  message: Message;
  index: number;
}

const isEmergency = (text: string) =>
  text.includes("🚨") || text.toLowerCase().includes("emergency services");

export default function ChatBubble({ message, index }: Props) {
  const isUser = message.role === "user";
  const emergency = !isUser && isEmergency(message.content);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  if (isUser) {
    return (
      <div
        className={`flex justify-end transition-all duration-300 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
        }`}
        style={{ transitionDelay: `${Math.min(index * 30, 150)}ms` }}
      >
        <div className="max-w-[80%] bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-3xl rounded-tr-sm px-5 py-3 shadow-md shadow-purple-100">
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex gap-3 transition-all duration-300 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
      }`}
      style={{ transitionDelay: `${Math.min(index * 30, 150)}ms` }}
    >
      {/* Avatar */}
      <div className="flex-shrink-0 w-9 h-9 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-400 flex items-center justify-center shadow-md shadow-purple-100 mt-1">
        <span className="text-lg">🌟</span>
      </div>

      <div
        className={`max-w-[85%] rounded-3xl rounded-tl-sm px-5 py-4 shadow-sm ${
          emergency
            ? "bg-red-50 border-2 border-red-300 shadow-red-100"
            : "bg-white border border-purple-100 shadow-purple-50"
        }`}
      >
        <div
          className={`text-sm leading-relaxed prose prose-sm max-w-none ${
            emergency ? "prose-red" : "prose-purple"
          }`}
        >
          <ReactMarkdown
            components={{
              p: ({ children }) => <p className="mb-2 last:mb-0 text-gray-700">{children}</p>,
              strong: ({ children }) => (
                <strong className={`font-semibold ${emergency ? "text-red-700" : "text-purple-700"}`}>
                  {children}
                </strong>
              ),
              ul: ({ children }) => (
                <ul className="list-none space-y-1.5 my-2 pl-0">{children}</ul>
              ),
              li: ({ children }) => (
                <li className="flex gap-2 items-start text-gray-700">
                  <span className={`mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0 ${emergency ? "bg-red-400" : "bg-purple-400"}`} />
                  <span>{children}</span>
                </li>
              ),
              hr: () => <hr className="border-purple-100 my-3" />,
              h2: ({ children }) => (
                <h2 className="font-bold text-gray-800 text-sm mt-3 mb-1">{children}</h2>
              ),
              h3: ({ children }) => (
                <h3 className="font-semibold text-gray-700 text-sm mt-2 mb-1">{children}</h3>
              ),
              a: ({ href, children }) => (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-600 underline hover:text-purple-800"
                >
                  {children}
                </a>
              ),
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>

        {emergency && (
          <div className="mt-3 pt-3 border-t border-red-200 flex items-center gap-2 text-xs text-red-600 font-medium">
            <span>🤝</span>
            <span>Human coaches are available via Alpha Kids — please reach out through the app</span>
          </div>
        )}
      </div>
    </div>
  );
}
