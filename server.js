const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000; // Render ang magbibigay ng PORT

app.use(cors());
app.use(express.json());

// I-serve ang static files mula sa folder na 'public'
app.use(express.static('public'));

app.post('/api/chat', async (req, res) => {
    const { prompt } = req.body;

    if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
    }

    try {
        const response = await axios.get(`https://api-library-kohi.onrender.com/api/deepseek`, {
            params: { prompt: prompt }
        });

        // I-adjust natin ito base sa standard response ng API
        const aiMessage = response.data.result || response.data.content || "No response from AI.";
        res.json({ response: aiMessage });

    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Failed to fetch AI response' });
    }
});

// Lahat ng ibang request ay ibabalik sa index.html
app.get('*', (col, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
