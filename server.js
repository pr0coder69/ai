const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.post('/api/chat', async (req, res) => {
    const { prompt } = req.body;

    try {
        const response = await axios.get(`https://api-library-kohi.onrender.com/api/deepseek`, {
            params: { prompt: prompt }
        });

        // DEBUG: Makikita mo ito sa Render Logs para malaman ang format ng API
        console.log("API Response Data:", response.data);

        // Sinusubukan nating kunin ang text sa iba't ibang posibleng pangalan
        const aiMessage = 
            response.data.result || 
            response.data.response || 
            response.data.content || 
            response.data.data ||
            (typeof response.data === 'string' ? response.data : null);

        if (aiMessage) {
            res.json({ response: aiMessage });
        } else {
            res.json({ response: "Pasensya na, rumesponde ang API pero walang laman ang text." });
        }

    } catch (error) {
        console.error('Error details:', error.response ? error.response.data : error.message);
        res.status(500).json({ response: "Hindi makakonekta sa AI server sa ngayon." });
    }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Zynex Server active on port ${PORT}`);
});
