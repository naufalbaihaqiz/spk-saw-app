const { User } = require('../models');
const bcrypt = require('bcryptjs'); 

module.exports = {
  viewLogin: (req, res) => {
    res.render('login', { layout: false, error: null });
  },

  login: async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ where: { username } });

      if (!user) {
        return res.render('login', { layout: false, error: 'Username tidak ditemukan!' });
      }

      const isValid = await bcrypt.compare(password, user.password); 

      if (isValid) {
        req.session.userId = user.id;
        req.session.isLoggedIn = true;
        
        // Paksa save session sebelum redirect
        req.session.save((err) => {
          if (err) {
            console.error('Session save error:', err);
            return res.render('login', { layout: false, error: 'Terjadi kesalahan sistem.' });
          }
          res.redirect('/dashboard');
        });

      } else {
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