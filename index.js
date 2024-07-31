import express from "express";
import cors from "cors";
import errorHandler from "./middleware/errorHandler.js";
import userRouter from "./routes/userRoutes.js";
import categoryRouter from "./routes/categoryRoutes.js";
import productRouter from "./routes/productRoutes.js";
import orderRouter from "./routes/orderRoutes.js";

const app = express();
export const port = process.env.PORT || 3030;

app.use(cors());
app.use(express.json());

app.use("/users", userRouter);
app.use("/categories", categoryRouter);
app.use("/products", productRouter);
app.use("/orders", orderRouter);

app.use(errorHandler);

app.listen(port, () => console.log(`Server is running on port ${port}`));
