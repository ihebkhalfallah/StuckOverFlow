import express from 'express';
import { body } from 'express-validator';
import { getAllReclamations, getOneReclamation, createReclamation, updateReclamation, deleteOneReclamation } from '../controllers/reclamation.js';

const router = express.Router();

router.route('/:id')
    .get(getOneReclamation)
    .patch(updateReclamation)
    .delete(deleteOneReclamation);

router.route('/')
    .get(getAllReclamations)
    .post(
        body('title').isLength({ min: 3 }),
        body('userId').notEmpty(),
        body('reclamationTypeId').notEmpty(),
        body('text').isLength({ min: 3 }),
        createReclamation
    );

export default router;
