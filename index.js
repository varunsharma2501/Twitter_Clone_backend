import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser";
import connectToMongo from "./db/db.js";
import authRoute from './routes/authRoute.js'
import tweetRoute from './routes/tweetRoute.js'
import userRoute from './routes/userRoute.js'
import cors from 'cors'

dotenv.config({
    path:".env"
})

const app=express();

// middlewares
app.use(express.urlencoded({
    extended:true
}));
app.use(express.json());
app.use(cookieParser());
 const corsOptions={
    origin:"http://localhost:5173",
    credentials:true,
 }
 app.use(cors(corsOptions));

// apis
app.use("/api/user",userRoute);
app.use("/api/auth",authRoute);
app.use("/api/tweet",tweetRoute);



app.listen(process.env.PORT,()=>{
    connectToMongo();
    console.log(`server running on port ${process.env.PORT}`)
})