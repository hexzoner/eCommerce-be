"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      INSERT INTO shapes (id, name, createdAt, updatedAt)
      VALUES (1, 'Default Style', NOW(), NOW())
      ON CONFLICT (id) DO NOTHING;
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("styles", { id: 1 }, {});
  },
};
