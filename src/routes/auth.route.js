import express from 'express';
import { handleSignUp, handleLogin, handleLogout, handleVerifyOtp, handleResendOtp, handleGetProfile } from '../controller/auth.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
const authRouter = express.Router();

authRouter.post('/signup', handleSignUp);
authRouter.post('/login', handleLogin);
authRouter.post('/logout', handleLogout);
authRouter.post('/verify-otp', handleVerifyOtp);
authRouter.post('/resend-otp', handleResendOtp);
authRouter.get('/profile', authMiddleware, handleGetProfile);

export default authRouter;