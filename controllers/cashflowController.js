const Cashflow = require('../models/cashflowModel');

const index = (req, res) => {
  res.render('cashflow/index', {
    title: 'CashFlow',
    layout: 'layouts/main-layouts',
    script: '../cashflow/script',
    path: req.path.split('/')[1],
  });
};


const getCashflows = async (req, res) => {
  const query = {
    nama: {
      $regex: req.body.search.value, $options: 'i'
    }
  };
  const cashflows = await Cashflow.find(query);
  const countFiltered = await Cashflow.find(query).count();
  const count = await Cashflow.count();

  let dataSource = Array();
  cashflows.forEach((dt, i) => { i++
    dataSource.push([
      i++,
      dt.nama,
      dt.transaksi,
      dt.jumlah,
      dt.jumlah
    ]);
  });

  const dataTables = {
    recordsTotal: count,
    recordsFiltered: countFiltered,
    data: dataSource
  }
  res.json(dataTables);
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
  index,
  getCashflows,
  getCashflowById,
  saveCashflow,
  updateCashflow,
  deleteCashflow
};