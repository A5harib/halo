async function testScoreIntent() {
  try {
    const res = await fetch("http://localhost:3000/api/score-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        replyText: "Hi Alex, thanks for reaching out. Yes, we are currently experiencing some scaling issues with our Kubernetes clusters. Can you send over a demo video or a calendar link?",
        prospectName: "Maya Patel",
        prospectTitle: "Chief Technology Officer"
      })
    });
    console.log("Status:", res.status);
    const data = await res.json();
    console.log("Response:", JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Error calling score-intent:", err);
  }
}

testScoreIntent();
