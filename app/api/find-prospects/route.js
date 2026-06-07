import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req) {
  try {
    const { description } = await req.json();

    if (!description || description.trim().length < 3) {
      return NextResponse.json({ error: "Please describe your ideal customer." }, { status: 400 });
    }

    const systemPrompt = `You are a B2B sales intelligence AI. Given a plain-English description of an ideal customer profile (ICP), generate a list of 10 realistic prospect profiles.

Return ONLY a valid JSON array with this exact structure:
[
  {
    "name": "Full Name",
    "title": "Job Title",
    "company": "Company Name",
    "industry": "Industry",
    "location": "City, Country",
    "email": "firstname.lastname@company.com",
    "phone": "+1 (555) 000-0000",
    "linkedin": "https://linkedin.com/in/firstname-lastname",
    "companySize": "51-200 employees",
    "revenue": "$5M-$20M ARR",
    "confidence": 92,
    "hooks": ["Recently hired 3 sales reps", "Uses Salesforce", "Attended SaaStr 2024"],
    "painPoints": ["Manual prospecting", "No unified inbox", "Too many tools"],
    "techStack": ["Salesforce", "HubSpot", "LinkedIn Sales Navigator"]
  }
]

Rules:
- Make names, companies, and emails realistic and diverse
- confidence is a number from 70-98 representing match quality
- hooks are 2-4 personalization conversation starters based on their profile
- painPoints are 2-3 pain points relevant to the ICP description
- techStack has 2-4 tools they likely use
- Vary industries, company sizes, and locations to be realistic
- Email format: firstname.lastname@companydomain.com
- Return ONLY the JSON array, no markdown, no explanation`;

    const chat = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Find prospects matching: ${description}` },
      ],
      temperature: 0.85,
      max_tokens: 4000,
    });

    const raw = chat.choices[0]?.message?.content?.trim();

    // Extract JSON from the response (handle any extra text)
    const jsonMatch = raw.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error("No valid JSON array found in response");
    }

    const prospects = JSON.parse(jsonMatch[0]);

    return NextResponse.json({ prospects, query: description });
  } catch (err) {
    console.error("find-prospects error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to find prospects" },
      { status: 500 }
    );
  }
}
