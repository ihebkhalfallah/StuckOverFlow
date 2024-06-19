import express from 'express';
import multer from "../middlewares/multer-config-reclamation.js";
import { validationResult,check } from "express-validator";
import { body } from 'express-validator';

import { getReclamation, addReclamation, getReclamations, updateReclamation ,deleteReclamation, searchReclamation, ouvrireReclamation, traiterReclamation, fermerReclamation, getReclamationStats } from '../controllers/reclamation.js';
  
import Filter from 'bad-words';

const router = express.Router();

const filter = new Filter();
export const validateReclamation = [
    body('description').isString().withMessage('Reclamation description text must be a string').trim().escape().custom((value) => {
        if (filter.isProfane(value)) {
            throw new Error('Reclamation text contains inappropriate language');
        }
        return true;
    }),
    body('title').isString().withMessage('Reclamation title must be a string').trim().escape().custom((value) => {
        if (filter.isProfane(value)) {
            throw new Error('Reclamation title contains inappropriate language');
        }
        return true;
    }),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];



router
  .route('/')
  .get(getReclamations)
  .post(
    multer("pieceJointe", 512 * 1024),validateReclamation,
    addReclamation);

router
  .route('/:id')
  .get(getReclamation)
  .patch(validateReclamation,updateReclamation)
  .delete(deleteReclamation);

router.get("/search/:key", searchReclamation);

router
  .route('/:id/traiter')
  .patch(validateReclamation,traiterReclamation)
router
  .route('/:id/ouvrire')
  .patch(ouvrireReclamation)
router
  .route('/:id/fermer')
  .patch(fermerReclamation)

router.get('/stats', getReclamationStats);

  
  
export default router;