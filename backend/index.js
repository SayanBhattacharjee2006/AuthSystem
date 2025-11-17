import express from "express";
import { connectDB } from "../backend/db/connectDB.js";
import dotenv from "dotenv";
import authRouter from "../backend/routes/auth.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
dotenv.config();
const PORT = process.env.PORT || 8000;


app.get("/", (req, res) => {
    res.send("Hello Worldieeeeeeeee");
})

// cors
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))
app.use(express.json());
app.use(cookieParser())

app.use("/api/auth",authRouter)


app.listen(PORT, () => {
    connectDB()
        .then(() => {
            console.log("MongoDB connected successfully");
        })
        .catch((err) => console.log("MonogoDB connection error: ",err));
    console.log(`Server is running on http://localhost:${PORT}`);
})

