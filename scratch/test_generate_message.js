async function testGenerateMessage() {
  const prospect = {
    name: "Maya Patel",
    title: "Chief Technology Officer",
    company: "SyncWave",
    industry: "SaaS",
    location: "New York, USA",
    email: "maya.patel@syncwave.com",
    phone: "+1 (212) 555-0123",
    linkedin: "https://linkedin.com/in/maya-patel",
    companySize: "51-200 employees",
    revenue: "$10M-$30M ARR",
    confidence: 94,
    hooks: ["Raised $20M Series A in March 2024", "Featured in Forbes Cloud 30", "Uses AWS and Kubernetes"],
    painPoints: ["Scaling infrastructure during rapid growth", "Managing multi‑tenant security"],
    techStack: ["AWS", "Kubernetes", "Terraform", "Datadog"]
  };

  try {
    const res = await fetch("http://localhost:3000/api/generate-message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prospect, channel: "email", tone: "professional" })
    });
    console.log("Status:", res.status);
    const data = await res.json();
    console.log("Response:", JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Error calling generate-message:", err);
  }
}

testGenerateMessage();
