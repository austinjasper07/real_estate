import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from "./routes/auth_route.js"
import cookieParser from 'cookie-parser';
import cors from "cors";

dotenv.config();


const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());

// CORS configuration
// Basic CORS setup
app.use(cors({
    origin: "http://localhost:5173", // Client URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept", "Origin"],
    credentials: true,
}));

// Handle preflight requests for all routes
app.options('*', cors());
// app.use(cors()) // Allow all origin

app.use("/api/auth", authRoutes);


// MongoDB Connection
mongoose.connect(process.env.MongoDB_URL)
    .then(() => { console.log("Database Connected successfully"); })
    .catch((err) => console.log(err));

// Server Connection
app.listen(PORT, (err) => {
    if (err) {
        console.log(err);        
    }
    console.log(`Server listening to port ${PORT}`);
})