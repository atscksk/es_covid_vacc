const express = require('express');
const router = express.Router();
const util = require('util')
const { getDataUsingSql, getDataQdsl } = require("./getdata");

router.get('/', async (req, res) => {
  res.render("charts");
});

router.post("/metric", async (req, res) => {
  const query1 = `
    SELECT MAX(people_vaccinated) AS total
    FROM "country-vaccinations"
    WHERE people_vaccinated>0
    GROUP BY country
    ORDER BY total DESC 
  `;
  const query2 = `
    SELECT MAX(people_fully_vaccinated) AS total
    FROM "country-vaccinations"
    WHERE people_fully_vaccinated>0 
    GROUP BY country
    ORDER BY total DESC 
  `;
  try {
    const data1 = await getDataUsingSql(query1);
    const data2 = await getDataUsingSql(query2);
    const sum1 = data1.rows.map(el => el[0]).reduce((a, b) => a + b);
    const sum2 = data2.rows.map(el => el[0]).reduce((a, b) => a + b);

    res.json([sum1, sum2]);
  } catch (err) {
    console.error(err);
  }
});

router.post("/pie", async (req, res) => {
  const query = `
    SELECT country, MAX(people_fully_vaccinated) AS total 
    FROM "country-vaccinations"
    WHERE people_fully_vaccinated>0 
    GROUP BY country
    ORDER BY total DESC 
  `;
  try {
    const data = await getDataUsingSql(query);

    const sortedData = data.rows.sort((a, b) => b[1] - a[1]);
    const pieData = sortedData.slice(0, 5);

    const total = sortedData.map(el => el[1]).reduce((a, b) => a + b);
    const other = total - (pieData.map(el => el[1]).reduce((a, b) => a + b));
    pieData.push(["other", other]);
    pieData.push(["total", total]);

    res.json(pieData)
  } catch (err) {
    console.error(err);
  }
});

router.post("/column", async (req, res) => {
  const query = `
    SELECT country, MAX(people_fully_vaccinated_per_hundred) as value
    FROM "country-vaccinations"
    WHERE people_fully_vaccinated_per_hundred > 0
    AND people_fully_vaccinated > 100000
    GROUP BY country
    ORDER BY value DESC
    LIMIT 10
  `;
  try {
    const data = await getDataUsingSql(query);
    const resData = data.rows.map(el => {
      return {
        name: el[0],
        y: el[1]
      }
    })
    res.json(resData);
  } catch (err) {
    console.error(err);
  }
});

router.post("/heatmap", async (req, res) => {
  const query = `
    SELECT location, vaccine, MAX(total_vaccinations)
    FROM "country-vaccinations-by-manufacturer"
    WHERE location='France'
    OR location='Germany'
    OR location='Italy'
    OR location='United States'
    GROUP BY location, vaccine
    ORDER BY location, vaccine 
  `;
  
  const query2 = {
    "aggs": {
      "unique": {
        "terms": {
          "field": "vaccine",
          "size": 100
        }
      }
    }
  }

  const query3 = {
    "aggs": {
      "unique": {
        "terms": {
          "field": "location",
          "size": 100
        }
      }
    }
  }
  
  try {
    const data = await getDataUsingSql(query);
    const data2 = await getDataQdsl("country-vaccinations-by-manufacturer", query2, "agg");
    const data3 = await getDataQdsl("country-vaccinations-by-manufacturer", query3, "agg");
    const vaccinated = data.rows;
    const manufacturer = data2.unique.buckets.map(el => el.key).filter(el => el !== "Sinovac").sort();
    const location = data3.unique.buckets.map(el => el.key).filter(el => {
      return (
        el === 'France' ||
        el === 'Germany' ||
        el === 'Italy' ||
        el === 'United States'
      );
    }).sort();

    const resultData = {
      vaccinated,
      manufacturer,
      location
    }
    res.json(resultData);
  } catch (err) {
    console.error(err);
  }
});

router.post("/line", async (req, res) => {
  try {
    const cQuery = `
      SELECT country, MAX(people_fully_vaccinated_per_hundred) as value
      FROM "country-vaccinations"
      WHERE people_fully_vaccinated_per_hundred > 0
      AND people_fully_vaccinated > 100000
      GROUP BY country
      ORDER BY value DESC
      LIMIT 5
    `;

    const cData = await getDataUsingSql(cQuery);
    const countries = cData.rows.map(el => el[0]);
    const condData = countries.map(el => {
      return {
        "match": {
          "country": el
        }
      }
    });

    const query = {
      "query": {
        "bool": {
          "should": condData
        }
      },
      "aggs": {
        "group_by_month": {
          "date_histogram": {
            "field": "date",
            "interval": "month"
          },
          "aggs": {
            "group_by_country": {
              "terms": {
                "field": "country"
              },
              "aggs": {
                "monthly_vaccinations_per_million": {
                  "sum": {
                    "field": "daily_vaccinations_per_million"
                  }
                }
              },
            },
          },
        }
      }
    }

    const data = await getDataQdsl("country-vaccinations", query, "agg");

    const groupByMonth = data["group_by_month"]["buckets"];
    const dateValue = groupByMonth.map(el => el["key_as_string"].split("-01T")[0]);

    const obj = {};
    groupByMonth.forEach(gbCountry => {
      const buckets = gbCountry["group_by_country"]["buckets"];
      buckets.forEach(data => {
        if (obj[data.key]) obj[data.key].push(data["monthly_vaccinations_per_million"]["value"]);
        else obj[data.key] = [data["monthly_vaccinations_per_million"]["value"]];
      })
    });

    for (let key in obj) {
      if (obj[key].length !== dateValue.length) {
        obj[key].unshift(0);
      }
    }

    const vaccinationData = [];
    for (let key in obj) {
      const dataObj = {};
      dataObj["name"] = key;
      dataObj["data"] = obj[key];
      vaccinationData.push(dataObj);
    }

    const resultData = {
      dateValue,
      vaccinationData
    }
    res.json(resultData);
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;