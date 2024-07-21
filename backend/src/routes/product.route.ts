import { Router } from 'express';
import { upload } from '../middleware/upload.middleware'; // Adjust the path as necessary
import { postController, updateController, getController, deleteController } from '../controllers/product.controllers';

const router = Router();

router.post('/product', upload.fields([
    { name: 'photo', maxCount: 1 },
    { name: 'addMoreImages', maxCount: 10 },
    { name: 'video', maxCount: 1 }
]), postController);

router.put('/product/:id', upload.fields([
    { name: 'photo', maxCount: 1 },
    { name: 'addMoreImages', maxCount: 10 },
    { name: 'video', maxCount: 1 }
]), updateController);

router.get('/product', getController);

router.delete('/product/:id', deleteController);

export default router;
