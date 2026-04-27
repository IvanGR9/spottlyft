import { Router } from 'express';
import { getUser, postUser } from '../controllers/user.controller.js';

const router = Router();

router.get('/:id', getUser);
router.post('/', postUser);

export default router;