import { validationResult } from 'express-validator';
import Categorie from '../models/categorie.js';

export function getAll(req, res) {
    Categorie.find({})
        .then(docs => res.status(200).json(docs))
        .catch(err => res.status(500).json({ error: err.message }));
}

export function addOnce(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const newCategorie = { nom: req.body.nom };

    Categorie.create(newCategorie)
        .then(categorie => res.status(200).json(categorie))
        .catch(err => res.status(500).json({ error: err.message }));
}

export function getOnce(req, res) {
    Categorie.findById(req.params.id)
        .then(doc => {
            if (!doc) {
                return res.status(404).json({ error: "Category not found" });
            }
            res.status(200).json(doc);
        })
        .catch(err => res.status(500).json({ error: err.message }));
}

export function putOnce(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const updatedCategorie = { nom: req.body.nom };

    Categorie.findByIdAndUpdate(req.params.id, updatedCategorie, { new: true })
        .then(doc => {
            if (!doc) {
                return res.status(404).json({ error: "Category not found" });
            }
            res.status(200).json(doc);
        })
        .catch(err => res.status(500).json({ error: err.message }));
}

export function deleteOnce(req, res) {
    Categorie.findByIdAndDelete(req.params.id)
        .then(doc => {
            if (!doc) {
                return res.status(404).json({ error: "Category not found" });
            }
            res.status(200).json({ message: "Category deleted successfully", category: doc });
        })
        .catch(err => res.status(500).json({ error: err.message }));
}

export async function getByName(req, res) {
    try {
        const nom = req.params.nom;

        const category = await Categorie.findOne({ nom });

        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }

        res.json(category);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
}