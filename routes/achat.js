import express from 'express';

import { buyProduit } from '../controllers/achat.js';
  
const router = express.Router();

router
  .route('/:idUser/:idProduit')
  .get(buyProduit);
  
export default router;