// =========================================================================
// 1. IMPORT MODELS
// Memanggil model Kriteria agar bisa melakukan operasi CRUD ke database.
// =========================================================================
const { Kriteria } = require('../models');

module.exports = {
  // =========================================================================
  // 2. FUNGSI INDEX (MENAMPILKAN DATA)
  // Mengambil semua data kriteria dari MySQL untuk ditampilkan di tabel.
  // =========================================================================
  index: async (req, res) => {
    try {
      const kriteria = await Kriteria.findAll();
      
      // Menghitung total bobot yang ada saat ini
      const totalRaw = await Kriteria.sum('bobot') || 0;
      // Dibulatkan 2 desimal untuk menghindari error floating point bawaan Javascript
      const totalBobot = parseFloat(totalRaw.toFixed(2)); 

      res.render('kriteria', { 
        title: 'Data Kriteria', 
        data: kriteria,
        totalBobot: totalBobot // Lempar nilai total bobot ke halaman EJS
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("Error mengambil data kriteria");
    }
  },

  // =========================================================================
  // 3. FUNGSI VIEW TAMBAH
  // Menampilkan halaman form untuk menambah kriteria baru.
  // =========================================================================
  viewTambah: (req, res) => {
    res.render('tambah-kriteria', { title: 'Tambah Kriteria' });
  },

  // =========================================================================
  // 4. FUNGSI STORE (SIMPAN DATA + VALIDASI TOTAL BOBOT)
  // Menghitung total bobot di database agar tidak melebihi angka 1.0.
  // =========================================================================
  store: async (req, res) => {
    try {
      const { nama, bobot, tipe } = req.body;
      const bobotBaru = parseFloat(bobot) || 0;

      // HITUNG TOTAL: Ambil dari database lalu bulatkan untuk menghindari Floating Point Error
      const totalRaw = await Kriteria.sum('bobot') || 0;
      const totalBobotSekarang = parseFloat(totalRaw.toFixed(2)); // Akan menjadi pas 0.80

      // Prediksi total jika data baru ditambahkan (dibulatkan lagi biar aman)
      const prediksiTotal = parseFloat((totalBobotSekarang + bobotBaru).toFixed(2));

      // VALIDASI: Jika prediksi total > 1.0, maka batalkan
      if (prediksiTotal > 1.0) {
        const sisaKuota = (1.0 - totalBobotSekarang).toFixed(2);
        
        // Kirim respon balik berupa script alert agar user tahu alasannya
        return res.status(400).send(`
          <script>
            alert("GAGAL SIMPAN! Total bobot kriteria tidak boleh melebihi 1.0.\\n\\nTotal saat ini: ${totalBobotSekarang}\\nSisa kuota bobot yang tersedia: ${sisaKuota}");
            window.location.href = "/kriteria";
          </script>
        `);
      }

      // EKSEKUSI: Jika lolos validasi, simpan data ke database
      await Kriteria.create({ nama, bobot: bobotBaru, tipe });
      res.redirect('/kriteria');

    } catch (error) {
      console.error(error);
      res.status(500).send("Error menyimpan kriteria");
    }
  },

  // =========================================================================
  // 5. FUNGSI DESTROY (HAPUS DATA)
  // Menghapus kriteria berdasarkan ID yang dipilih.
  // =========================================================================
  destroy: async (req, res) => {
    try {
      const { id } = req.params;
      await Kriteria.destroy({ where: { id } });
      res.redirect('/kriteria');
    } catch (error) {
      console.error(error);
      res.status(500).send("Error menghapus kriteria");
    }
  }

  // Tips: Jika kamu membuat fungsi Update, pastikan pakai logika:
  // (Total_Sekarang - Bobot_Lama_Data_Ini + Bobot_Baru_Input) <= 1.0
};