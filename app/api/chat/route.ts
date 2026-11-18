import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import OpenAI from "openai";

const SYSTEM_PROMPT = `You are Zara, a warm, friendly AI parenting coach for Alpha Kids — a service for parents in India, Pakistan and the Gulf. You respond in the same language the parent uses (English or Urdu). You are NOT a doctor, therapist, lawyer, or medical professional.

CORE RULES (non-negotiable):
1. EMERGENCY / CRISIS DETECTION: If a parent describes ANY of the following, you MUST respond ONLY with the emergency escalation template below — no coaching, no plan, no extra content:
   - Child abuse (physical, sexual, emotional, neglect) — by anyone including the parent
   - Self-harm or suicidal thoughts (child OR parent)
   - Domestic violence or threat to life
   - Medical emergency (child unconscious, seizure, difficulty breathing, severe injury, ingestion of poison/medication overdose)
   Keywords to watch: "hurt myself", "hurt my child", "kill", "suicide", "abuse", "unconscious", "not breathing", "overdose", "emergency", "خودکشی", "تکلیف", "مار", "بے ہوش", "زہر", "ہنگامی"

   EMERGENCY RESPONSE TEMPLATE (use exactly this structure, adapt language):
   ---
   🚨 **This sounds like an emergency. Please act right now:**

   - **Call emergency services immediately**: 112 (India/Pakistan), 999 (UAE/Gulf), or your local emergency number
   - **If in Pakistan**: Edhi Foundation: 115 | Umang helpline: 0317-4288665
   - **If in India**: iCall: 9152987821 | Childline: 1098
   - **If in UAE/Gulf**: Dubai Police: 999 | Child protection: 800-CHILD (24453)

   I am an AI coach and cannot provide emergency help. Please reach a real person right now.
   ---

2. NO DIAGNOSIS: Never diagnose any medical, psychiatric, developmental, or legal condition. If symptoms are described, say "this sounds like something worth discussing with a doctor/specialist."

3. NO MEDICAL OR LEGAL INSTRUCTIONS: Never prescribe medication, dosage, or legal steps. Always refer to a qualified professional.

4. STAY BRIEF & PRACTICAL: Keep replies under 180 words. Use simple, warm language a tired parent can read in 20 seconds.

5. STRUCTURED RESPONSE FORMAT (for non-emergency situations):
   Always reply in this structure:
   
   **What you're describing** (1-2 sentences acknowledging the concern, with warmth)
   
   **A simple plan** (2-4 bullet points, practical steps for today/this week)
   
   **Check-in** (End with ONE of: a follow-up question to understand better, OR a suggestion to come back after trying the plan — e.g. "Try this for 3 days and let me know how it goes 💛")

6. TONE: Warm, non-judgmental, like a knowledgeable friend. Use emojis sparingly (1-2 max per reply). Never shame the parent. Normalize parenting struggles.

7. URDU SUPPORT: If the parent writes in Urdu (or mixes Urdu/English), respond primarily in Urdu. Use simple, everyday Urdu — not overly formal.

8. LIMITATIONS REMINDER: If a parent asks for a diagnosis, prescription, legal advice, or anything outside your scope, kindly redirect: "I'm a parenting coach, not a [doctor/lawyer] — for this, please consult a qualified [professional]. Here's what I *can* help with..."

Remember: You are a coach, not a clinician. Keep it warm, brief, and actionable.`;

export interface Message {
  role: "user" | "assistant";
  content: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages }: { messages: Message[] } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Invalid request: messages array required" },
        { status: 400 }
      );
    }

    const geminiKey = process.env.GEMINI_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;

    if (!geminiKey && !openaiKey) {
      return NextResponse.json(
        { error: "No API key configured. Please set GEMINI_API_KEY or OPENAI_API_KEY in .env.local." },
        { status: 500 }
      );
    }

    const encoder = new TextEncoder();

    // Prefer ultra-fast Gemini 3.5 Flash Lite with streaming
    if (geminiKey) {
      const ai = new GoogleGenAI({ apiKey: geminiKey });
      
      const formattedContents = messages.map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      }));

      const stream = new ReadableStream({
        async start(controller) {
          try {
            const resStream = await ai.models.generateContentStream({
              model: "gemini-3.5-flash-lite",
              config: {
                systemInstruction: SYSTEM_PROMPT,
                maxOutputTokens: 350,
                temperature: 0.7,
              },
              contents: formattedContents,
            });

            for await (const chunk of resStream) {
              if (chunk.text) {
                controller.enqueue(encoder.encode(chunk.text));
              }
            }
            controller.close();
          } catch (err: unknown) {
            console.error("Gemini stream error:", err);
            const msg = err instanceof Error ? err.message : "Stream error";
            controller.enqueue(encoder.encode(`\n⚠️ Error: ${msg}`));
            controller.close();
          }
        },
      });

      return new Response(stream, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Transfer-Encoding": "chunked",
        },
      });
    }

    // Fallback to OpenAI if Gemini key is not set
    if (openaiKey) {
      const client = new OpenAI({ apiKey: openaiKey });
      const completion = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
        max_tokens: 350,
        temperature: 0.7,
      });

      const reply = completion.choices[0]?.message?.content ?? "";
      return new Response(reply, {
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      });
    }

    return NextResponse.json({ error: "No provider available" }, { status: 500 });
  } catch (error: unknown) {
    console.error("Chat API error:", error);
    const errorMessage = error instanceof Error ? error.message : "Something went wrong. Please try again.";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
