import { validationResult } from "express-validator";

import Coach, { checkDisponibilite } from "../controllers/coach.js";
import Seance from '../models/seance.js'; 

export function getAll(req, res) {
    Seance.find({})
        .then((docs) => {
            res.status(200).json(docs);
        })
        .catch((err) => {
            res.status(500).json({ error: err });
        });
}

export function getById(req, res) {
    const id = req.params.id;
    Seance.findById(id)
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
    const seance = new Seance(req.body);
    seance
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
    Seance.findByIdAndUpdate(id, req.body)
        .then((doc) => {
            res.status(200).json(doc);
        })
        .catch((err) => {
            res.status(500).json({ error: err });
        });
}   

export function deleteOne(req, res) {
    const id = req.params.id;
    Seance.findByIdAndDelete(id)
        .then((doc) => {
            res.status(200).json(doc);
        })
        .catch((err) => {
            res.status(500).json({ error: err });
        });
}

export async function reserver(nomCoach, prénomCoach, TypeEvent, IdSalleDeSport, DateEvent, NbrParticipant, HeureDebutEvent, HeureFinEvent) {
   
    const coachDisponible = await checkDisponibilite(DateEvent, nomCoach, prénomCoach);

    if (!coachDisponible) {
        throw new Error("Le coach n'est pas disponible à cette date.");
    }

    const nouvelleSeance = new Seance({
        NomCoach: nomCoach,
        PrénomCoach: prénomCoach,
        TypeEvent: TypeEvent,
        IdSalleDeSport: IdSalleDeSport,
        DateEvent: DateEvent,
        NbrParticipant: NbrParticipant,
        HeureDebutEvent: HeureDebutEvent,
        HeureFinEvent: HeureFinEvent
    });

   
    try {
        const seanceEnregistrée = await nouvelleSeance.save();
        return seanceEnregistrée;
    } catch (error) {
        throw new Error("Erreur lors de la réservation de la séance : " + error.message);
    }
}
