const dateFormat = require('dateformat');
const Cashflow = require('../models/cashflowModel');
const FormatRupiah = require('../Utilities/formatRupiah');

const now = new Date()

const index = (req, res) => {
  res.render('cashflow/index', {
    title: 'CashFlow',
    layout: 'layouts/main-layouts',
    script: '../cashflow/script',
    tanggal: dateFormat(now, "yyyy-mm-dd"),
    bulan: dateFormat(now, "yyyy-mm"),
    path: req.path.split('/')[1],
  });
  // console.log(dateFormat(now, "yyyy-mm-dd"));
};


const getCashflows = async (req, res) => {
  // console.log(new Date(req.body.tanggal * 1000).getMonth());
  const query = {
    tanggal: {
      $gt: req.body.bulanIni,
      $lt: req.body.bulanDepan,
    },
    nama: {
      $regex: req.body.search.value, $options: 'i'
    }
  };
  const cashflows = await Cashflow.find(query).limit(req.body.length).skip(req.body.start).sort({ tanggal: -1});
  const countFiltered = await Cashflow.find(query).count();
  const count = await Cashflow.count();

  let dataSource = Array();
  cashflows.forEach((dt, i) => {
    const kredit = () => {
      if (!dt.transaksi) return FormatRupiah(dt.jumlah);
      return '';
    };
    const debet = () => {
      if (dt.transaksi) return FormatRupiah(dt.jumlah);
      return '';
    };
    i++
    dataSource.push([
      parseInt(req.body.start) + i++,
      dateFormat(dt.tanggal * 1000, "dd-mm-yyyy"),
      dt.nama,
      `<span class="font-weight-bold text-success">${kredit()}</span>`,
      `<span class="font-weight-bold text-danger">${debet()}</span>`,
      '<div class="btn-group">' +
        `<button type="button" class="btn btn-sm btn-dark" onclick="detail_cashflow('${dt._id}')">Detail</button>` +
        `<button type="button" class="btn btn-sm btn-danger" onclick="delete_cashflow('${dt._id}')">Delete</button>` +
      '</div>'
    ]);
  });

  const dataTables = {
    draw: req.body.draw,
    recordsTotal: count,
    recordsFiltered: countFiltered,
    data: dataSource
  }
  res.json(dataTables);
};


const getCashflowById = async (req, res) => {
  // console.log(req.path);
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
    // if (req.body._id) console.log(req.body._id);
    // if (!req.body._id) console.log(req.body._id);
    const cashflows = await Cashflow.insertMany(req.body);
    res.status(201).json(cashflows);
    console.log('Saved...');
  } catch (error) {
    res.status(400).json({message: error.message});
  }
};


const updateCashflow = async (req, res) => {
  try {
    const cashflows = await Cashflow.updateOne(
      { _id: req.body._id },
      { $set: req.body }
    );
    console.log('Updated...');
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