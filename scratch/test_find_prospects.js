const Groq = require("groq-sdk");

async function testFindProspects() {
  const apiKey = "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";
  const groq = new Groq({ apiKey });

  const description = "Saas owners in pakistan";

  const systemPrompt = `You are a B2B sales intelligence AI. Given a plain-English description of an ideal customer profile (ICP) and real web search results matching that ICP, extract and generate a list of 10 real or highly grounded prospect profiles.
Use the names, companies, and roles found in the search results as much as possible. If the search results contain general directories or articles (like "Top 100 SaaS companies in New York" or "Fractional CTO in NY"), extract the real companies and create realistic profiles for them (e.g. CTO at that specific real company). If the search results contain specific people profiles, use them directly.

Return ONLY a valid JSON array with this exact structure:
[
  {
    "name": "Full Name",
    "title": "Job Title",
    "company": "Company Name",
    "industry": "Industry",
    "location": "City, Country",
    "email": "firstname.lastname@companydomain.com",
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
- Vary industries, company sizes, and locations based on the real companies and search results
- confidence is a number from 70-98 representing match quality
- hooks are 2-4 personalization conversation starters based on the real company's context
- painPoints are 2-3 pain points relevant to their business
- techStack has 2-4 tools they likely use
- Return ONLY the JSON array, no markdown, no explanation`;

  try {
    console.log("Calling Groq API...");
    const chat = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Target ICP: ${description}\n\nWeb Search Results:\n[]` }, // Empty results to isolate model generation logic first
      ],
      temperature: 0.2,
      max_tokens: 4000,
    });

    const raw = chat.choices[0]?.message?.content;
    console.log("Raw output length:", raw?.length);
    console.log("Raw output:\n", raw);
    
    const jsonMatch = raw.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      console.log("Extracted JSON text length:", jsonMatch[0].length);
      try {
        const parsed = JSON.parse(jsonMatch[0]);
        console.log("Successfully parsed JSON! Count:", parsed.length);
      } catch (e) {
        console.error("JSON parse failed:", e.message);
        // Find character index of error
        const match = e.message.match(/position (\d+)/);
        if (match) {
          const pos = parseInt(match[1]);
          console.log("Error context around index", pos, ":");
          console.log(jsonMatch[0].substring(Math.max(0, pos - 50), Math.min(jsonMatch[0].length, pos + 50)));
        }
      }
    } else {
      console.log("No JSON array found!");
    }
  } catch (err) {
    console.error("Error:", err.message);
  }
}

testFindProspects();
