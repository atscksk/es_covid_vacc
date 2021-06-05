const express = require('express');
const router = express.Router();

const { getDataUsingSql } = require("./getdata");

router.get('/', async (req, res) => {
  res.render("table");
});

router.post('/records', async (req, res) => {
  const { param } = req.body;
  const query = `
    SELECT 
      date,
      country,
      daily_vaccinations,
      daily_vaccinations_per_million,
      vaccines
    FROM "country-vaccinations"
    WHERE country='${param}'
  `;
  try {
    const data = await getDataUsingSql(query, 10000);
    res.json(data)
  } catch (err) {
    console.error(err);
  }
});


router.post('/countries', async (req, res) => {
  const query = `
    SELECT country, COUNT(*)
    FROM "country-vaccinations"
    GROUP BY country
  `;
  try {
    const data = await getDataUsingSql(query);
    const resultData = data.rows.map(el => el[0]);
    res.json(resultData)
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;