import { Router } from 'express';
import { getUserByQuery, getUserByEmailHandler, getUser, postUser, patchUser } from '../controllers/user.controller.js';

const router = Router();

router.get('/', getUserByQuery);
router.get('/by-email', getUserByEmailHandler);
router.get('/:id', getUser);
router.post('/', postUser);
router.patch('/:id', patchUser);

export default router;