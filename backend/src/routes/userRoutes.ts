import { Router } from 'express';
import { getPublicProfileController } from '../controllers/userController';

const router = Router();

router.get('/:username', getPublicProfileController);

export default router;
