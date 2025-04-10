import dotenv from 'dotenv';
dotenv.config();  // ✅ Load .env variables

import express from 'express';
import cors from "cors";

import { connectDB } from './config/db.js';
import { apiRouter } from './routes/index.js';
import cookieParser from 'cookie-parser';




const app = express();
const port = process.env.PORT;
app.use(
  cors({
    origin: ["https://e-commerce-client-rayan.onrender.com"], // Allow only your frontend domain
    credentials: true, // Enable cookies/authentication
    methods: ["GET", "POST", "PUT", "DELETE"], // Specify allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allow custom headers
  })
);


connectDB();
// Middleware to parse JSON
app.use(express.json());
app.use(cookieParser());


//app.use(cors({origin:"http://localhost:5173",credentials:true,methods:["GET","POST","PUT","DELETE","OPTION"]}));
console.log("MONGO_URI from .env:", process.env.MONGO_URI);
console.log("JWT_SECRET_KEY from .env:", process.env.JWT_SECRET_KEY);

app.use(express.urlencoded({ extended: true }));

// Explicitly allow credentials in every response
// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "https://e-commerce-client-rayan.onrender.com");
//   res.header("Access-Control-Allow-Credentials", "true");
//   res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
//   res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
//   next();
// });


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
