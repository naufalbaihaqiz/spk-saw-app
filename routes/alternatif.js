const express = require('express');
const router = express.Router();
const AlternatifController = require('../controllers/AlternatifController');

router.get('/', AlternatifController.index);
router.get('/tambah', AlternatifController.viewTambah);
router.post('/tambah', AlternatifController.store);
router.get('/edit/:id', AlternatifController.viewEdit);
router.post('/edit/:id', AlternatifController.update);
router.get('/hapus/:id', AlternatifController.destroy); // Menggunakan GET untuk kemudahan tombol hapus di EJS

module.exports = router;