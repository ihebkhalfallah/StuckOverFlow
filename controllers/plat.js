import { validationResult } from "express-validator";
import Plat from "../models/plat.js";
import Restaurant from "../models/restaurant.js";

export function getAllPlats(req, res) {
  Plat.find({})
    .populate("restaurants")
    .then((docs) => {
      res.status(200).json(docs);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
}

export function addOnePlat(req, res) {
  if (!validationResult(req).isEmpty()) {
    res.status(400).json({ errors: validationResult(req).array() });
  } else {
    let newPlat = {};
    if (req.file == undefined) {
      newPlat = {
        nomPlat: req.body.nomPlat,
        prixPlat: req.body.prixPlat,
        cuisine: req.body.cuisine,
        calories: req.body.calories,
        categoriePlat: req.body.categoriePlat,
        restaurants: req.body.restaurants,
        imagePlat: `${req.protocol}://${req.get(
          "host"
        )}/img/imagePlatDefault.png`,
      };
    } else {
      newPlat = {
        nomPlat: req.body.nomPlat,
        prixPlat: req.body.prixPlat,
        cuisine: req.body.cuisine,
        calories: req.body.calories,
        categoriePlat: req.body.categoriePlat,
        restaurants: req.body.restaurants,
        imagePlat: `${req.protocol}://${req.get("host")}/img/${
          req.file.filename
        }`,
      };
    }
    Plat.create(newPlat)
      .then((newPlat) => {
        res.status(200).json(newPlat);
      })
      .catch((err) => {
        res.status(500).json({ error: err });
      });
  }
}

export function getOnePlat(req, res) {
  Plat.findById(req.params.id)
    .populate("restaurants")
    .then((doc) => {
      res.status(200).json(doc);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
}

export function updateOnePlat(req, res) {
  if (!validationResult(req).isEmpty()) {
    res.status(400).json({ errors: validationResult(req).array() });
  } else {
    let newPlat = {};
    if (req.file == undefined) {
      newPlat = {
        nomPlat: req.body.nomPlat,
        prixPlat: req.body.prixPlat,
        cuisine: req.body.cuisine,
        calories: req.body.calories,
        categoriePlat: req.body.categoriePlat,
        restaurants: req.body.restaurants,
      };
    } else {
      newPlat = {
        nomPlat: req.body.nomPlat,
        prixPlat: req.body.prixPlat,
        cuisine: req.body.cuisine,
        calories: req.body.calories,
        categoriePlat: req.body.categoriePlat,
        restaurants: req.body.restaurants,
        imagePlat: `${req.protocol}://${req.get("host")}/img/${
          req.file.filename
        }`,
      };
    }
    Plat.findByIdAndUpdate(req.params.id, newPlat)
      .then((doc1) => {
        Plat.findById(req.params.id)
          .then((doc2) => {
            res.status(200).json(doc2);
          })
          .catch((err) => {
            res.status(500).json({ error: err });
          });
      })
      .catch((err) => {
        res.status(500).json({ error: err });
      });
  }
}

export function deleteOnePlat(req, res) {
  Plat.findByIdAndDelete(req.params.id)
    .then((doc) => {
      res.status(200).json(doc);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
}