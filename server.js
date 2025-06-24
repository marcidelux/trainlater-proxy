const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/vonatok', async (req, res) => {
  console.log('Received request for /vonatok');
  try {
    const mavResponse = await fetch('https://vim.mav-start.hu/VIM/PR/20240320/MobileServiceS.svc/rest/GetVonatok', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json', // <— This is required!
        'User-Agent': 'MAVApp/1.0 (Linux; Android 11)' // <— Spoofing mobile client
      },
      body: JSON.stringify({
        "Nyelv": "HU",
        "UAID": "2Juija1mabqr24Blkx1qkXxJ105j"
      })
    });

    const text = await mavResponse.text();

    console.log('MAV status:', mavResponse.status);
    console.log('MAV body snippet:', text.slice(0, 300));

    if (!mavResponse.ok) {
      return res.status(mavResponse.status).json({
        error: 'MAV API responded with error',
        body: text
      });
    }

    try {
      const data = JSON.parse(text);
      return res.json(data);
    } catch (err) {
      res.set('Content-Type', 'text/xml');
      return res.send(text);
    }

  } catch (err) {
    console.error('Proxy error:', err);
    res.status(500).json({
      error: 'Hiba a MAV API hívás során',
      detail: err.message
    });
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));
