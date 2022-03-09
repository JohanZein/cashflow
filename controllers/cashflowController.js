const Cashflow = require('../models/cashflowModel');


const getCashflows = async (req, res) => {
  const cashflows = await Cashflow.find();
  res.render('cashflow', {
    title: 'CashFlow',
    layout: 'layouts/main-layouts',
    cashflows
  });
};


const getCashflowById = async (req, res) => {
  try {
    const cashflows = await Cashflow.findOne({_id: req.params.id});
    if (!cashflows) res.status(400).send('Nothing found...');
    if (cashflows) res.status(200).json(cashflows);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
};


const saveCashflow = async (req, res) => {
  try {
    const cashflows = await Cashflow.insertMany(req.body);
    res.status(201).json(cashflows);
  } catch (error) {
    res.status(400).json({message: error.message});
  }
};


const updateCashflow = async (req, res) => {
  try {
    const cashflows = await Cashflow.updateOne(
      {_id: req.params.id},
      {$set: req.body}
    );
    res.status(200).json(cashflows);
  } catch (error) {
    res.status(400).json({message: error.message});
  }
};


const deleteCashflow = async (req, res) => {
  try {
    const cashflows = await Cashflow.findOne({_id: req.params.id});
    if (!cashflows) res.status(400).send('Nothing found...');
    if (cashflows) {
      const deleteData = await Cashflow.deleteOne({_id: req.params.id});
      res.status(200).json(deleteData);
    }
  } catch (error) {
    res.status(500).json({message: error.message});
  }
};


module.exports = {
  getCashflows,
  getCashflowById,
  saveCashflow,
  updateCashflow,
  deleteCashflow
};