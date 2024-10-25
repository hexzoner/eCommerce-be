"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Insert a default material(id: 1)

    const [results] = await queryInterface.sequelize.query(`
      SELECT * FROM materials WHERE id = 1;
    `);

    if (results.length > 0) {
      await queryInterface.bulkInsert("materials", [
        {
          id: 1,
          name: "Default Material",
          image: "https://placehold.co/400",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);
    }
  },

  async down(queryInterface, Sequelize) {
    // Temove this default material in a rollback
    await queryInterface.bulkDelete("materials", { id: 1 }, {});
  },
};
