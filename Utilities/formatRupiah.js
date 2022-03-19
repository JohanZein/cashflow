const FormatRupiah = ((angka) => {
  return new Intl.NumberFormat(
    'id-ID',
    {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }
  ).format(angka);
});

module.exports = FormatRupiah;