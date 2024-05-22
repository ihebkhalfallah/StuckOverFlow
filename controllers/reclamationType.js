import { validationResult } from "express-validator";
import ReclamationType from "../models/reclamationType.js";
export function getAllReclamationTypes(req, res) {
    ReclamationType.find({})
        .then((docs) => {
            res.status(200).json(docs);
        })
        .catch((err) => {
            res.status(500).json({ error: err });
        });
}

export function getOneReclamationType(req, res) {
    const id = req.params.id;
    ReclamationType.findById(id)
        .then((doc) => {
            res.status(200).json(doc);
        })
        .catch((err) => {
            res.status(500).json({ error: err });
        });
}

export function createReclamationType(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const reclamationType = new ReclamationType(req.body);
    reclamationType
        .save()
        .then((doc) => {
            res.status(201).json(doc);
        })
        .catch((err) => {
            res.status(500).json({ error: err });
        });
}

export function updateReclamationType(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const id = req.params.id;
    const reclamationType = new ReclamationType(req.body);
    ReclamationType.findByIdAndUpdate(id, reclamationType)
        .then((doc) => {
            res.status(200).json(doc);
        })
        .catch((err) => {
            res.status(500).json({ error: err });
        });
}

export function deleteOneReclamationType(req, res) {
    const id = req.params.id;
    ReclamationType.findByIdAndDelete(id)
        .then((doc) => {
            res.status(200).json(doc);
        })
        .catch((err) => {
            res.status(500).json({ error: err });
        });
}
