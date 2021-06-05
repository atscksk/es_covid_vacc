const express = require('express');
const router = express.Router();

const { getDataUsingSql } = require("./getdata");

router.get('/', async (req, res) => {
  res.render("worldmap");
});

router.post('/mapdata', async (req, res) => {
  const { param } = req.body;
  const colname = param === "pv" ? "people_vaccinated" : (param === "pfv" ? "people_fully_vaccinated" : "total_vaccinations");

  const query = `
    SELECT country, iso_code, MAX(${colname}_per_hundred) AS value
    FROM "country-vaccinations"
    GROUP BY country, iso_code
  `;
  try {
    const data = await getDataUsingSql(query);
    const resultData = data.rows.map(el => {
      return {
        name: el[0],
        code: el[1],
        value: el[2] || 0,
      }
    })
    res.json(resultData)
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;