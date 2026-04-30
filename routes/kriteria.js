const express = require('express');
const router = express.Router();
const KriteriaController = require('../controllers/KriteriaController');

router.get('/', KriteriaController.index);
router.get('/tambah', KriteriaController.viewTambah);
router.post('/tambah', KriteriaController.store);
router.get('/hapus/:id', KriteriaController.destroy);
// Tambahkan route edit sama seperti alternatif jika diperlukan

module.exports = router;