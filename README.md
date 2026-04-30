Anggota Kelompok :
Naufal Baihaqi Zachwan (2411522025)
Ghezy Pramudinata Briliantama (2411522036)
Daffa Valiant Hansen (2411523004)


Langkah menjalankan program:

-pastikan sudah menginstall Node.js

-kami menggunakan MySQL melalui XAMPP untuk database (pastikan module MySQL sudah di-Start)

-buka phpMyAdmin dan buat database dengan nama 'spk_saw'

-buka terminal (rekomendasi gunakan CMD) pada folder project, lalu jalankan npm install untuk mengunduh semua library yang dibutuhkan

-sesuaikan username dan password pada file config (folder config/config.json) sesuai dengan pengaturan database Anda

-jalankan npm run migrate pada terminal untuk sinkronisasi tabel database

-setelah itu jalankan npm run dev untuk menyalakan server

-buka browser dan akses http://localhost:3000

-masuk ke menu Data Kriteria, lalu isi data kriteria (pastikan total keseluruhan bobot harus pas bernilai 1.0)

-masuk ke menu Data Alternatif, lalu isi data nama-nama alternatif yang akan dinilai

-masuk ke menu Penilaian, lalu isi angka pada matriks penilaian (skala 1 sampai 5) untuk semua alternatif

-terakhir, masuk ke menu Hasil Ranking untuk melihat urutan rekomendasi terbaik dari perhitungan SAW dan klik tombol "Pilih" pada sistem untuk menetapkan keputusan akhir