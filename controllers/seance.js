import { validationResult } from "express-validator";
import  { checkDisponibilite } from "../controllers/coach.js";

import Seance from "../models/seance.js";
import Coach from "../models/coach.js";
import reservation from "../models/reservation.js";

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
    if (!validationResult(req).isEmpty()) {
        res.status(400).json({ errors: validationResult(req).array() });
    } else {
        Seance.create(req.body)
            .then((newseance) => {
                res.status(201).json({
                    newseance
                });
            })
            .catch((err) => {
                res.status(500).json({ error: err });
            });
    }
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

export async function reserver(idCoach, idSeance) {
    try {
        const seance = await Seance.findById(idSeance);
        const coach = await Coach.findById(idCoach);


        if (!seance || !coach) {
            throw new Error("La séance ou le coach n'existe pas.");
        }

        const isCoachDisponible = await checkDisponibilite(seance.DateEvent, coach.NomCoach, coach.PrénomCoach);
        
        if (!isCoachDisponible) {
            throw new Error("Le coach n'est pas disponible à cet horaire.");
        }

        if (seance.NbrParticipant + 1 > seance.Capacity) {
            throw new Error("La salle de sport est complète.");
        }

        seance.NbrParticipant += 1;
        coach.Disponible = false;

        const seanceEnregistree = await seance.save();
        await coach.save();
        // const reservation = new reservation({
        //     coach: idCoach,
        //     seance: idSeance
        // });
        // await reservation.save();
        return seanceEnregistree ,reservation ;
    } catch (error) {
        throw new Error("Erreur lors de la réservation de la séance : " + error.message);
    }
}



