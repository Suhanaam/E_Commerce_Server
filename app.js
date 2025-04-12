import dotenv from 'dotenv';
dotenv.config();  // ✅ Load .env variables

import express from 'express';
import cors from "cors";
import { connectDB } from './config/db.js';
import { apiRouter } from './routes/index.js';
import cookieParser from 'cookie-parser';

const app = express();
const port = process.env.PORT;

// ✅ CORS middleware (placed before everything else)
const corsOptions = {
  origin: "https://e-commerce-client-rayan.onrender.com", // ✅ Your frontend domain
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // ✅ Handle preflight requests

connectDB();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

console.log("MONGO_URI from .env:", process.env.MONGO_URI);
console.log("JWT_SECRET_KEY from .env:", process.env.JWT_SECRET_KEY);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use("/api", apiRouter);

// Optional: 404 route fallback
// app.all("*", (req, res) => {
//   res.status(404).json({ message: "Endpoint does not exist" });
// });

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
