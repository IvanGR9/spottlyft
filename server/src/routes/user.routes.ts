import { Router } from 'express';
import { getUserByQuery, getUser, postUser } from '../controllers/user.controller.js';

const router = Router();

router.get('/', getUserByQuery);
router.get('/:id', getUser);
router.post('/', postUser);

export default router;