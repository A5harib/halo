async function testAPI() {
  try {
    const res = await fetch("http://localhost:3000/api/find-prospects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description: "CTOs at SaaS startups in New York" })
    });
    console.log("Status:", res.status);
    const text = await res.text();
    console.log("Response text:", text.substring(0, 1000));
  } catch (err) {
    console.error("Fetch error:", err);
  }
}
testAPI();
