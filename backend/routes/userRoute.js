import express from 'express';
import { loginUser, singleUser, registerUser, adminLogin, getAllUsers, adminRegister } from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/single', singleUser);
userRouter.post('/admin', adminLogin);
userRouter.get('/list', getAllUsers);
userRouter.post('/admin-register', adminRegister);

export default userRouter;