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
};


const getCashflows = async (req, res) => {
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
  
  if (req.body.get == 'main') {
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
          `<button type="button" class="btn btn-sm btn-dark" data-update data-id="${dt._id}">Detail</button>` +
          `<button type="button" class="btn btn-sm btn-danger" data-delete data-id="${dt._id}">Delete</button>` +
        '</div>'
      ]);
    });
  };

  if (req.body.get == 'report') {
    cashflows.forEach((dt, i) => {
      const kredit = () => {
        if (!dt.transaksi) return dt.jumlah;
        return '';
      };
      const debet = () => {
        if (dt.transaksi) return dt.jumlah;
        return '';
      };
      i++
      dataSource.push([
        parseInt(req.body.start) + i++,
        dateFormat(dt.tanggal * 1000, "mm/dd/yyyy"),
        dt.nama,
        kredit(),
        debet(),
      ]);
    });
  };

  const dataTables = {
    draw: req.body.draw,
    recordsTotal: count,
    recordsFiltered: countFiltered,
    data: dataSource
  }
  res.json(dataTables);
};


const getCashflowById = async (req, res) => {
  // console.log(req.body);
  // console.log(req.path);
  try {
    const cashflows = await Cashflow.findOne({ _id: req.params.id });
    console.log(cashflows);
    if (!cashflows) res.status(400).json({message: 'Nothing found...'});
    if (cashflows) res.status(200).json(cashflows);
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message
    });
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
  console.log(req.body);
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