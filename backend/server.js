import express from 'express';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize environment variables
dotenv.config();

const app = express();
app.use(express.json());

// Access your API key as an environment variable
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

// Get the generative model
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Route to handle query generation
app.post('/generate-query', async (req, res) => {
  const { database, query } = req.body;

  if (!database || !query) {
    return res.status(400).json({ error: 'Database and query are required' });
  }

  const prompt = `Create a ${database} request to ${query.charAt(0).toLowerCase() + query.slice(1)}:`;

  try {
    const result = await model.generateContent(prompt);
    const generatedQuery = result.response.text().trim(); // Ensure no extra whitespace
    res.json({ query: generatedQuery });
  } catch (error) {
    console.error('Error generating query:', error);
    res.status(500).json({ error: 'Failed to generate query' });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
