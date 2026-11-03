body: JSON.stringify({
  model: "openai/gpt-oss-120b",
  messages: [
    { role: "system", content: systemPrompt },
    { role: "user", content: message }
  ],