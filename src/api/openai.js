const API_URL = 'https://api.openai.com/v1/chat/completions';

/**
 * Call OpenAI API to generate vocabulary explanations and story
 * @param {string[]} words - Array of words to explain
 * @param {number} age - Age of the target audience
 * @returns {Promise<Object>} Response containing explanations and story
 */
export const callOpenAI = async (words, age) => {
  const apiKey = process.env.REACT_APP_OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error(
      'OpenAI API key not found. Please set REACT_APP_OPENAI_API_KEY in your .env file.'
    );
  }

  const prompt = `You are an educational assistant helping to explain vocabulary words to a ${age}-year-old child.

For each of these words: ${words.join(', ')}

Please provide a JSON response with this exact structure:
{
  "explanations": [
    {
      "word": "word1",
      "definition": "A simple, age-appropriate definition that a ${age}-year-old can understand",
      "example": "A clear example sentence using the word in context",
      "realWorld": "A real-world example of where/how they might encounter this word"
    }
  ],
  "story": "Create an engaging, imaginative story (5-10 sentences) that naturally incorporates ALL the vocabulary words. Make it fun, age-appropriate, and educational for a ${age}-year-old. The story should be adventurous or magical to capture their interest."
}

Guidelines:
- Keep explanations simple but accurate
- Use vocabulary appropriate for age ${age}
- Make the story exciting and memorable
- Ensure all words are naturally woven into the story
- Keep it positive and educational`;

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content:
              'You are a helpful educational assistant that creates age-appropriate vocabulary explanations and stories. Always respond with valid JSON in the exact format requested.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 2000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `OpenAI API error: ${response.status} - ${
          errorData.error?.message || 'Unknown error'
        }`
      );
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No content received from OpenAI API');
    }

    try {
      const result = JSON.parse(content);

      // Validate the response structure
      if (
        !result.explanations ||
        !Array.isArray(result.explanations) ||
        !result.story
      ) {
        throw new Error('Invalid response format from OpenAI API');
      }

      // Ensure all words have explanations
      const missingWords = words.filter(
        (word) =>
          !result.explanations.some(
            (exp) => exp.word.toLowerCase() === word.toLowerCase()
          )
      );

      if (missingWords.length > 0) {
        console.warn('Missing explanations for words:', missingWords);
      }

      return result;
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', content);
      throw new Error('Failed to parse response from OpenAI API');
    }
  } catch (error) {
    console.error('OpenAI API call failed:', error);
    throw error;
  }
};

/**
 * Validate API key format (basic check)
 * @param {string} apiKey - The API key to validate
 * @returns {boolean} Whether the key appears to be valid
 */
export const validateApiKey = (apiKey) => {
  return (
    apiKey &&
    typeof apiKey === 'string' &&
    apiKey.startsWith('sk-') &&
    apiKey.length > 20
  );
};

/**
 * Test the API connection with a simple request
 * @returns {Promise<boolean>} Whether the API is accessible
 */
export const testApiConnection = async () => {
  try {
    await callOpenAI(['test'], 10);
    return true;
  } catch (error) {
    return false;
  }
};
