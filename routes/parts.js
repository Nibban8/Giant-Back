import express from 'express';
import {
  deletePart,
  getPart,
  getParts,
  partCreation,
  updatePart,
} from '../controllers/parts.js';

const router = express.Router();

router.get('/', getParts);
router.post('/', partCreation);
router.put('/:id', updatePart);
router.delete('/:id', deletePart);
router.get('/:id', getPart);

export default router;
