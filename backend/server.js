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

  if (!query || query.trim().length === 0) {
    return res.status(400).json({ error: 'Please provide a request for an SQL query.' });
  }

  const prompt = `Generate only an SQL query no additional text for the following request: ${query} if query cannot be generated display NO`;

  try {
    const result = await model.generateContent(prompt);
    let generatedQuery = result.response.text().trim(); // Ensure no extra whitespace

    // Clean the query to remove unwanted characters
    generatedQuery = generatedQuery.replace(/```sql|```/g, '').trim();

    console.log('Generated SQL Query:', generatedQuery);

    if (generatedQuery === "NO") {
      return res.status(400).json({ error: 'Please provide a valid SQL query request.' });
    }

    // Simple validation: check if the query contains valid SQL syntax
    if (generatedQuery.toLowerCase().startsWith('select') || generatedQuery.toLowerCase().startsWith('show') || generatedQuery.toLowerCase().startsWith('describe')) {
      connection.query(generatedQuery, (error, results) => {
        if (error) {
          console.error('Error executing query:', error);
          return res.status(500).json({ error: `Error executing query: ${error.message}` });
        }
        res.json({ results });
      });
    } else {
      return res.status(400).json({ error: `The provided input "${query}" is not a valid SQL query.` });
    }
  } catch (error) {
    console.error('Error generating query:', error);
    res.status(500).json({ error: `Failed to generate query: ${error.message}` });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
