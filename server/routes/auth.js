import express from 'express';
import { signup, signin, signout, getProfile } from '../controllers/authController.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/signout', signout);
router.get('/profile/:userId', getProfile);

export default router;