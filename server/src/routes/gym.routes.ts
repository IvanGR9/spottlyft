import { Router } from 'express';
import { getGyms, getGym } from '../controllers/gym.controller.js';

const router = Router();

router.get('/', getGyms);
router.get('/:id', getGym);

export default router;