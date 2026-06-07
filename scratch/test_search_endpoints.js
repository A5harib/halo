async function testSearchEndpoints() {
  const query = "SaaS CTOs New York";
  const encodedQuery = encodeURIComponent(query);
  
  // 1. Test Searx instance (format=json)
  try {
    const url = `https://searx.be/search?q=${encodedQuery}&format=json`;
    console.log("Testing Searx:", url);
    const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
    console.log("Searx status:", res.status);
    if (res.ok) {
      const data = await res.json();
      console.log("Searx results count:", data.results?.length);
      if (data.results?.length > 0) {
        console.log("First Searx result:", data.results[0].title, data.results[0].url);
        return; // Success!
      }
    }
  } catch (e) {
    console.error("Searx failed:", e.message);
  }

  // 2. Test another Searx instance
  try {
    const url = `https://search.disclosure.gq/search?q=${encodedQuery}&format=json`;
    console.log("Testing Searx 2:", url);
    const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
    console.log("Searx 2 status:", res.status);
    if (res.ok) {
      const data = await res.json();
      console.log("Searx 2 results count:", data.results?.length);
    }
  } catch (e) {
    console.error("Searx 2 failed:", e.message);
  }

  // 3. Test Qwant API (unofficial)
  try {
    const url = `https://api.qwant.com/v3/search/web?q=${encodedQuery}&count=5&t=web&locale=en_US`;
    console.log("Testing Qwant:", url);
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"
      }
    });
    console.log("Qwant status:", res.status);
    if (res.ok) {
      const data = await res.json();
      console.log("Qwant results count:", data.data?.result?.items?.main?.length);
    }
  } catch (e) {
    console.error("Qwant failed:", e.message);
  }
}

testSearchEndpoints();
