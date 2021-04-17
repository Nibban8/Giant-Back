import express from 'express';
import { getParts } from '../controllers/parts.js';

const router = express.Router();

router.get('/', getParts);

export default router;
