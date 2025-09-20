import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { ConnectDB } from './config/db.js';
import authRouter from './routes/auth.route.js';
import authMiddleware from './middlewares/auth.middleware.js';
import UserRouter from './routes/user.route.js';
import { sendOtpEmail } from './utils/mailer.js';
import productRouter from './routes/product.routes.js';
// import  './utils/mailer.js';




dotenv.config();

const app = express();
const PORT = process.env.PORT || 6000;

app.use(cors({
  origin:"http://localhost:5173",
  credentials:true
}));
app.use(express.json());
ConnectDB();
// sendOtpEmail("hi@theavnishkumar.in", 7368723)

app.get('/',(req, res) => {
  res.send('Hello World!');
});
app.get('/protected', authMiddleware,(req, res) => {
  res.send('Hello World!');
});

app.use("/api/user", UserRouter)
app.use('/api/auth', authRouter);
app.use('/api/product', productRouter);





app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});