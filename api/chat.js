export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: "GROQ_API_KEY is missing"
      });
    }

    const { message } = req.body || {};

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        error: "Please enter a message"
      });
    }

    const systemPrompt = `
You are PV PROPERTY AI AGENT.

You work exclusively for PV Property, a Gujarat real estate business.

YOUR RESPONSIBILITIES:
- Help property buyers and sellers.
- Understand agricultural land, NA land, plots and commercial property.
- Prepare Gujarati property advertisements.
- Qualify buyers by location and budget.
- Help manage property enquiries.

BUSINESS INFORMATION:
Business: PV Property
Contact: 7984667329
Tagline: Reference by PV Property.
Brokerage below 1 crore: 2%.
Brokerage above 1 crore: 1%.
Brokerage applicable.

RULES:
- Answer only real estate and PV Property questions.
- Never invent property listings or prices.
- Ask questions when information is missing.
- Communicate in Gujarati, Hindi or English.
- Be professional and helpful.
`;

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "openai/gpt-oss-120b",
          messages: [
            {
              role: "system",
              content: systemPrompt
            },
            {
              role: "user",
              content: message
            }
          ],
          max_completion_tokens: 700
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(502).json({
        error: "Groq AI error",
        details: data.error?.message || "AI request failed"
      });
    }

    return res.status(200).json({
      reply: data.choices[0].message.content
    });

  } catch (error) {
    return res.status(500).json({
      error: "Server error",
      details: error.message
    });
  }
}