async function testBingQueries() {
  const queries = [
    'CTO SaaS "New York" profile',
    'CTO SaaS "New York" linkedin',
    '"CTO at SaaS" "New York"'
  ];

  for (const query of queries) {
    const encodedQuery = encodeURIComponent(query);
    const url = `https://www.bing.com/search?q=${encodedQuery}`;
    
    try {
      console.log(`\n========================================\nQuery: ${query}\n========================================`);
      const res = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
          "Accept-Language": "en-US,en;q=0.9"
        }
      });
      
      const html = await res.text();
      const hasResults = html.includes('class="b_algo"') || html.includes('id="b_results"');
      console.log("Status:", res.status, "HTML length:", html.length, "Has elements:", hasResults);
      
      if (hasResults) {
        const matches = [...html.matchAll(/<li class="b_algo"[^>]*>([\s\S]*?)<\/li>/g)];
        console.log("Results found:", matches.length);
        for (let i = 0; i < Math.min(3, matches.length); i++) {
          console.log(`\nResult ${i+1}:`);
          
          // Find title
          const titleMatch = matches[i][1].match(/<h2><a[^>]*>([\s\S]*?)<\/a>/);
          const title = titleMatch ? titleMatch[1].replace(/<[^>]*>/g, '').trim() : "N/A";
          console.log("Title:", title);
          
          // Find link
          const linkMatch = matches[i][1].match(/href="([^"]+)"/);
          let link = linkMatch ? linkMatch[1] : "N/A";
          if (link.startsWith("https://www.bing.com/ck/a")) {
            const uMatch = link.match(/u=a1([^&]+)/);
            if (uMatch) {
              try {
                const base64Url = uMatch[1].replace(/-/g, '+').replace(/_/g, '/');
                const padded = base64Url.padEnd(base64Url.length + (4 - base64Url.length % 4) % 4, '=');
                link = Buffer.from(padded, 'base64').toString('utf-8');
              } catch (e) {}
            }
          }
          console.log("Link:", link);

          // Find snippet
          const snippetMatch = matches[i][1].match(/<p[^>]*>([\s\S]*?)<\/p>/) || matches[i][1].match(/<div class="b_caption"[^>]*>([\s\S]*?)<\/div>/);
          const snippet = snippetMatch ? snippetMatch[1].replace(/<[^>]*>/g, '').trim() : "N/A";
          console.log("Snippet:", snippet);
        }
      }
    } catch (err) {
      console.error("Query failed:", err.message);
    }
  }
}

testBingQueries();
