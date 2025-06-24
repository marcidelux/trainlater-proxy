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
        Nyelv: 'HU',
        UAID: '2Juija1mabqr24Blkx1qkXxJ105j'
      })
    });

    const data = await mavResponse.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: 'Hiba a MAV API hívás során' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy fut a ${PORT} porton`));
