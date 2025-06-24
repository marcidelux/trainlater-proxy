const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/vonatok', async (req, res) => {
  try {
    const mavResponse = await fetch('https://vim.mav-start.hu/VIM/PR/20230501/MobileServiceS.svc/rest/GetVonatok', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        "Nyelv": 'HU',
        "UAID": '2Juija1mabqr24Blkx1qkXxJ105j'
      })
    });

    const text = await mavResponse.text();  // safer: always parse as text first
    console.log('MAV status:', mavResponse.status);
    console.log('MAV body:', text);

    if (!mavResponse.ok) {
      return res.status(mavResponse.status).json({ error: 'MAV API responded with error', body: text });
    }

    const data = JSON.parse(text);  // parse text manually
    res.json(data);

  } catch (err) {
    console.error('Proxy error:', err);
    res.status(500).json({ error: 'Hiba a MAV API hívás során', detail: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));
