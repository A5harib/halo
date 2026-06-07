const fs = require('fs');

function parseDDGHTML(html) {
  const results = [];
  // Split by the result container div
  const blocks = html.split(/<div[^>]*class="[^"]*web-result[^"]*"/);
  
  for (let i = 1; i < blocks.length; i++) {
    const block = blocks[i];
    
    // Extract title
    const titleMatch = block.match(/<a[^>]*class="result__a"[^>]*>([\s\S]*?)<\/a>/);
    const title = titleMatch ? titleMatch[1].replace(/<[^>]*>/g, '').trim() : "";
    
    // Extract raw redirect URL or uddg target
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
    
    // Extract snippet
    const snippetMatch = block.match(/<a[^>]*class="result__snippet"[^>]*>([\s\S]*?)<\/a>/);
    const snippet = snippetMatch ? snippetMatch[1].replace(/<[^>]*>/g, '').trim() : "";
    
    if (title && url) {
      results.push({ title, url, snippet });
    }
  }
  return results;
}

const html = fs.readFileSync('scratch/ddg_html_response.html', 'utf-8');
const results = parseDDGHTML(html);
console.log(`Successfully parsed ${results.length} results:`);
results.forEach((r, idx) => {
  console.log(`\n--- Result ${idx + 1} ---`);
  console.log("Title:", r.title);
  console.log("URL:", r.url);
  console.log("Snippet:", r.snippet);
});
