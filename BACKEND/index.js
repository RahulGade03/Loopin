import express, {urlencoded} from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import connectDB from './utils/db.js';
import userRoute from './routes/user.route.js';
import postRoute from './routes/post.route.js';
import messageRoute from './routes/message.route.js';
import { app, server } from './socket/socket.js';
import path from "path";


dotenv.config({});

const PORT = process.env.PORT || 3000;

const __dirname = path.resolve();
// console.log (__dirname);

app.get ("/", ( req, res) => {
    return res.status(200).json ({
        message: "Welcome to the backend server!",
        success: true
    })
});

//Middlewares
app.use (express.json());
app.use (cookieParser());
app.use (urlencoded({ extended: true, limit:'100mb' }));
app.use (cors ({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use ("/api/v1/user", userRoute);
app.use ("/api/v1/message", messageRoute);
app.use ("/api/v1/post", postRoute);

app.use (express.static(path.join(__dirname, "/FRONTEND/dist")));
// app.get("*", (req, res) => {
//     res.sendFile (path.resolve(__dirname, "FRONTEND", "dist", "index.html"));
// })

server.listen (PORT, async () => {
    await connectDB ();
    console.log (`Server is running on port ${PORT}`);
})