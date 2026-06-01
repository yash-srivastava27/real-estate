import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from "cors"
import authRouter from './routes/auth.route.js';
import userRouter from './routes/user.routes.js';
import listingRouter from './routes/listing.route.js';
import cookieParser from 'cookie-parser'
import { MongoMemoryServer } from 'mongodb-memory-server'

//import cookieParser from "cookie-parser";
dotenv.config();
const mongoUri = process.env.MONGO || process.env.MONGO_;
const port = process.env.PORT || 5002;

const app = express();
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))
app.use(cookieParser());
app.use(express.json())
app.use(express.urlencoded({extended: true, limit: "20mb"}))
app.use(express.static("backend/public"))
app.use('/api/auth',authRouter)
app.use('/api/user',userRouter)
app.use('/api/listing',listingRouter);
app.use((err,req,res,next)=>{
    const statusCode=err.statusCode||500;
    const message=err.message||'internal server error';
    return res.status(statusCode).json({
        success:false,
        statusCode,
        message,
    });
});

const startServer = async () => {
    try {
        let connectionString = mongoUri;
        
        // Try to connect to Atlas first
        try {
            await mongoose.connect(connectionString, {
                serverSelectionTimeoutMS: 5000,
            });
            console.log('✓ Connected to MongoDB Atlas');
        } catch (atlasError) {
            console.log('⚠ Atlas connection failed, falling back to in-memory MongoDB...');
            
            // Fall back to in-memory MongoDB for development
            const mongoServer = await MongoMemoryServer.create();
            connectionString = mongoServer.getUri();
            
            await mongoose.connect(connectionString);
            console.log('✓ Connected to in-memory MongoDB (development mode)');
        }
        
        app.listen(port, ()=>{
            console.log(`server is running on port ${port}!!`)
        })
    } catch (err) {
        console.log('MongoDB Connection Error:', err)
        process.exit(1);
    }
};

startServer();
