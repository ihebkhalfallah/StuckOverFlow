import { validationResult } from "express-validator";
import User from "../modules/user.js";
import Seance from "../models/seance.js";
import schedule from "node-schedule";
import {
  createCoach,
  deleteCoach,
  getAllCoaches,
  getCoach,
  updateCoach,
} from "./coach.js";

// export function getAll(req, res) {
//   const coaches = await User.find({ role: "COACH" });
//   User.find({ role: "COACH" })
//     .then((docs) => {
//       res.status(200).json(docs);
//     })
//     .catch((err) => {
//       res.status(500).json({ error: err });
//     });
// }

// export function getOne(req, res) {
//   const id = req.params.id;
//   Coach.findById(id)
//     .then((doc) => {
//       res.status(200).json(doc);
//     })
//     .catch((err) => {
//       res.status(500).json({ error: err });
//     });
// }

// export function create(req, res) {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({ errors: errors.array() });
//   }
//   const coach = new Coach(req.body);
//   coach
//     .save()
//     .then((doc) => {
//       res.status(201).json(doc);
//     })
//     .catch((err) => {
//       res.status(500).json({ error: err });
//     });
// }

// export function update(req, res) {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({ errors: errors.array() });
//   }
//   const id = req.params.id;
//   const coach = new Coach(req.body);
//   Coach.findByIdAndUpdate(id, coach)
//     .then((doc) => {
//       res.status(200).json(doc);
//     })
//     .catch((err) => {
//       res.status(500).json({ error: err });
//     });
// }

// export function deleteOne(req, res) {
//   const id = req.params.id;
//   Coach.findByIdAndDelete(id)
//     .then((doc) => {
//       res.status(200).json(doc);
//     })
//     .catch((err) => {
//       res.status(500).json({ error: err });
//     });
// }

export async function checkDisponibilite(
  idCoach,
  dateEvent,
  heureDebutEvent,
  heureFinEvent
) {
  try {
    const coach = await getCoach(idCoach);

    if (!coach) {
      throw new Error("Le coach spécifié n'existe pas.");
    }

    const date = new Date(dateEvent);
    const heureDebut = new Date(`${dateEvent}T${heureDebutEvent}`);
    const heureFin = new Date(`${dateEvent}T${heureFinEvent}`);

    const seance = await Seance.findOne({
      DateEvent: dateEvent,
      HeureDebutEvent: heureDebutEvent,
      HeureFinEvent: heureFinEvent,
      Coach: coach,
    });

    if (seance) {
      return false;
    } else {
      return true;
    }
  } catch (error) {
    throw new Error(
      "Erreur lors de la vérification de la disponibilité : " + error.message
    );
  }
}

export function ResetJob() {
  schedule.scheduleJob(" 19 * * *", () => {
    User.updateMany({ role: "COACH" }, { disponible: true }).exec(); // Reset Disponibilite
  });
}
