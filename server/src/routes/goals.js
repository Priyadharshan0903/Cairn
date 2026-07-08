import { Router } from 'express';
import { validate } from '../middleware/validate.js';
import { requireAuth } from '../middleware/auth.js';
import {
  listGoals,
  getGoal,
  createGoal,
  updateGoal,
  deleteGoal,
  reorderGoals,
  createGoalSchema,
  updateGoalSchema,
  reorderSchema,
} from '../controllers/goalController.js';

const router = Router();
router.use(requireAuth);

router.get('/', listGoals);
router.post('/', validate(createGoalSchema), createGoal);
router.patch('/reorder', validate(reorderSchema), reorderGoals);
router.get('/:id', getGoal);
router.patch('/:id', validate(updateGoalSchema), updateGoal);
router.delete('/:id', deleteGoal);

export default router;
