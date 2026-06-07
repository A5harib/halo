const Groq = require("groq-sdk");

async function testGroq() {
  const apiKey = "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";
  console.log("Using API Key:", apiKey);
  const groq = new Groq({ apiKey });

  const models = ["openai/gpt-oss-120b", "llama-3.3-70b-versatile", "llama-3.1-8b-instant"];

  for (const model of models) {
    try {
      console.log(`Testing model: ${model}...`);
      const chat = await groq.chat.completions.create({
        model,
        messages: [{ role: "user", content: "Hello, say test" }],
        max_tokens: 10,
      });
      console.log(`Success with ${model}:`, chat.choices[0]?.message?.content);
    } catch (err) {
      console.error(`Failed with ${model}:`, err.message);
    }
  }
}

testGroq();
