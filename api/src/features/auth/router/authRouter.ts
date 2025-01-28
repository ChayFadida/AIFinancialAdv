import { Router } from 'express';

import { auth } from '../../../middleware';
import { login, loginByToken, register, updateProfile } from '../controller/authController';


const authRouter = Router();

authRouter.get('/', auth, loginByToken);
authRouter.post('/login', login);
authRouter.post('/register', register);
authRouter.put('/profile', auth, updateProfile);

export { authRouter };
