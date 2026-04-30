const { Alternatif, Kriteria } = require('../models');

module.exports = {
  index: async (req, res) => {
    try {
      // Mengambil jumlah data untuk ditampilkan di dashboard
      const totalAlternatif = await Alternatif.count();
      const totalKriteria = await Kriteria.count();

      res.render('dashboard', {
        title: 'Dashboard SPK SAW',
        totalAlternatif,
        totalKriteria
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("Terjadi kesalahan pada server");
    }
  }
};