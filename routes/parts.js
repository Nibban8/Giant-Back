import express from 'express';
import { getParts, partCreation } from '../controllers/parts.js';

const router = express.Router();

router.get('/', getParts);
router.post('/', partCreation);

export default router;
