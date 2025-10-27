export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method not allowed' });
      return;
    }

    const { words, age } = req.body || {};
    if (!Array.isArray(words) || words.length === 0) {
      res.status(400).json({ error: 'words[] is required' });
      return;
    }

    const ageGroup = age || 10;
    const prompt = `You are a vocabulary teacher for ${ageGroup}-year-old students. For each word provided, create:
1. A simple, age-appropriate definition
2. One example sentence using the word

Return your response as a JSON object with this structure:
{
  "explanations": [
    {
      "word": "example",
      "definition": "simple definition here",
      "example": "example sentence here"
    }
  ],
  "story": "A short story (2-3 sentences) that uses all the words in context"
}`;

    // Call OpenAI Chat Completions API
    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: prompt,
          },
          {
            role: 'user',
            content: `Define these words: ${words.join(', ')}`,
          },
        ],
        response_format: { type: 'json_object' },
        max_completion_tokens: 500,
      }),
    });

    if (!r.ok) {
      const text = await r.text().catch(() => '');
      res.status(r.status).json({ error: 'Upstream error', detail: text });
      return;
    }

    const data = await r.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      res.status(500).json({ error: 'No content received from OpenAI' });
      return;
    }

    try {
      const parsedContent = JSON.parse(content);
      res.status(200).json(parsedContent);
    } catch (parseError) {
      res.status(500).json({ error: 'Failed to parse response', content });
    }
  } catch (err) {
    res
      .status(500)
      .json({ error: 'Server error', detail: String(err?.message || err) });
  }
}
