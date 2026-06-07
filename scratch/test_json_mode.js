const Groq = require("groq-sdk");

async function testJSONMode() {
  const apiKey = "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";
  const groq = new Groq({ apiKey });

  const description = "Saas owners in pakistan";

  const systemPrompt = `You are a B2B sales intelligence AI. Given a plain-English description of an ideal customer profile (ICP) and real web search results matching that ICP, extract and generate a list of 10 real or highly grounded prospect profiles.
Use the names, companies, and roles found in the search results as much as possible.

Return a valid JSON object with a single "prospects" key containing an array of 10 objects:
{
  "prospects": [
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
}

Rules:
- Vary industries, company sizes, and locations based on the real companies and search results
- confidence is a number from 70-98 representing match quality
- hooks are 2-4 personalization conversation starters based on the real company's context
- painPoints are 2-3 pain points relevant to their business
- techStack has 2-4 tools they likely use`;

  try {
    console.log("Calling Groq API with response_format: { type: 'json_object' }...");
    const chat = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Target ICP: ${description}\n\nWeb Search Results:\n[]` },
      ],
      response_format: { type: "json_object" },
      temperature: 0.2,
      max_tokens: 4000,
    });

    const raw = chat.choices[0]?.message?.content;
    console.log("Raw output length:", raw?.length);
    
    const parsed = JSON.parse(raw);
    console.log("Successfully parsed JSON using JSON Mode!");
    console.log("Prospects count:", parsed.prospects?.length);
    if (parsed.prospects?.length > 0) {
      console.log("First prospect company:", parsed.prospects[0].company);
    }
  } catch (err) {
    console.error("Error:", err.message);
  }
}

testJSONMode();
