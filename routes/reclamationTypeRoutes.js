import express from 'express';
import { body } from 'express-validator';
import { getAllReclamationTypes, getOneReclamationType, createReclamationType, updateReclamationType, deleteOneReclamationType } from '../controllers/reclamationType.js';

const router = express.Router();

router.route('/:id')
    .get(getOneReclamationType)
    .patch(updateReclamationType)
    .delete(deleteOneReclamationType);

router.route('/')
    .get(getAllReclamationTypes)
    .post(
        body('name').isLength({ min: 3 }),
        createReclamationType
    );

export default router;
