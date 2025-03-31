import dotenv from 'dotenv';
dotenv.config();  // ✅ Load .env variables

import express from 'express';
import cors from "cors";

import { connectDB } from './config/db.js';
import { apiRouter } from './routes/index.js';
import cookieParser from 'cookie-parser';




const app = express();
const port = process.env.PORT;

connectDB();
// Middleware to parse JSON
app.use(express.json());
app.use(cookieParser());
app.use(cors())
//app.use(cors({origin:"http://localhost:5173",credentials:true,methods:["GET","POST","PUT","DELETE","OPTION"]}));
console.log("MONGO_URI from .env:", process.env.MONGO_URI);
console.log("JWT_SECRET_KEY from .env:", process.env.JWT_SECRET_KEY);


app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.use("/api",apiRouter);

// app.all("*",(req,res,next)=>{
//   res.status(404).json({message:"end point does not exist"});
// })

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
