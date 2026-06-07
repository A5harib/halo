const Groq = require("groq-sdk");

async function testGPTOSS() {
  const apiKey = "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";
  const groq = new Groq({ apiKey });

  try {
    console.log("Querying openai/gpt-oss-120b with max_tokens: 1000...");
    const chat = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages: [{ role: "user", content: "Tell me a 3-word joke." }],
      temperature: 0.7,
      max_tokens: 1000,
    });
    console.log("Response content:", chat.choices[0]?.message?.content);
    console.log("Response reasoning:", chat.choices[0]?.message?.reasoning);
  } catch (err) {
    console.error("Error:", err.message);
  }
}

testGPTOSS();
