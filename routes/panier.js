import express from 'express';
import { ajouterAuPanier, retirerDuPanier, consulterPanier, supprimerPanier, validerPanier } from '../controllers/panier.js';

const router = express.Router();

router.post('/ajouter', ajouterAuPanier);
router.post('/retirer', retirerDuPanier);
router.get('/consulter/:userId', consulterPanier);
router.delete('/supprimer/:userId', supprimerPanier); 
router.post('/valider', validerPanier);

export default router;
