import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Utility to scrape DuckDuckGo search results
async function fetchSearch(query) {
  try {
    const encodedQuery = encodeURIComponent(query);
    const searchUrl = `https://html.duckduckgo.com/html/?q=${encodedQuery}`;
    const searchRes = await fetch(searchUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "Accept-Language": "en-US,en;q=0.9"
      }
    });
    
    if (!searchRes.ok) {
      console.warn(`DDG search failed with status ${searchRes.status}`);
      return [];
    }
    
    const html = await searchRes.text();
    if (html.includes("anomaly-modal")) {
      console.warn("DDG search blocked by bot verification");
      return [];
    }
    
    const results = [];
    const blocks = html.split(/<div[^>]*class="[^"]*web-result[^"]*"/);
    for (let i = 1; i < blocks.length; i++) {
      const block = blocks[i];
      const titleMatch = block.match(/<a[^>]*class="result__a"[^>]*>([\s\S]*?)<\/a>/);
      const title = titleMatch ? titleMatch[1].replace(/<[^>]*>/g, '').trim() : "";
      
      const hrefMatch = block.match(/href="([^"]+)"/);
      let url = "";
      if (hrefMatch) {
        const href = hrefMatch[1];
        const uddgMatch = href.match(/uddg=([^&]+)/);
        if (uddgMatch) {
          url = decodeURIComponent(uddgMatch[1]);
        } else {
          url = href;
        }
      }
      
      const snippetMatch = block.match(/<a[^>]*class="result__snippet"[^>]*>([\s\S]*?)<\/a>/);
      const snippet = snippetMatch ? snippetMatch[1].replace(/<[^>]*>/g, '').trim() : "";
      
      if (title && url) {
        results.push({ title, url, snippet });
      }
    }
    return results.slice(0, 10);
  } catch (err) {
    console.error("fetchSearch error:", err);
    return [];
  }
}

export async function POST(req) {
  try {
    const { description } = await req.json();

    if (!description || description.trim().length < 3) {
      return NextResponse.json({ error: "Please describe your ideal customer." }, { status: 400 });
    }

    // Try to get real search results
    console.log(`Scraping search results for: "${description}"`);
    const searchResults = await fetchSearch(description);
    console.log(`Found ${searchResults.length} real search results.`);

    const systemPrompt = `You are a B2B sales intelligence AI. Given a plain-English description of an ideal customer profile (ICP) and real web search results matching that ICP, extract and generate a list of 10 real or highly grounded prospect profiles.
Use the names, companies, and roles found in the search results as much as possible. If the search results contain general directories or articles (like "Top 100 SaaS companies in New York" or "Fractional CTO in NY"), extract the real companies and create realistic profiles for them (e.g. CTO at that specific real company). If the search results contain specific people profiles, use them directly.

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

    const userMessage = `Target ICP: ${description}

Web Search Results:
${JSON.stringify(searchResults, null, 2)}

Based on the above search results, find 10 real/grounded prospects. Return the output as a valid JSON object matching the requested schema.`;

    const chat = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
      response_format: { type: "json_object" }, // Enforce JSON Mode output
      temperature: 0.2,
      max_tokens: 4000,
    });

    const raw = chat.choices[0]?.message?.content?.trim();
    if (!raw) {
      throw new Error("Empty response from B2B intelligence model");
    }

    const data = JSON.parse(raw);
    const prospects = data.prospects || [];

    return NextResponse.json({ prospects, query: description });
  } catch (err) {
    console.error("find-prospects error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to find prospects" },
      { status: 500 }
    );
  }
}
