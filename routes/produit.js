import express from 'express';
import { body } from 'express-validator';
import multer from '../middlewares/multer-config.js';
import { getAll, addOnce, getOnce, putOnce, deleteOnce, getTopSellingProductInPeriod } from '../controllers/produit.js';

const router = express.Router();

router.get('/top-selling-in-period', getTopSellingProductInPeriod); // Nouvelle route pour le produit le plus vendu dans une période


router.route('/')
    .get(getAll)
    .post(
        multer("avatar", 512 * 1024),
        body('title').isString().notEmpty(),
        body('description').isString().notEmpty(),
        body('price').isNumeric(),
        body('quantity').isNumeric(),
        body('idCategorie').isMongoId(),
        addOnce
    );

router.route('/:id')
    .get(getOnce)
    .put(
        multer("avatar", 512 * 1024),
        body('title').isString().notEmpty(),
        body('description').isString().notEmpty(),
        body('price').isNumeric(),
        body('quantity').isNumeric(),
        body('idCategorie').isMongoId(),
        putOnce
    )
    .delete(deleteOnce);

export default router;
