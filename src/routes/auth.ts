import express from 'express';
import {
  callbackLoginWithGoogle,
  loginUser,
  loginWithGoogle,
  logoutUser,
  signupUser,
} from '../controllers/user';

const router = express.Router();

router.post('/signup', signupUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/google', loginWithGoogle);
router.get('/google/callback', callbackLoginWithGoogle);

export default router;
