import express from 'express';
import {
  getBuilds,
  createBuild,
  deleteBuild,
  updateBuild,
} from '../controllers/builds.js';

const router = express.Router();

router.get('/', getBuilds);
router.post('/', createBuild);
router.delete('/:id', deleteBuild);
router.put('/:id', updateBuild);
export default router;
