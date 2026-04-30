const cekLogin = (req, res, next) => {
    // Mengecek apakah ada userId di dalam session (yang kita set saat login sukses)
    if (req.session.userId) {
        next(); // Tanda pengenal valid! Persilakan masuk ke Controller.
    } else {
        // Tanda pengenal tidak ada! Lempar kembali ke halaman login.
        res.redirect('/login');
    }
};

module.exports = cekLogin;