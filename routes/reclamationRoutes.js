import express from 'express';   
 import { validationResult,check } from "express-validator";
import { body } from 'express-validator';
import { getAllReclamations, getOneReclamation, createReclamation, updateReclamation, deleteOneReclamation  ,rateReclamationResponse} from '../controllers/reclamation.js';

import Filter from 'bad-words';

const router = express.Router();
const filter = new Filter();
export const validateReclamation = [
    body('text').isString().withMessage('Reclamation text must be a string').trim().escape().custom((value) => {
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

router.route('/:id')
    .get(getOneReclamation)
    .delete(deleteOneReclamation); 
router.patch('/:id',validateReclamation,updateReclamation);
    
router.post('/:id/rate', rateReclamationResponse);

router.route('/')
    .get(getAllReclamations)
    .post(
        body('title').isLength({ min: 3 }).withMessage('Title must be at least 3 characters long'),
        body('userId').notEmpty().withMessage('User ID must not be empty'),
        body('reclamationTypeId').notEmpty().withMessage('Reclamation Type ID must not be empty'),
        body('text').isLength({ min: 3 }).withMessage('Text must be at least 3 characters long'),
        validateReclamation,
        createReclamation
    );

export default router;
