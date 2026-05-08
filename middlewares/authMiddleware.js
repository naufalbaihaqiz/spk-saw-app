const jwt = require('jsonwebtoken'); 
const SECRET = process.env.SESSION_SECRET || 'rahasia-spk-saw'; 
 
const cekLogin = (req, res, next) => { 
  const token = req.cookies.token; 
  if (!token) return res.redirect('/login'); 
  try { 
    req.user = jwt.verify(token, SECRET); 
    next(); 
  } catch { 
    res.redirect('/login'); 
  } 
}; 
 
module.exports = cekLogin; 
