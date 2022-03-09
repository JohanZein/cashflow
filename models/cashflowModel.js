const mongoose = require('mongoose');


const Cashflow = mongoose.model('Cashflow', {
  tanggal: {
    type: Number,
    require: true
  },
  nama: {
    type: String,
    require: true
  },
  transaksi: {
    type: Boolean,
    require: true
  },
  jumlah:{
    type: Number,
    require: true
  }
});


module.exports = Cashflow;