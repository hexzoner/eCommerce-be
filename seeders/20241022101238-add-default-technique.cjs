"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Insert a default technique (id: 1)

    const [results] = await queryInterface.sequelize.query(`
      SELECT * FROM techniques WHERE id = 1;
    `);

    if (results.length > 0) {
      await queryInterface.bulkInsert("techniques", [
        {
          id: 1,
          name: "Default Technique",
          image: "https://placehold.co/400",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);
    }
  },

  async down(queryInterface, Sequelize) {
    // Remove this default technique in a rollback
    await queryInterface.bulkDelete("techniques", { id: 1 }, {});
  },
};
