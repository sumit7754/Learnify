import express from "express";
import cors from 'cors';
import cookieParser from "cookie-parser";
import morgan from "morgan";
import userRoute from "./routes/user.route.js"
import courseRoute from "./routes/course.route.js"
import errorMiddleware from "./middleware/error.middleware.js";

const app = express();

// middleare
// convert into json
app.use(express.json());
app.use(express.urlencoded({extended:true}))

// for fronted 
app.use(cors({
    origin: [process.env.frontend_URL], 
    credentials: true
}));

// pass token to cookie
app.use(cookieParser());
app.use(morgan('dev'));

app.use('/api/v1/user',userRoute);
app.use('/api/v1/course',courseRoute);

app.use('/ping', (req, res) => {
    res.send('pong');
});

// app.all('*', (req, res) => {
//     res.send('OOPS!! 404 page not found');
// });

app.use(errorMiddleware);

export default app;
