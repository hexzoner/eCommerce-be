import express from "express";
import cors from "cors";
import errorHandler from "./middleware/errorHandler.js";
import userRouter from "./routes/userRoutes.js";
import categoryRouter from "./routes/categoryRoutes.js";
import productRouter from "./routes/productRoutes.js";
import orderRouter from "./routes/orderRoutes.js";
import authRouter from "./routes/authRoutes.js";
import colorRouter from "./routes/colorRoutes.js";
import wishlistRouter from "./routes/wishlistRoutes.js";
import sizeRouter from "./routes/sizesRoutes.js";
import cartRouter from "./routes/cartRoutes.js";
import reviewRouter from "./routes/reviewRoutes.js";
import latestArrivalRouter from "./routes/latestArrivalsRoutes.js";
import producerRouter from "./routes/producerRoutes.js";
import shapeRouter from "./routes/shapesRoutes.js";
import materialRouter from "./routes/materialRoutes.js";
import techniqueRouter from "./routes/techniqueRoutes.js";
import styleRouter from "./routes/stylesRoutes.js";

const app = express();
export const port = process.env.PORT || 3030;

app.use(cors());
app.use(express.json());

app.use("/users", userRouter);
app.use("/categories", categoryRouter);
app.use("/colors", colorRouter);
app.use("/products", productRouter);
app.use("/orders", orderRouter);
app.use("/auth", authRouter);
app.use("/sizes", sizeRouter);
app.use("/wishlist", wishlistRouter);
app.use("/cart", cartRouter);
app.use("/reviews", reviewRouter);
app.use("/latest", latestArrivalRouter);
app.use("/producers", producerRouter);
app.use("/shapes", shapeRouter);
app.use("/materials", materialRouter);
app.use("/techniques", techniqueRouter);
app.use("/styles", styleRouter);

app.use(errorHandler);

app.listen(port, () => console.log(`Server is running on port ${port}`));
