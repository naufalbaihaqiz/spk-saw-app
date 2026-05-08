const { User } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const SECRET = process.env.SESSION_SECRET || 'rahasia-spk-saw';

module.exports = {
  viewLogin: (req, res) => {
    res.render('login', { layout: false, error: null });
  },

  login: async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ where: { username } });
      if (!user) return res.render('login', { layout: false, error: 'Username tidak ditemukan!' });

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) return res.render('login', { layout: false, error: 'Password salah!' });

      const token = jwt.sign({ userId: user.id, username: user.username }, SECRET, { expiresIn: '24h' });
      res.cookie('token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 24 * 60 * 60 * 1000
      });
      res.redirect('/dashboard');
    } catch (error) {
      console.error(error);
      res.render('login', { layout: false, error: 'Terjadi kesalahan sistem.' });
    }
  },

  logout: (req, res) => {
    res.clearCookie('token');
    res.redirect('/login');
  }
};