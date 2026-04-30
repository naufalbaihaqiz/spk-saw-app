'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Kriteria extends Model {
    static associate(models) {
      // Satu Kriteria memiliki banyak Penilaian
      Kriteria.hasMany(models.Penilaian, { foreignKey: 'id_kriteria', onDelete: 'CASCADE' });
    }
  }
  Kriteria.init({
    nama: DataTypes.STRING,
    bobot: DataTypes.FLOAT,
    tipe: DataTypes.STRING // "benefit" atau "cost"
  }, {
    sequelize,
    modelName: 'Kriteria',
  });
  return Kriteria;
};