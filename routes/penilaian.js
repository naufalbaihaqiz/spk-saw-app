const express = require('express');
const router = express.Router();
const PenilaianController = require('../controllers/PenilaianController');

// [GET] Rute untuk menampilkan halaman tabel matriks penilaian
router.get('/', PenilaianController.index);

// [POST] Rute untuk memproses data saat tombol "Simpan Semua Nilai" diklik
router.post('/simpan', PenilaianController.store);

// [GET] Rute BARU untuk memproses penghapusan nilai berdasarkan ID Alternatif
// Tanda ":id_alternatif" berfungsi menangkap angka ID dari URL (misal: /hapus/2)
router.get('/hapus/:id_alternatif', PenilaianController.destroy);

module.exports = router;