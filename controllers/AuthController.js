const { User } = require('../models');
const bcrypt = require('bcryptjs'); 

module.exports = {
  viewLogin: (req, res) => {
    // 1. Tambahkan layout: false agar tidak dibungkus sidebar
    // 2. Tambahkan error: null agar variabel error di ejs tidak undefined
    res.render('login', { layout: false, error: null });
  },

  login: async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ where: { username } });

      if (!user) {
        // Jangan pakai res.send, tapi kembalikan ke halaman login beserta pesan error
        return res.render('login', { layout: false, error: 'Username tidak ditemukan!' });
      }

      // AKTIFKAN BCRYPT! Karena password di database dari Seeder tadi sudah teracak
      const isValid = await bcrypt.compare(password, user.password); 

      if (isValid) {
        // Set session
        req.session.userId = user.id;
        // Boleh ditambah flag ini biar lebih aman
        req.session.isLoggedIn = true; 
        
        res.redirect('/dashboard');
      } else {
        // Tampilkan pesan error di form login
        return res.render('login', { layout: false, error: 'Password salah!' });
      }
    } catch (error) {
      console.error(error);
      res.render('login', { layout: false, error: 'Terjadi kesalahan sistem.' });
    }
  },

  logout: (req, res) => {
    req.session.destroy();
    res.redirect('/login');
  }
};