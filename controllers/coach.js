import { validationResult } from "express-validator";

import Coach from "../models/coach.js";
import Seance from '../models/seance.js'; 

export function getAll(req, res) {
    Coach.find({})
        .then((docs) => {
            res.status(200).json(docs);
        })
        .catch((err) => {
            res.status(500).json({ error: err });
        });
}

export function getOne(req, res) {
    const id = req.params.id;
    Coach.findById(id)
        .then((doc) => {
            res.status(200).json(doc);
        })
        .catch((err) => {
            res.status(500).json({ error: err });
        });
}

export function create(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const coach = new Coach(req.body);
    coach
        .save()
        .then((doc) => {
            res.status(201).json(doc);
        })
        .catch((err) => {
            res.status(500).json({ error: err });
        });
}

export function update(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const id = req.params.id;
    const coach = new Coach(req.body);
    Coach.findByIdAndUpdate(id, coach)
        .then((doc) => {
            res.status(200).json(doc);
        })
        .catch((err) => {
            res.status(500).json({ error: err });
        });
}

export function deleteOne(req, res) {
    const id = req.params.id;
    Coach.findByIdAndDelete(id)
        .then((doc) => {
            res.status(200).json(doc);
        })
        .catch((err) => {
            res.status(500).json({ error: err });
        });
}       


export async function checkDisponibilite(
    dateEvent, heureDebutEvent, heureFinEvent, nomCoach, prénomCoach) {
    const coach = await Coach.findOne({ NomCoach: nomCoach, PrénomCoach: prénomCoach });
    if (!coach) {
        throw new Error("Le coach spécifié n'existe pas.");
    }

    const seance = await Seance.findOne({
        DateEvent: dateEvent,
        heureDebutEvent : heureDebutEvent,
        heureFinEvent : heureFinEvent,
        NomCoach: nomCoach,
        PrénomCoach: prénomCoach
    });

    if (seance) {
        return false;
    } else {
        return true;
    }
}