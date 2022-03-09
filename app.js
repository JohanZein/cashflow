const express = require('express');
// const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const Cashflow = require('./routers/cashflowRouter');

const app = express();
const port = 3000;

mongoose.connect('mongodb://127.0.0.1:27017/bersamaMDB');
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Database connected...'))

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Landing page...');
});

app.use('/', Cashflow);

app.use('/', (req, res) => {
  res.send('Nothing here...');
});



app.listen(port, () => {
  console.log(`App run at http://localhost:${port}`);
});