"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Step 1: Add the new column with a default value
    await queryInterface.addColumn("products", "shapeId", {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "shapes",
        key: "id",
      },
    });

    const [results] = await queryInterface.sequelize.query(`
      SELECT * FROM shapes WHERE id = 1;
    `);

    if (results.length == 0) {
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

    // Step 2: Update existing rows to set the default value
    await queryInterface.sequelize.query('UPDATE products SET "shapeId" = 1 WHERE "shapeId" IS NULL');

    // Step 3: Alter the column to make it non-nullable
    await queryInterface.changeColumn("products", "shapeId", {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "styles",
        key: "id",
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("products", "shapeId");
  },
};
