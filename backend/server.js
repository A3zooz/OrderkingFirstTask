import express from "express";
import cors from "cors";
import qrRoutes from "./routes/qr.js";
import authRoutes from "./routes/auth.js";
import dotenv from "dotenv";
import errorHandler from "./middleware/errorHandler.js";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/qr", qrRoutes);
const PORT = process.env.PORT || 5000;
app.use(errorHandler);
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

export default app;