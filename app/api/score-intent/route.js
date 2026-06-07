import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req) {
  try {
    const { replyText, prospectName, prospectTitle } = await req.json();

    const chat = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages: [
        {
          role: "system",
          content: `You are a sales AI that scores the buying intent of a reply to a cold outreach email.

Given the reply text, return JSON: 
{ 
  "score": "hot" | "warm" | "cold",
  "confidence": 0-100,
  "summary": "one sentence explaining the score",
  "suggestedReply": "a short, natural follow-up reply to keep the conversation going"
}

hot = ready to buy, asking for a demo/call/pricing
warm = curious, asking questions, not dismissive
cold = unsubscribe, not interested, wrong person, out of office

Return ONLY valid JSON.`,
        },
        {
          role: "user",
          content: `Reply from ${prospectName} (${prospectTitle}):\n\n"${replyText}"`,
        },
      ],
      temperature: 0.3,
      max_tokens: 300,
    });

    const raw = chat.choices[0]?.message?.content?.trim();
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No valid JSON");

    return NextResponse.json(JSON.parse(jsonMatch[0]));
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
