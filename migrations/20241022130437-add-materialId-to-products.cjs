"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Check if the column already exists
    const [columns] = await queryInterface.sequelize.query(`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'products'
      AND column_name = 'materialId';
    `);

    if (columns.length > 0) {
      return;
    }

    // Step 1: Add the new column with a default value
    await queryInterface.addColumn("products", "materialId", {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "materials",
        key: "id",
      },
    });

    const [results] = await queryInterface.sequelize.query(`
      SELECT * FROM materials WHERE id = 1;
    `);

    if (results.length == 0) {
      // Insert a default material(id: 1)
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

    // Step 2: Update existing rows to set the default value
    await queryInterface.sequelize.query('UPDATE products SET "materialId" = 1 WHERE "materialId" IS NULL');

    // Step 3: Alter the column to make it non-nullable
    await queryInterface.changeColumn("products", "materialId", {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "materials",
        key: "id",
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("products", "materialId");
  },
};
