'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('kriteria', [
      {
        nama: 'Kepadatan',
        bobot: 0.30,
        tipe: 'benefit',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nama: 'Biaya Sewa',
        bobot: 0.25,
        tipe: 'cost',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nama: 'Aksessibilitas',
        bobot: 0.20,
        tipe: 'benefit',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nama: 'Tingkat Persaingan',
        bobot: 0.15,
        tipe: 'cost',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nama: 'Keamanan Lingkungan',
        bobot: 0.10,
        tipe: 'benefit',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Kriterias', null, {});
  }
};