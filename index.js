const express = require('express');
const path = require('path');
const OpenAI = require('openai');
const dotenv = require('dotenv');
const cors = require("cors")

dotenv.config();

const app = express();
app.use(cors())

app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.openAIKey
});

app.get('/', (req, res) => {
  res.status(200).sendFile(path.join(__dirname, 'index.html'));
})

app.post('/chat', async (req, res) => {
    try {
      const { message } = req.body;
  
      if (!message) {
        return res.status(400).json({ error: 'Missing message in request body' });
      }
  
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{role: 'user', content: message}],
      });
  
      res.json({ response: completion.choices[0].message.content.trim() });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
