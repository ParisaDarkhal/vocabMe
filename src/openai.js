/**
 * Call Vercel serverless function to generate vocabulary explanations and story
 * @param {string[]} words - Array of words to explain
 * @param {number} age - Age of the target audience
 * @returns {Promise<Object>} Response containing explanations and story
 */
export const callOpenAI = async (words, age) => {
	try {
		const response = await fetch('/api/generate', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				words,
				age,
			}),
		});

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}));
			throw new Error(`API error: ${response.status} - ${errorData.error || 'Unknown error'}`);
		}

		const result = await response.json();

		// Validate the response structure
		if (!result.explanations || !Array.isArray(result.explanations) || !result.story) {
			throw new Error('Invalid response format from API');
		}

		// Ensure all words have explanations
		const missingWords = words.filter(
			(word) => !result.explanations.some((exp) => exp.word.toLowerCase() === word.toLowerCase())
		);

		if (missingWords.length > 0) {
			console.warn('Missing explanations for words:', missingWords);
		}

		return result;
	} catch (error) {
		console.error('API call failed:', error);
		throw error;
	}
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
		console.error('API connection test failed:', error);
		return false;
	}
};

/**
 * Get API status
 * @returns {Promise<Object>} API status information
 */
export const getApiStatus = async () => {
	try {
		const response = await fetch('/api/status', {
			method: 'GET',
		});

		if (!response.ok) {
			throw new Error(`Status check failed: ${response.status}`);
		}

		return await response.json();
	} catch (error) {
		console.error('Status check failed:', error);
		return { status: 'error', message: error.message };
	}
};
