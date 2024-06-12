import express from 'express';
import { body } from 'express-validator';
import {getAll,addOnce,getOnce,putOnce,deleteOnce} from '../controllers/categorie.js';

const router = express.Router();

router.route('/')
    .get(getAll)
    .post(
        body('nom').isString().notEmpty(),
        addOnce
    );

router.route('/:id')
    .get(getOnce)
    .put(
        body('nom').isString().notEmpty(),
        putOnce
    )
    .delete(deleteOnce);

export default router;
