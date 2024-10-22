"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Step 1: Add the new column with a default value
    await queryInterface.addColumn("products", "styleId", {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "styles",
        key: "id",
      },
      defaultValue: 1,
    });

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
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
    await queryInterface.removeColumn("products", "styleId");
     */
  },
};
