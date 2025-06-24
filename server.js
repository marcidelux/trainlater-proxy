const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/vonatok', async (req, res) => {
    try {
      const mavResponse = await fetch('https://vim.mav-start.hu/VIM/PR/20230501/MobileServiceS.svc/rest/GetVonatok', {
        method: 'POST', // still POST to MAV
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          "Nyelv": "HU",
          "UAID": "2Juija1mabqr24Blkx1qkXxJ105j"
        })
      });
  
      const rawText = await mavResponse.text();
  
      console.log('MAV status:', mavResponse.status);
      console.log('MAV raw body:', rawText.slice(0, 200)); // prevent log overflow
  
      if (!mavResponse.ok) {
        return res.status(mavResponse.status).json({
          error: 'MAV API responded with error',
          body: rawText
        });
      }
  
      try {
        // Try to parse as JSON
        const data = JSON.parse(rawText);
        return res.json(data);
      } catch (jsonErr) {
        // Fallback to returning XML
        console.warn('Response is not JSON, returning raw XML.');
        res.set('Content-Type', 'text/xml');
        return res.status(200).send(rawText);
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
