import express from 'express';
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { studyApp } from './APIs/studyapi.js'; 
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env variables
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Route
app.use("/study-api", studyApp);

// DB connection and server start
async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/study_db");
        console.log("Database connected");
        const port = process.env.PORT || 4000;
        app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
    } catch (err) {
        console.log("Database error:", err);
    }
}
connectDB();
