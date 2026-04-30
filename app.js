console.log("🚀 MENGINISIALISASI APLIKASI SPK SAW (MVC PATTERN)...")

// =========================================================================
// 1. IMPORT MODULE UTAMA
// Bagian ini memuat library/modul dasar yang dibutuhkan aplikasi untuk berjalan.
// =========================================================================
const express = require('express');
const app = express();
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');

// =========================================================================
// 2. IMPORT DATABASE & MODELS
// Memanggil konfigurasi database dan semua model (tabel) yang sudah dibuat.
// =========================================================================
const db = require('./models');

// =========================================================================
// 3. IMPORT ROUTES & CONTROLLERS
// Memanggil file-file pengatur jalur URL (routes) dan logika (controllers).
// =========================================================================
const alternatifRoutes = require('./routes/alternatif');
const kriteriaRoutes = require('./routes/kriteria');
const penilaianRoutes = require('./routes/penilaian');
const hasilRoutes = require('./routes/hasil');
const DashboardController = require('./controllers/DashboardController');
const AuthController = require('./controllers/AuthController');
const cekLogin = require('./middlewares/authMiddleware');

// =========================================================================
// 4. PENGATURAN MIDDLEWARE
// Middleware adalah penengah yang memproses data sebelum masuk ke Controller.
// =========================================================================
// Membaca data yang dikirim dari form HTML (application/x-www-form-urlencoded)
app.use(express.urlencoded({ extended: true }));
// Membaca data berformat JSON
app.use(express.json());

// Konfigurasi Session untuk menyimpan data sementara (berguna untuk fitur login nanti)
app.use(session({
  secret: 'rahasia-spk-saw', // Kunci rahasia untuk enkripsi session
  resave: false,
  saveUninitialized: true
}));

// Menentukan folder 'public' sebagai tempat file statis (CSS custom, gambar, JS)
app.use(express.static(path.join(__dirname, 'public')));

// =========================================================================
// 5. PENGATURAN VIEW ENGINE (TAMPILAN)
// Mengatur EJS sebagai mesin pembuat halaman HTML dinamis.
// =========================================================================
app.set('view engine', 'ejs'); // Menetapkan EJS sebagai template engine
app.set('views', path.join(__dirname, 'src/views')); // Menentukan lokasi folder views
app.use(expressLayouts); // Mengaktifkan fitur layout (kerangka utama)
app.set('layout', 'layout'); // Menetapkan file 'layout.ejs' sebagai kerangka bawaan


// =========================================================================
// 6. DAFTAR URL (ROUTING)
// Menghubungkan URL yang diketik di browser dengan file route/controller.
// =========================================================================
// --- RUTE PUBLIK (Bebas diakses tanpa login) ---

// Halaman utama langsung dilempar ke form login
app.get('/', (req, res) => {
    res.redirect('/login'); 
});

// Menampilkan halaman form login
app.get('/login', AuthController.viewLogin);

// Memproses inputan form login
app.post('/login', AuthController.login);

// Logout
app.get('/logout', AuthController.logout);


// --- RUTE PRIVAT (Dijaga Satpam Middleware 'cekLogin') ---

// Halaman Dashboard
app.get('/dashboard', cekLogin, DashboardController.index);

// Pengelompokan URL ke rute masing-masing fitur
app.use('/alternatif', cekLogin, alternatifRoutes); // Semua URL yang diawali /alternatif diurus oleh alternatifRoutes
app.use('/kriteria', cekLogin, kriteriaRoutes);     // Semua URL yang diawali /kriteria diurus oleh kriteriaRoutes
app.use('/penilaian', cekLogin, penilaianRoutes);   // Semua URL yang diawali /penilaian diurus oleh penilaianRoutes
app.use('/hasil', cekLogin, hasilRoutes);           // Semua URL yang diawali /hasil diurus oleh hasilRoutes

// =========================================================================
// 7. SINKRONISASI DATABASE & JALANKAN SERVER
// Mengecek database MySQL, memperbarui tabel jika ada perubahan, lalu menyalakan server.
// =========================================================================
const PORT = 3000;

// db.sequelize.sync({ alter: true }) akan otomatis menambah/mengubah kolom 
// di database MySQL agar sama persis dengan definisi di folder /models
db.sequelize.sync({ alter: true }).then(() => {
  console.log("✅ Database berhasil disinkronisasi!");
  
  // Menyalakan server Express setelah database siap
  app.listen(PORT, () => {
    console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
  });
  
}).catch(err => {
  console.error("❌ Gagal sinkronisasi database:", err);
});

