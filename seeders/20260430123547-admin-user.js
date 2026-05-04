const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hashedPassword = await bcrypt.hash('kelompok2', 10);
    await queryInterface.bulkInsert('Users', [{
      username: 'admin',
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {});
  }
};