'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Alternatif extends Model {
    static associate(models) {
      // Satu Alternatif memiliki banyak Penilaian
      Alternatif.hasMany(models.Penilaian, { foreignKey: 'id_alternatif', onDelete: 'CASCADE' });
    }
  }
  Alternatif.init({
    nama: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Alternatif',
  });
  return Alternatif;
};