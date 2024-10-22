"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const [results] = await queryInterface.sequelize.query(`
      SELECT * FROM shapes WHERE id = 1;
    `);

    if (results.length > 0) {
      // Insert a default shape(id: 1)
      await queryInterface.bulkInsert("shapes", [
        {
          id: 1,
          name: "Default Shape",
          image: "https://placehold.co/400",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);
    }
  },

  async down(queryInterface, Sequelize) {
    // Temove this default shape in a rollback
    await queryInterface.bulkDelete("shapes", { id: 1 }, {});
  },
};
