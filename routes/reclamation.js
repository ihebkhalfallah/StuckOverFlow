import express from 'express';
import multer from "../middlewares/multer-config-reclamation.js";

import { getReclamation, addReclamation, getReclamations, updateReclamation ,deleteReclamation, searchReclamation, ouvrireReclamation, traiterReclamation, fermerReclamation, getReclamationStats } from '../controllers/reclamation.js';
  


// traiterReclamation(id: string , body:Reclamation) {
//     return this.http.patch(this.apiUrlReclamation + id+"/traiter",body);
//   
// ouvrireReclamation(id: string , body:Reclamation) {
//     return this.http.patch(this.apiUrlReclamation + id+"/ouvrire",body);
//   }
const router = express.Router();

router
  .route('/')
  .get(getReclamations)
  .post(
    multer("pieceJointe", 512 * 1024),
    addReclamation);

router
  .route('/:id')
  .get(getReclamation)
  .patch(updateReclamation)
  .delete(deleteReclamation);

router.get("/search/:key", searchReclamation);

router
  .route('/:id/traiter')
  .patch(traiterReclamation)
router
  .route('/:id/ouvrire')
  .patch(ouvrireReclamation)
router
  .route('/:id/fermer')
  .patch(fermerReclamation)

router.get('/stats', getReclamationStats);

  
  
export default router;