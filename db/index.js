import { Sequelize } from "sequelize";
// const sequelize = new Sequelize(process.env.PG_URI);
const sequelize = new Sequelize(process.env.PG_URI, {
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      //   rejectUnauthorized: false, // Ignore self-signed certificates
    },
  },
});

// await sequelize.query('ALTER TABLE "productPatterns" DROP CONSTRAINT IF EXISTS "productPatterns_name_key7"');
// sequelize.query('DELETE FROM "images" WHERE "patternId" IS NULL;');
await sequelize.query('ALTER TABLE "cartProducts" DROP CONSTRAINT IF EXISTS "cartProducts_pkey"');
await sequelize.query('ALTER TABLE "cartProducts" ADD CONSTRAINT "cartProducts_pkey" PRIMARY KEY ("productId", "userId", "patternId", "sizeId")');
// UPDATE products SET producerId = 1 WHERE producerId IS NULL;
// await sequelize.query('UPDATE "products" SET "producerId" = 1 WHERE "producerId" IS NULL');
export default sequelize;
