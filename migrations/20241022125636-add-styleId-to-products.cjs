"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Check if the column already exists
    const [columns] = await queryInterface.sequelize.query(`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'products'
      AND column_name = 'styleId';
    `);

    if (columns.length > 0) {
      return;
    }

    // Step 1: Add the new column with a default value
    await queryInterface.addColumn("products", "styleId", {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "styles",
        key: "id",
      },
    });

    const [results] = await queryInterface.sequelize.query(`
      SELECT * FROM styles WHERE id = 1;
    `);

    if (results.length == 0) {
      // Insert a default style(id: 1)
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

    // Step 2: Update existing rows to set the default value
    await queryInterface.sequelize.query('UPDATE products SET "styleId" = 1 WHERE "styleId" IS NULL');

    // Step 3: Alter the column to make it non-nullable
    await queryInterface.changeColumn("products", "styleId", {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "styles",
        key: "id",
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("products", "styleId");
  },
};
