const { Alternatif, Kriteria, Penilaian } = require('../models');

module.exports = {
  // 1. FUNGSI INDEX: Mengambil data dari database dan menampilkannya ke halaman EJS
  index: async (req, res) => {
    try {
      const alternatif = await Alternatif.findAll({
        include: [{ model: Penilaian, include: [Kriteria] }]
      });
      const kriteria = await Kriteria.findAll();
      
      res.render('penilaian', { title: 'Data Penilaian', alternatif, kriteria });
    } catch (error) {
      console.log(error);
      res.status(500).send("Error mengambil data penilaian");
    }
  },

  // 2. FUNGSI STORE: Membaca data matriks dari form dan menyimpannya ke database
  store: async (req, res) => {
    try {
      const bodyData = req.body; 

      // Looping semua data yang dikirim dari form
      for (const key in bodyData) {
        // Hanya proses input yang namanya berawalan "nilai_"
        if (key.startsWith('nilai_')) {
          
          // Memecah "nilai_1_2" menjadi ['nilai', '1', '2']
          const parts = key.split('_'); 
          const idAlt = parseInt(parts[1], 10);
          const idKrit = parseInt(parts[2], 10);
          let nilaiInput = bodyData[key];

          if (nilaiInput !== "" && nilaiInput !== null && nilaiInput !== undefined) {
            // Ubah koma jadi titik agar aman di database
            const floatNilai = parseFloat(nilaiInput.toString().replace(',', '.'));

            // Pastikan tidak ada angka NaN yang menyusup
            if (!isNaN(idAlt) && !isNaN(idKrit) && !isNaN(floatNilai)) {
              const existingPenilaian = await Penilaian.findOne({
                where: { id_alternatif: idAlt, id_kriteria: idKrit }
              });

              // Jika nilai sudah ada, timpa yang lama (Update)
              if (existingPenilaian) {
                await existingPenilaian.update({ nilai: floatNilai }); 
              // Jika belum ada, buat baru (Create)
              } else {
                await Penilaian.create({ id_alternatif: idAlt, id_kriteria: idKrit, nilai: floatNilai }); 
              }
            }
          }
        }
      }

      res.redirect('/penilaian');
    } catch (error) {
      console.error(error);
      res.status(500).send(`<b>DATABASE ERROR:</b> <br><br> ${error.message}`);
    }
  },

  // 3. FUNGSI DESTROY (BARU): Menghapus nilai satu alternatif dari database
  destroy: async (req, res) => {
    try {
      // Menangkap ID alternatif yang dikirim dari URL tombol hapus
      const { id_alternatif } = req.params;
      
      // Menghapus baris data di tabel 'penilaians' yang cocok dengan ID alternatif tersebut
      await Penilaian.destroy({
        where: { id_alternatif: id_alternatif }
      });

      // Setelah berhasil dihapus, refresh kembali ke halaman penilaian
      res.redirect('/penilaian');
    } catch (error) {
      console.error(error);
      res.status(500).send(`<b>DATABASE ERROR:</b> <br><br> ${error.message}`);
    }
  }
};