const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const Cashflow = require('./routers/cashflowRouter');
const morgan = require('morgan');

const app = express();
const port = 3000;

mongoose.connect('mongodb://127.0.0.1:27017/bersamaMDB');
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Database connected...'))

app.use(express.json());
app.use(morgan('dev'));
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.use(express.static('publics'));
app.use(express.urlencoded({ extended: true }));


app.get('/', (req, res) => {
  res.render('index', {
    title: 'Home',
    layout: 'layouts/main-layouts',
    script: '',
    path: 'home',
  });
});

app.get('/about', (req, res) => {
  res.render('about', {
    title: 'About',
    layout: 'layouts/main-layouts',
    script: '',
    path: req.path.split('/')[1],
  });
});


app.use('/', Cashflow);


app.use('/', (req, res) => {
  res.send('Nothing here...');
});


app.listen(port, () => {
  console.log(`App run at http://localhost:${port}`);
});