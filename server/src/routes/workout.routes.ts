import { Router } from 'express';
import { getWorkouts, getWorkoutsByUserHandler, getWorkoutByIdHandler, createWorkout, deleteWorkout } from '../controllers/workout.controller.js';

const router = Router();

router.get('/', getWorkouts);
router.get('/user', getWorkoutsByUserHandler);
router.post('/', createWorkout);
router.get('/:id', getWorkoutByIdHandler);
router.delete('/:id', deleteWorkout);

export default router;