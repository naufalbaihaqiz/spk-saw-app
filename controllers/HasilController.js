const { Alternatif, Kriteria, Penilaian } = require('../models');

module.exports = {
  hitungSAW: async (req, res) => {
    try {
      const semuaKriteria = await Kriteria.findAll();
      const semuaAlternatif = await Alternatif.findAll({
        include: [{ model: Penilaian }]
      });

      // PENCEGAHAN ERROR: Jika data kriteria atau alternatif masih kosong
      if (semuaKriteria.length === 0 || semuaAlternatif.length === 0) {
        return res.render('hasil', { 
          title: 'Hasil Perhitungan SAW', 
          hasil: [],
          kriteria: semuaKriteria
        });
      }

      // 1. Mencari Nilai Max & Min per Kriteria
      let nilaiMaxMin = {};
      semuaKriteria.forEach(k => {
        let nilaiArray = [];
        semuaAlternatif.forEach(a => {
          let nilaiData = a.Penilaians.find(p => p.id_kriteria === k.id);
          // Pastikan nilai tidak kosong sebelum dimasukkan ke array
          if (nilaiData && nilaiData.nilai !== null && nilaiData.nilai !== undefined) {
            nilaiArray.push(parseFloat(nilaiData.nilai));
          }
        });

        if (nilaiArray.length > 0) {
          nilaiMaxMin[k.id] = {
            max: Math.max(...nilaiArray),
            min: Math.min(...nilaiArray)
          };
        }
      });

      // 2. Normalisasi & 3. Perangkingan
      let hasilRanking = [];

      semuaAlternatif.forEach(a => {
        let totalSkor = 0;
        let detailNormalisasi = {};

        semuaKriteria.forEach(k => {
          let nilaiData = a.Penilaians.find(p => p.id_kriteria === k.id);
          let nilaiAsli = nilaiData ? parseFloat(nilaiData.nilai) : 0;
          let nilaiNormalisasi = 0;

          // PENCEGAHAN ERROR: Memastikan k.tipe terbaca (benefit/cost)
          if (nilaiMaxMin[k.id]) {
            let tipeAtribut = k.tipe ? k.tipe.toLowerCase() : 'benefit'; 
            
            if (tipeAtribut === 'benefit') {
              // Jika nilai max 0, hindari pembagian dengan 0
              nilaiNormalisasi = nilaiMaxMin[k.id].max === 0 ? 0 : (nilaiAsli / nilaiMaxMin[k.id].max);
            } else if (tipeAtribut === 'cost') {
              // Jika nilai asli 0, hindari pembagian dengan 0
              nilaiNormalisasi = nilaiAsli === 0 ? 0 : (nilaiMaxMin[k.id].min / nilaiAsli);
            }
          }

          detailNormalisasi[k.id] = nilaiNormalisasi;
          
          // Mengalikan hasil normalisasi dengan bobot kriteria
          let bobot = k.bobot ? parseFloat(k.bobot) : 0;
          totalSkor += (nilaiNormalisasi * bobot);
        });

        hasilRanking.push({
          id_alternatif: a.id,
          nama: a.nama,
          skor_akhir: totalSkor,
          detail: detailNormalisasi
        });
      });

      // Mengurutkan dari skor terbesar ke terkecil
      hasilRanking.sort((a, b) => b.skor_akhir - a.skor_akhir);

      // Melempar data ke views hasil.ejs
      res.render('hasil', { 
        title: 'Hasil Perhitungan SAW', 
        hasil: hasilRanking,
        kriteria: semuaKriteria
      });

    } catch (error) {
      // Menampilkan detail error di terminal agar mudah dilacak
      console.error("\n=== DETAIL ERROR HITUNG SAW ===");
      console.error(error);
      console.error("===============================\n");
      
      // Menampilkan error detail di browser (bukan error generik lagi)
      res.status(500).send(`Error pada proses perhitungan algoritma SAW: <br> <b>${error.message}</b>`);
    }
  }
};