import axios from 'axios';

const API_URL = 'https://api.openai.com/v1/chat/completions';

export const analyzeQuestions = async (prompt) => {
  try {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
    };

    console.log("Headers:", headers);
    console.log("API Key:", process.env.REACT_APP_OPENAI_API_KEY);

    const response = await axios.post(
      API_URL,
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are an expert at analyzing interview questions."
          },
          {
            role: "user",
            content: prompt,
          }
        ],
        max_tokens: 150,
        temperature: 0.7,
      },
      {
        headers: headers,
      }
    );
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("Error:", error.response ? error.response.data : error.message);
    throw error;
  }
};
