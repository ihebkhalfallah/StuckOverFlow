import express from 'express';
import { addComment, deleteComment, getallComments, nonSatisfaitComment, satisfaitComment } from '../controllers/commentaire.js';

  
const router = express.Router();

router
  .route('/')
  .post(addComment);
router
  .route('/:idUser/:idrec')
  .get(getallComments);
router
  .route('/:id')
  .delete(deleteComment);
router
  .route('/:id/valide')
  .patch(satisfaitComment);
router
  .route('/:id/invalide')
  .patch(nonSatisfaitComment);

export default router;