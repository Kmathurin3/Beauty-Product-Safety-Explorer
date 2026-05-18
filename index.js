const express = require('express');
const bodyParser = require('body-parser');
const supabaseClient = require('@supabase/supabase-js');
const dotenv = require('dotenv');

const app = express();
const port = 3000;
dotenv.config();

app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = supabaseClient.createClient(supabaseUrl, supabaseKey);

app.get('/', (req, res) => {
  res.sendFile('public/index.html', { root: __dirname });
});

// Gets saved searches from Supabase
app.get('/saved-searches', async (req, res) => {
  const { data, error } = await supabase.from('saved_searches').select();

  if (error) {
    res.status(500).send(error);
  } else {
    res.json(data);
  }
});

// Saves a search to Supabase
app.post('/saved-search', async (req, res) => {
  const searchTerm = req.body.searchTerm;

  if (!searchTerm) {
    res.status(400).json({ message: 'Search term is required' });
    return;
  }

  const { data, error } = await supabase
    .from('saved_searches')
    .insert({
      search_term: searchTerm,
    })
    .select();

  if (error) {
    res.status(500).send(error);
  } else {
    res.json(data);
  }
});

// Gets cosmetic adverse event data from openFDA
app.get('/api/fda', async (req, res) => {
  const search = req.query.search || 'skin';
  const url = `https://api.fda.gov/cosmetic/event.json?search=products.product_name:${search}&limit=10`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({
      message: 'Error getting FDA data',
      error: error.message,
    });
  }
});

app.listen(port, () => {
  console.log(`App is available on port: ${port}`);
});
