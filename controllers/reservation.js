import { validationResult } from "express-validator";
import mongoose from "mongoose";
import Reservation from "../modules/reservation.js";
import User from "../modules/user.js";
import Seance from "../modules/seance.js";  
import { checkDisponibilite } from "./coach.js";
import { sendEmail } from "../services/email.service.js";

export const create = async (req, res) => {
    try {
        const { UserId, seanceId } = req.body;

        // // Vérification des ID
        
        if (!mongoose.Types.ObjectId.isValid(UserId)) {
            return res.status(400).json({ error: 'Invalid User ID' });
        }

        if (!mongoose.Types.ObjectId.isValid(seanceId)) {
            return res.status(400).json({ error: 'Invalid seance ID' });
        }
        console.log("mrgl");
        // Recherche du coach
        const coach = await User.findById(UserId);
        if (!coach) {
            return res.status(404).json({ error: 'Coach not found' });
        }
        // Recherche de la séance
        const seance = await Seance.findById(seanceId);
        if (!seance) {
            return res.status(404).json({ error: 'Seance not found' });
        }
        console.log(seance)

        // Vérification de la disponibilité du coach
        const isDisponible = await checkDisponibilite(
            coach._id,
            seance.DateEvent,
            seance.HeureDebutEvent,
            seance.HeureFinEvent
        );
        if (!isDisponible) {
            return res.status(400).json({ error: 'Coach not available' });
        }

        // Vérification de la capacité de la séance
        if (seance.NbrParticipant + 1 > seance.Capacity) {
            return res.status(400).json({ error: 'Session is full' });
        }

        // Création de la réservation
        const reservation = new Reservation({
            User: coach._id,
            seance: seance._id
        }); 

        // Mise à jour du nombre de participants dans la séance
        seance.NbrParticipant += 1;

        await seance.save();
        await reservation.save();

        // Envoi d'un email de confirmation
        sendEmail("rouissizouhour22@gmail.com", "Your Reservation is Successful", "Thank you for your reservation.");

        // Réponse avec les informations de la réservation
        res.status(201).json({ reservation, seance, coach });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export function getAll(req, res) {
    console.log("fam chy")
    Reservation.find({})
        .then((docs) => {
            res.status(200).json(docs);
        })
        .catch((err) => {
            res.status(500).json({ error: err });
        });
}

export function getById(req, res) {
    const id = req.params.id;
    Reservation.findById(id)
        .then((doc) => {
            res.status(200).json(doc);
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
    Reservation.findByIdAndUpdate(id, req.body)
        .then((doc) => {
            res.status(200).json(doc);
        })
        .catch((err) => {
            res.status(500).json({ error: err });
        });
}   

export function deleteOne(req, res) {
    const id = req.params.id;
    Reservation.findByIdAndDelete(id)
        .then((doc) => {
            res.status(200).json(doc);
        })
        .catch((err) => {
            res.status(500).json({ error: err });
        });
}