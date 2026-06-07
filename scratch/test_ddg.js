async function testDDGHeaders() {
  const query = "SaaS CTOs New York";
  const encodedQuery = encodeURIComponent(query);
  const url = `https://html.duckduckgo.com/html/?q=${encodedQuery}`;
  
  try {
    console.log("Fetching DDG with full headers:", url);
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "Accept-Language": "en-US,en;q=0.9",
        "Accept-Encoding": "gzip, deflate, br",
        "Sec-Ch-Ua": '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
        "Sec-Ch-Ua-Mobile": "?0",
        "Sec-Ch-Ua-Platform": '"Windows"',
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "none",
        "Sec-Fetch-User": "?1",
        "Upgrade-Insecure-Requests": "1"
      }
    });
    
    console.log("Status:", res.status);
    const html = await res.text();
    console.log("HTML length:", html.length);
    
    if (html.includes("anomaly-modal")) {
      console.log("Blocked by anomaly/bot protection");
    } else {
      console.log("Successfully fetched search page! Sample HTML:");
      console.log(html.substring(0, 500));
    }
  } catch (err) {
    console.error("DDG failed:", err);
  }
}

testDDGHeaders();
