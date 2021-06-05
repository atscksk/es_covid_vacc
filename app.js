const express = require('express');
const path = require('path');

const charts = require('./routes/charts');
const map = require('./routes/map');
const table = require('./routes/table');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', charts);
app.use('/map', map);
app.use('/table', table);

app.listen(3000, () => {
  console.log('server started on port 3000');
});