import { validationResult } from "express-validator";
import Reclamation from '../models/reclamation.js';

export function getAllReclamations(req, res) {
    Reclamation.find({})
        .then((docs) => {
            res.status(200).json(docs);
        })
        .catch((err) => {
            res.status(500).json({ error: err });
        });
}

export function getOneReclamation(req, res) {
    const id = req.params.id;
    Reclamation.findById(id)
        .then((doc) => {
            res.status(200).json(doc);
        })
        .catch((err) => {
            res.status(500).json({ error: err });
        });
}

export function createReclamation(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const reclamation = new Reclamation(req.body);
    reclamation
        .save()
        .then((doc) => {
            res.status(201).json(doc);
        })
        .catch((err) => {
            res.status(500).json({ error: err });
        });
}

export function updateReclamation(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const id = req.params.id;
    const reclamation = new Reclamation(req.body);
    Reclamation.findByIdAndUpdate(id, reclamation)
        .then((doc) => {
            res.status(200).json(doc);
        })
        .catch((err) => {
            res.status(500).json({ error: err });
        });
}

export function deleteOneReclamation(req, res) {
    const id = req.params.id;
    Reclamation.findByIdAndDelete(id)
        .then((doc) => {
            res.status(200).json(doc);
        })
        .catch((err) => {
            res.status(500).json({ error: err });
        });
}
