import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req) {
  try {
    const { prospect, channel = "email", tone = "professional" } = await req.json();

    const systemPrompt = `You are an expert B2B sales copywriter. Write a highly personalized cold outreach message for the given prospect.

Rules:
- Channel: ${channel} (${channel === "email" ? "write a subject line + body" : "write a LinkedIn connection request message, max 300 chars"})
- Tone: ${tone}
- Use the prospect's hooks/personalization data naturally
- Don't be generic — reference their specific company, role, or context
- Be concise and value-focused, not salesy
- End with a soft, specific CTA (a question or specific ask)
- DO NOT use placeholders like [Your Name] — write it as if from a real rep

${channel === "email" ? `Return JSON: { "subject": "...", "body": "..." }` : `Return JSON: { "message": "..." }`}
Return ONLY valid JSON, no markdown.`;

    const userMsg = `Prospect:
Name: ${prospect.name}
Title: ${prospect.title}
Company: ${prospect.company}
Industry: ${prospect.industry}
Location: ${prospect.location}
Company Size: ${prospect.companySize}
Tech Stack: ${prospect.techStack?.join(", ")}
Personalization hooks: ${prospect.hooks?.join("; ")}
Pain points: ${prospect.painPoints?.join("; ")}

Write a personalized ${channel} outreach message.`;

    const chat = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMsg },
      ],
      temperature: 0.8,
      max_tokens: 600,
    });

    const raw = chat.choices[0]?.message?.content?.trim();
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No valid JSON in response");

    const result = JSON.parse(jsonMatch[0]);
    return NextResponse.json(result);
  } catch (err) {
    console.error("generate-message error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
