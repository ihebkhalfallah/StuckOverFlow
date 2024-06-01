import express from 'express';
import { body, param } from 'express-validator';
import * as reclamationResponseController from '../controllers/reclamationResponse.js';

const router = express.Router();


router.get('/', reclamationResponseController.getAllReclamationResponses);

router.get('/:id', param('id').isMongoId(), reclamationResponseController.getOneReclamationResponse);

router.post('/', [
    body('reclamationId').isMongoId(),
    body('reclamationType').isMongoId(),
    body('date').optional().isISO8601(),
    body('status').optional().isIn(['success', 'failure', 'pending']),
], reclamationResponseController.createReclamationResponse);

router.put('/:id', [
    param('id').isMongoId(),
    body('reclamationId').optional().isMongoId(),
    body('reclamationType').optional().isMongoId(),
    body('date').optional().isISO8601(),
    body('status').optional().isIn(['success', 'failure', 'pending']),
], reclamationResponseController.updateReclamationResponse);

router.delete('/:id', param('id').isMongoId(), reclamationResponseController.deleteOneReclamationResponse);

export default router;
