const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

const app = express();
const port = 3000;

dotenv.config();

app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  res.sendFile('public/Customers.html', { root: __dirname });
});

// FDA API Route
app.get('/api/fda', async (req, res) => {
  const search = req.query.search || 'skin';

  const url = `https://api.fda.gov/cosmetic/event.json?search=products.product_name:${search}&limit=10`;

  try {
    const response = await fetch(url);

    const data = await response.json();

    res.json(data);
  } catch (error) {
    res.status(500).json({
      message: 'Error retrieving FDA data',
      error: error.message,
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
