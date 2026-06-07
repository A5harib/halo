async function testGoogleSearch() {
  const query = "SaaS CTOs New York";
  const encodedQuery = encodeURIComponent(query);
  const url = `https://www.google.com/search?q=${encodedQuery}`;
  
  try {
    console.log("Fetching Google search page:", url);
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9"
      }
    });
    
    console.log("Status:", res.status);
    const html = await res.text();
    console.log("HTML length:", html.length);
    
    // Look for results
    // Google results typically contain <div class="g"> or specific structure
    const hasResults = html.includes('class="g"') || html.includes('id="search"');
    console.log("Contains classic Google elements:", hasResults);
    
    // Save to check structure
    const fs = require('fs');
    fs.writeFileSync('scratch/google_response.html', html);
    console.log("Saved response to scratch/google_response.html");
  } catch (err) {
    console.error("Google search failed:", err);
  }
}

testGoogleSearch();
