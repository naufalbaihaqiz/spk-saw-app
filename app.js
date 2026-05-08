if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const express = require('express');
const app = express();
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const cookieParser = require('cookie-parser');

const alternatifRoutes = require('./routes/alternatif');
const kriteriaRoutes = require('./routes/kriteria');
const penilaianRoutes = require('./routes/penilaian');
const hasilRoutes = require('./routes/hasil');
const DashboardController = require('./controllers/DashboardController');
const AuthController = require('./controllers/AuthController');
const cekLogin = require('./middlewares/authMiddleware');

app.set('trust proxy', 1);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));
app.use(expressLayouts);
app.set('layout', 'layout');

app.get('/', (req, res) => res.redirect('/login'));
app.get('/login', AuthController.viewLogin);
app.post('/login', AuthController.login);
app.get('/logout', AuthController.logout);

app.get('/dashboard', cekLogin, DashboardController.index);
app.use('/alternatif', cekLogin, alternatifRoutes);
app.use('/kriteria', cekLogin, kriteriaRoutes);
app.use('/penilaian', cekLogin, penilaianRoutes);
app.use('/hasil', cekLogin, hasilRoutes);

module.exports = app;