import axios from 'axios';

const API_URL = 'https://api.openai.com/v1/chat/completions';

export const analyzeFullScript = async (prompt) => {
	try {
		const apiKey = process.env.REACT_APP_OPENAI_API_KEY;

		if (!apiKey) {
			throw new Error("API key is not defined. Please set REACT_APP_OPENAI_API_KEY in your environment variables.");
		}

		const headers = {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${apiKey}`,
		};

		const response = await axios.post(
			API_URL,
			{
				model: "gpt-3.5-turbo",
				messages: [
					{
						role: "system",
						content: "You are an expert at analyzing the transcript of an interview on a research topic."
					},
					{
						role: "user",
						content: prompt,
					}
				],
				max_tokens: 150,
				temperature: 0.7,
			},
			{ headers }
		);

		if (response.data && response.data.choices && response.data.choices[0] && response.data.choices[0].message) {
			return response.data.choices[0].message.content;
		} else {
			throw new Error("Unexpected response format from OpenAI API.");
		}
	} catch (error) {
		console.error("Error:", error.response ? error.response.data : error.message);
		throw error;
	}
};



export const analyzeKeyPoints = async (prompt) => {
	try {
		const apiKey = process.env.REACT_APP_OPENAI_API_KEY;

		if (!apiKey) {
			throw new Error("API key is not defined. Please set REACT_APP_OPENAI_API_KEY in your environment variables.");
		}

		const headers = {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${apiKey}`,
		};

		const response = await axios.post(
			API_URL,
			{
				model: "gpt-3.5-turbo",
				messages: [
					// {
					//   role: "system",
					//   content: "You are "
					// },
					{
						role: "user",
						content: prompt,
					}
				],
				max_tokens: 150,
				temperature: 0.7,
			},
			{ headers }
		);

		if (response.data && response.data.choices && response.data.choices[0] && response.data.choices[0].message) {
			return response.data.choices[0].message.content;
		} else {
			throw new Error("Unexpected response format from OpenAI API.");
		}
	} catch (error) {
		console.error("Error:", error.response ? error.response.data : error.message);
		throw error;
	}
};

export const simulateAnswer = async (prompt) => {
	try {
		const apiKey = process.env.REACT_APP_OPENAI_API_KEY;

		const headers = {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${apiKey}`,
		};

		const response = await axios.post(
			API_URL,
			{
				model: "gpt-3.5-turbo",
				messages: [
					{
						role: "user",
						content: prompt,
					}
				],
				max_tokens: 150,
				temperature: 0.7,
			},
			{ headers }
		);

		if (response.data && response.data.choices && response.data.choices[0] && response.data.choices[0].message) {
			return response.data.choices[0].message.content;
		} else {
			throw new Error("Unexpected response format from OpenAI API.");
		}
	} catch (error) {
		console.error("Error:", error.response ? error.response.data : error.message);
		throw error;
	}
};