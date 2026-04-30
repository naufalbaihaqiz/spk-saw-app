const { Alternatif } = require('../models');

module.exports = {
  index: async (req, res) => {
    try {
      const alternatif = await Alternatif.findAll();
      res.render('alternatif', { title: 'Data Alternatif', data: alternatif });
    } catch (error) {
      res.status(500).send("Error mengambil data alternatif");
    }
  },

  viewTambah: (req, res) => {
    res.render('tambah-alternatif', { title: 'Tambah Alternatif' });
  },

  store: async (req, res) => {
    try {
      // Sesuaikan req.body dengan field di migrasi/model Anda (misal: nama, keterangan)
      await Alternatif.create(req.body);
      res.redirect('/alternatif');
    } catch (error) {
      res.status(500).send("Error menyimpan data");
    }
  },

  // Asumsi ada view 'edit-alternatif.ejs'
  viewEdit: async (req, res) => {
    try {
      const { id } = req.params;
      const alternatif = await Alternatif.findByPk(id);
      res.render('edit-alternatif', { title: 'Edit Alternatif', data: alternatif });
    } catch (error) {
      res.status(500).send("Error mengambil data edit");
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;
      await Alternatif.update(req.body, { where: { id } });
      res.redirect('/alternatif');
    } catch (error) {
      res.status(500).send("Error update data");
    }
  },

  destroy: async (req, res) => {
    try {
      const { id } = req.params;
      await Alternatif.destroy({ where: { id } });
      res.redirect('/alternatif');
    } catch (error) {
      res.status(500).send("Error menghapus data");
    }
  }
};