const Groq = require("groq-sdk");

async function listModels() {
  const apiKey = "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";
  const groq = new Groq({ apiKey });

  try {
    const list = await groq.models.list();
    console.log("Supported Models:");
    list.data.forEach(m => {
      console.log(`- ${m.id} (owned by ${m.owned_by})`);
    });
  } catch (err) {
    console.error("Error listing models:", err);
  }
}

listModels();
