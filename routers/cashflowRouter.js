const express = require('express');
const Cashflows = require('../controllers/cashflowController');

const router = express.Router();

// router.get('/', (req, res) => {
//   res.redirect('/cashflow');
// });


// router.post('/', (req, res) => {
//   res.send('Welcome post');
// });


router.get('/cashflow', Cashflows.getCashflows);
router.get('/cashflow/:id', Cashflows.getCashflowById);
router.post('/cashflow', Cashflows.saveCashflow);
router.put('/cashflow/:id', Cashflows.updateCashflow);
router.delete('/cashflow/:id', Cashflows.deleteCashflow);


module.exports = router;