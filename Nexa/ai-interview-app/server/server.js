import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Express App
const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

// API Route for handling interview chat
app.post('/api/chat', async (req, res) => {
  try {
    const { history } = req.body;

    if (!history) {
      return res.status(400).json({ error: 'Chat history is required.' });
    }

    const chat = model.startChat({
      history: history,
      generationConfig: {
        maxOutputTokens: 1000,
      },
    });

    // The last message in the history is the user's latest response
    const userMessage = history[history.length - 1].parts[0].text;
    const result = await chat.sendMessage(userMessage);
    const response = result.response;
    const text = response.text();

    res.json({ message: text });

  } catch (error) {
    console.error('Error in /api/chat:', error);
    res.status(500).json({ error: 'Failed to get response from AI model.' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});