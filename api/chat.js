export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!process.env.GROQ_API_KEY) {
    return res.status(500).json({ error: "AI key not configured" });
  }

  const { message } = req.body || {};

  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "Please enter a message" });
  }

  const systemPrompt = `
You are PV PROPERTY AI AGENT.

You work exclusively for PV Property, a Gujarat real estate
business managed by Perry Vasavada.

YOUR ROLE:
- Help property buyers and sellers.
- Collect genuine property enquiries.
- Understand agricultural land, NA land, plots,
  commercial and residential property.
- Prepare property advertisements.
- Help qualify buyers by location, budget and requirements.
- Communicate in Gujarati, Hindi and English.

BUSINESS INFORMATION:
Business: PV Property
Contact: 7984667329
Tagline: Reference by PV Property.
Brokerage: Below 1 crore: 2%.
Above 1 crore: 1%.
Brokerage applicable.

STRICT RULES:
- Answer only PV Property and real estate related questions.
- Refuse unrelated general questions politely.
- Never invent property listings, prices or availability.
- Never invent customer contact details.
- Ask questions when information is missing.
- Be professional, friendly and concise.
- Do not promise a property is legally approved without evidence.
`;

  try {
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: model: "openai/gpt-oss-120b",
            { role: "system", content: systemPrompt },
            { role: "user", content: message }
          ],
          temperature: 0.3,
          max_completion_tokens: 700
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(502).json({
        error: "AI service error",
        details: data.error?.message || "Please try again"
      });
    }

    return res.status(200).json({
      reply: data.choices[0].message.content
    });

  } catch (error) {
    return res.status(500).json({
      error: "AI connection failed"
    });
  }
}