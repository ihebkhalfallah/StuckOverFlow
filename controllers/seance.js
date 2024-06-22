import { validationResult } from "express-validator";
import  { checkDisponibilite } from "../controllers/coach.js";

import Seance from "../modules/seance.js";

import Reservation from "../modules/reservation.js";
import User from "../modules/user.js"
export function getAll(req, res) {
    console.log("baaah")
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

// export function create(req, res) {
//     if (!validationResult(req).isEmpty()) {
//         res.status(400).json({ errors: validationResult(req).array() });
//     } else {
        
//         Seance.create(req.body)
//             .then((newseance) => {
//                 newseance.HeureFinEvent = new Date(newseance.HeureDebutEvent.getTime() + newseance.Durée);
//                 res.status(201).json({
//                     newseance
//                 });
//             })
//             .catch((err) => {
//                 res.status(500).json({ error: err });
//             });
//     }
// }


export async function create(req, res) {
    try {
        console.log("validation done");
        // Validation des erreurs
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { DateEvent, Durée, coachId } = req.body;
        console.log("dateEvent",DateEvent);
        console.log("Durée",DateEvent);
        console.log("coachId",coachId);
        // Vérification du format de la durée
        const durationInHours = parseFloat(Durée);
        console.log("durationInHours",durationInHours);
        console.log("isNan",isNaN(durationInHours));
        if (isNaN(durationInHours)) {
            return res.status(400).json({ error: "Invalid duration format." });
        }

        // Calcul de l'heure de début et de fin de l'événement
        const debutEventDate = new Date(DateEvent);
        const durationInMilliseconds = durationInHours * 60 * 60 * 1000;
        const finEventDate = new Date(debutEventDate.getTime() + durationInMilliseconds);
        console.log("finEventDate",finEventDate);
        // Vérification de la disponibilité du coach
        const coach = await User.findById(coachId);
        
        console.log(coach);
        if (!coach) {
            return res.status(404).json({ error: 'Coach not found' });
        }

        const isDisponible = await checkDisponibilite(
            coach._id,
            debutEventDate,
            debutEventDate,
            finEventDate
        );
        if (!isDisponible) {
            return res.status(400).json({ error: 'Coach not available' });
        }

        // Création des données de la séance
        const seanceData = {
            ...req.body,
            HeureDebutEvent: debutEventDate,
            HeureFinEvent: finEventDate,
            Durée: durationInMilliseconds
        };

        // Création de la nouvelle séance
        const newseance = await Seance.create(seanceData);

        // Enregistrement de la nouvelle séance avec l'heure de fin
        newseance.HeureFinEvent = finEventDate;
        await newseance.save();

        // Réponse avec les informations de la nouvelle séance
        res.status(201).json({ newseance });

    } catch (err) {
        // Gestion des erreurs
        res.status(500).json({ error: err.message });
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

// export async function reserver(idCoach, idSeance) {
//     try {
//         const coach = await Coach.findById(idCoach);
//         const seance = await Seance.findById(idSeance);
        

//         if (!seance || !coach) {
//             throw new Error("La séance ou le coach n'existe pas.");
//         }

//         // const isCoachDisponible = await checkDisponibilite(seance.DateEvent, coach.NomCoach, coach.PrénomCoach);
        
//         // if (!isCoachDisponible) {
//         //     throw new Error("Le coach n'est pas disponible à cet horaire.");
//         // }

//         if (seance.NbrParticipant + 1 > seance.Capacity) {
//             throw new Error("La salle de sport est complète.");
//         }

//         seance.NbrParticipant += 1;
//         coach.Disponible = false;

//         await seance.save();
//         await coach.save();

//         const reservation = new Reservation({
//             coach: coach, 
//             seance: seance 
//         });

//         await reservation.save();

//         return { seance: seance , reservation };
//     } catch (error) {
//         throw new Error("Erreur lors de la réservation de la séance : " + error.message);
//     }
// }





