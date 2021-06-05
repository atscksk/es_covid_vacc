const { Client } = require('@elastic/elasticsearch');
const client = new Client({ node: 'http://localhost:9200' });

exports.getDataUsingSql = async (query, size) => {
  const { body } = await client.sql.query({
    body: {
      query,
      fetch_size: size ? size : 1000
    }
  });
  return body;
};

exports.getDataQdsl = async (index, obj, type) => {
  const { body } = await client.search({
    index,
    body: obj
  });
  if (type === "agg") {
    return body.aggregations;
  }
  return body.hits.hits;
};