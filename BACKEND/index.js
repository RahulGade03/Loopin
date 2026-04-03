import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from "path";

import connectDB from './utils/db.js';
import userRoute from './routes/user.route.js';
import postRoute from './routes/post.route.js';
import messageRoute from './routes/message.route.js';
import { app, server } from './socket/socket.js';

dotenv.config({});

const PORT = process.env.PORT || 3000;

app.get ("/api", ( req, res) => {
    return res.status(200).json ({
        message: "Welcome to the backend server!",
        success: true
    })
});

//Middlewares
app.use (express.json());   // parsing the json data from the request body
app.use (cookieParser());   // used to parse the cookies from the request (converts cookies in key value pair and store inside req.cookies)
app.use (express.urlencoded({ extended: true, limit:'100mb' })); // for parsing the urlEncoded data (multipart/form-data) and converting it to json format
app.use (cors ({
    origin: process.env.FRONTEND_BASE_URL,
    credentials: true
}));
app.use ("/api/v1/user", userRoute);
app.use ("/api/v1/message", messageRoute);
app.use ("/api/v1/post", postRoute);

await connectDB ();
server.listen (PORT, async () => { // we are not using app.listen becuase we have to use socket.io also
    console.log (`Server is running on port ${PORT}`);
})