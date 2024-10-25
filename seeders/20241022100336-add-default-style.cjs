"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Insert a default style (id: 1)

    const [results] = await queryInterface.sequelize.query(`
      SELECT * FROM styles WHERE id = 1;
    `);

    if (results.length > 0) {
      await queryInterface.bulkInsert("styles", [
        {
          id: 1,
          name: "Default Style",
          image: "https://placehold.co/400",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);
    }
  },

  async down(queryInterface, Sequelize) {
    // Remove this default style in a rollback
    await queryInterface.bulkDelete("styles", { id: 1 }, {});
  },
};
