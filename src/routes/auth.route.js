import express from 'express';
import { handleSignUp, handleLogin, handleLogout, handleVerifyOtp, handleResendOtp } from '../controller/auth.controller.js';
const authRouter = express.Router();

authRouter.post('/signup', handleSignUp);
authRouter.post('/login', handleLogin);
authRouter.post('/logout', handleLogout);
authRouter.post('/verify-otp', handleVerifyOtp);
authRouter.post('/resend-otp', handleResendOtp);
export default authRouter;