const express = require('express');
const Cashflows = require('../controllers/cashflowController');

const router = express.Router();


router.get('/cashflow', Cashflows.index);
router.get('/cashflow/:id', Cashflows.getCashflowById);
router.post('/cashflow/dt', Cashflows.getCashflows);
// router.post('/cashflow', Cashflows.saveCashflow);
// router.put('/cashflow/:id', Cashflows.updateCashflow);
// router.delete('/cashflow/:id', Cashflows.deleteCashflow);


module.exports = router;