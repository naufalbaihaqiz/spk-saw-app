'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Penilaian extends Model {
    static associate(models) {
      // Penilaian terikat pada Alternatif dan Kriteria
      Penilaian.belongsTo(models.Alternatif, { foreignKey: 'id_alternatif' });
      Penilaian.belongsTo(models.Kriteria, { foreignKey: 'id_kriteria' });
    }
  }
  Penilaian.init({
    id_alternatif: DataTypes.INTEGER, // Menambahkan definisi foreign key agar aman
    id_kriteria: DataTypes.INTEGER,
    nilai: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'Penilaian',
  });
  return Penilaian;
};