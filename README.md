# Alpha Kids — Zara AI Parenting Coach 🌟

> A warm, safe, bilingual (English/Urdu) AI parenting coach built with **Next.js 15**, **TypeScript**, **Tailwind CSS**, and the **OpenAI API** — submitted as a take-home assignment for Vibbber Tech / Alpha Kids.

---

## ✨ Features

- **Bilingual support** — English & Urdu, auto-detects and responds in the parent's language
- **Structured coaching replies** — acknowledgment → practical plan → check-in question
- **Crisis / emergency escalation** — detects abuse, self-harm, and medical emergencies; refuses to coach and surfaces emergency numbers (India, Pakistan, UAE/Gulf)
- **Safe guardrails** — no diagnosis, no medical or legal instructions
- **Kids-friendly UI/UX** — rounded cards, playful gradients, floating stars, Nunito font
- **Suggested prompts** — quick-start for first-time users
- **Conversation history** — in-session memory, no login or database needed
- **Fully responsive** — works on mobile, tablet, desktop

---

## 🚀 Quick Start

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/alpha-kids-coach.git
cd alpha-kids-coach
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure your OpenAI API key

```bash
cp .env.local.example .env.local
```

Then open `.env.local` and replace the placeholder:

```env
OPENAI_API_KEY=sk-...your-key-here...
```

> **Note:** The app uses `gpt-4o-mini` by default for cost-efficiency. You can change the model in `app/api/chat/route.ts`.

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for production

```bash
npm run build
npm start
```

---

## 🗂️ Project Structure

```
alpha-kids-coach/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts        # API route — system prompt + OpenAI call
│   ├── globals.css             # Global styles + Urdu RTL support
│   ├── layout.tsx              # Root layout + Nunito font
│   └── page.tsx                # Main chat page
├── components/
│   ├── ChatBubble.tsx          # Message bubbles (user & Zara, emergency styling)
│   ├── FloatingStars.tsx       # Decorative animated background
│   ├── SuggestedPrompts.tsx    # Quick-start prompt cards
│   └── TypingIndicator.tsx     # Animated typing indicator
├── public/
│   └── alpha-kids-logo.svg     # Brand logo (optional)
├── .env.local.example          # API key template
└── README.md
```

---

## 🛡️ Safety Design

| Scenario | Behavior |
|---|---|
| Everyday parenting concern | Warm acknowledgment → 2-4 practical steps → 1 check-in |
| Requests for medical diagnosis | Redirect to doctor, offer coaching scope |
| Requests for legal advice | Redirect to lawyer, offer coaching scope |
| **Emergency / crisis** (abuse, self-harm, medical) | **Refuses coaching**, shows emergency numbers for India/Pakistan/UAE |
| Urdu input | Responds in Urdu |

---

## 🤖 Note on AI-Assisted Development

This project was built with the assistance of **Antigravity (Google DeepMind)**, an agentic AI coding assistant. The AI helped scaffold the Next.js project, generate component structure, and draft the system prompt. All safety rules, escalation logic, UI/UX design decisions, and final review were human-directed and human-verified.

---

## 📝 Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Framework | Next.js 15 (App Router) | File-based routing, server components, API routes |
| Language | TypeScript | Type safety |
| Styling | Tailwind CSS v4 | Utility-first, rapid UI |
| Font | Nunito (Google Fonts) | Friendly, rounded — kid-friendly feel |
| AI | OpenAI GPT-4o-mini | Cost-efficient, fast, multilingual |
| Markdown | react-markdown | Render structured coach replies |

---

## 📄 License

MIT — built for the Alpha Kids take-home assignment.
