// Load dotenv hanya untuk development lokal
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();

}
const express = require('express');
const app = express();
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');

// Import routes & controllers
const alternatifRoutes = require('./routes/alternatif');
const kriteriaRoutes = require('./routes/kriteria');
const penilaianRoutes = require('./routes/penilaian');
const hasilRoutes = require('./routes/hasil');
const DashboardController = require('./controllers/DashboardController');
const AuthController = require('./controllers/AuthController');
const cekLogin = require('./middlewares/authMiddleware');

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const pgSession = require('connect-pg-simple')(session);

app.use(session({
  store: new pgSession({
    conString: process.env.DATABASE_URL,
    tableName: 'session'
  }),
  secret: process.env.SESSION_SECRET || 'rahasia-spk-saw',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: 'lax'
  }
}));

app.use(express.static(path.join(__dirname, 'public')));

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));
app.use(expressLayouts);
app.set('layout', 'layout');

// Routes
app.get('/', (req, res) => res.redirect('/login'));
app.get('/login', AuthController.viewLogin);
app.post('/login', AuthController.login);
app.get('/logout', AuthController.logout);

app.get('/dashboard', cekLogin, DashboardController.index);
app.use('/alternatif', cekLogin, alternatifRoutes);
app.use('/kriteria', cekLogin, kriteriaRoutes);
app.use('/penilaian', cekLogin, penilaianRoutes);
app.use('/hasil', cekLogin, hasilRoutes);

// Export untuk Vercel (TIDAK pakai app.listen)
module.exports = app;

// Jalankan lokal jika bukan di Vercel
if (process.env.NODE_ENV !== 'production') {
  const db = require('./models');
  const PORT = 3000;
  db.sequelize.sync({ alter: true }).then(() => {
    console.log("✅ Database sinkron!");
    app.listen(PORT, () => console.log(`🚀 http://localhost:${PORT}`));
  }).catch(err => console.error("❌ Error:", err));
}