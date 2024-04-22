import imageController from '@/controllers/image.controller';
import { catchAsync } from 'catch-async-express';
import { Router } from 'express';

const router = Router();

// save in public folder

router.post('/comment/:imageId', catchAsync(imageController.comment));

router.get('/get/:imageId', catchAsync(imageController.getImageById));

export default router;
