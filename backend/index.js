import express from "express";
import { connectDB } from "../backend/db/connectDB.js";
import dotenv from "dotenv";
import authRouter from "../backend/routes/auth.route.js";

const app = express();
dotenv.config();
const PORT = process.env.PORT || 3000;


app.get("/", (req, res) => {
    res.send("Hello Worldieeeeeeeee");
})

app.use("/api/auth",authRouter)


app.listen(3000, () => {
    connectDB()
        .then(() => {
            console.log("MongoDB connected successfully");
        })
        .catch((err) => console.log("MonogoDB connection error: ",err));
    console.log(`Server is running on http://localhost:${PORT}`);
})

