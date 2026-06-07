async function testBrowserbase() {
  const apiKey = "bb_live_WdKBOpaGWuaXVuMpr8hiAhDTgW8";
  const url = "https://api.browserbase.com/v1/fetch";
  
  const targetUrl = 'https://www.google.com/search?q=site:linkedin.com/in/+%22CTO%22+%22SaaS%22+%22New+York%22';
  
  try {
    console.log("Calling Browserbase Fetch API for:", targetUrl);
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-BB-API-Key": apiKey
      },
      body: JSON.stringify({ url: targetUrl })
    });
    
    console.log("Status:", res.status);
    const data = await res.json();
    console.log("Response keys:", Object.keys(data));
    console.log("StatusCode from target:", data.statusCode);
    
    const html = data.content;
    console.log("HTML length:", html?.length);
    
    // Look for results
    const hasGoogleResults = html?.includes('class="g"') || html?.includes('id="search"');
    console.log("Contains classic Google elements:", hasGoogleResults);
    
    if (html) {
      const fs = require('fs');
      fs.writeFileSync('scratch/browserbase_google_response.html', html);
      console.log("Saved content to scratch/browserbase_google_response.html");
      
      // Let's print some search result titles if found
      // Classic google HTML might look like <h3 class="...">Title</h3>
      const matches = [...html.matchAll(/<h3[^>]*>([\s\S]*?)<\/h3>/g)];
      console.log(`Found ${matches.length} search result headings:`);
      for (let i = 0; i < Math.min(10, matches.length); i++) {
        console.log(`- ${matches[i][1].replace(/<[^>]*>/g, '').trim()}`);
      }
    }
  } catch (err) {
    console.error("Browserbase fetch failed:", err);
  }
}

testBrowserbase();
