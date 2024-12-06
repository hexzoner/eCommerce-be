import { Sequelize } from "sequelize";
// const sequelize = new Sequelize(process.env.PG_URI);
const sequelize = new Sequelize(process.env.PG_URI, {
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // Ignore self-signed certificates
    },
  },
  pool: {
    max: 10, // maximum number of connections in the pool
    min: 0, // minimum number of connections in the pool
    acquire: 30000, // maximum time, in milliseconds, that pool will try to get a connection before throwing error
    idle: 10000, // maximum time, in milliseconds, that a connection can be idle before being released
  },
});

// await sequelize.query('ALTER TABLE "productPatterns" DROP CONSTRAINT IF EXISTS "productPatterns_name_key7"');
// sequelize.query('DELETE FROM "images" WHERE "patternId" IS NULL;');
// await sequelize.query('ALTER TABLE "cartProducts" DROP CONSTRAINT IF EXISTS "cartProducts_pkey"');
// await sequelize.query('ALTER TABLE "cartProducts" ADD CONSTRAINT "cartProducts_pkey" PRIMARY KEY ("productId", "userId", "patternId", "sizeId")');
// UPDATE products SET producerId = 1 WHERE producerId IS NULL;
// await sequelize.query('UPDATE "products" SET "producerId" = 1 WHERE "producerId" IS NULL');

// await sequelize.query('ALTER TABLE "orderProducts" DROP CONSTRAINT IF EXISTS "orderProducts_pkey"');
// await sequelize.query('ALTER TABLE "orderProducts" ADD CONSTRAINT "orderProducts_pkey" PRIMARY KEY ("productId", "orderId", "patternId", "sizeId")');
export default sequelize;
