async function testGemini() {
  const apiKey = "AIzaSyCHA9-xhPVN9EkuOwV2li-Z8wLEC96DkVc";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  const payload = {
    contents: [
      {
        role: "user",
        parts: [
          {
            text: "Find 3 real SaaS CTOs or founders currently active in New York. Search the web for their names, companies, LinkedIn profiles, and descriptions. Return ONLY a JSON array with: name, title, company, linkedin, description."
          }
        ]
      }
    ],
    tools: [
      {
        googleSearch: {}
      }
    ],
    generationConfig: {
      responseMimeType: "application/json"
    }
  };

  try {
    console.log("Calling Gemini API...");
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
    
    console.log("Status:", res.status);
    const data = await res.json();
    console.log("Response:", JSON.stringify(data, null, 2));
    
    if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
      console.log("Text result:", data.candidates[0].content.parts[0].text);
    }
    if (data.candidates?.[0]?.groundingMetadata) {
      console.log("Grounding Metadata:", JSON.stringify(data.candidates[0].groundingMetadata, null, 2));
    }
  } catch (err) {
    console.error("Error calling Gemini:", err);
  }
}

testGemini();
