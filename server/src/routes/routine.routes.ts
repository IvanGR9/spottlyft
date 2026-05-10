import { Router } from 'express';
import { getRoutinesByUserHandler, createRoutineHandler, deleteRoutineHandler } from '../controllers/routine.controller.js';

const router = Router();

router.get('/', getRoutinesByUserHandler);
router.post('/', createRoutineHandler);
router.delete('/:id', deleteRoutineHandler);

export default router;
