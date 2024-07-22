import express from 'express';
import dotenv from 'dotenv';
import mysql from 'mysql2';
import cors from 'cors'; // Import cors
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize environment variables
dotenv.config();

const app = express();

// Use CORS middleware
app.use(cors());
app.use(express.json());

// MySQL Database connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'food_order'
});

connection.connect(error => {
  if (error) {
    console.error('Error connecting to the MySQL database:', error);
    return;
  }
  console.log('Connected to the MySQL database');
});

// Access your API key as an environment variable
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// Route to handle query generation
app.post('/generate-query', async (req, res) => {
  const { query } = req.body;

  if (!query) {
    return res.status(400).json({ error: 'Query is required' });
  }

  const prompt = `Generate only an SQL query no additional text for the following request: ${query}`;

  try {
    const result = await model.generateContent(prompt);
    let generatedQuery = result.response.text().trim(); // Ensure no extra whitespace

    // Clean the query to remove unwanted characters
    generatedQuery = generatedQuery.replace(/```sql|```/g, '').trim();

    console.log('Generated SQL Query:', generatedQuery);

    // Execute the cleaned query
    connection.query(generatedQuery, (error, results) => {
      if (error) {
        console.error('Error executing query:', error);
        return res.status(500).json({ error: 'Failed to execute query' });
      }
      res.json({ results });
    });
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
