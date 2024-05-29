import { validationResult } from "express-validator";
import Plat from "../models/plat.js";
import Restaurant from "../models/restaurant.js";

export function getAllRestaurants(req, res) {
  Restaurant.find({})
    .populate("categorieRestaurant")
    .populate("plats")
    .then((docs) => {
      res.status(200).json(docs);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
}

export function addOneRestaurant(req, res) {
  if (!validationResult(req).isEmpty()) {
    res.status(400).json({ errors: validationResult(req).array() });
  } else {
    let newRestaurant = {};
    if (req.file == undefined) {
      newRestaurant = {
        nomRestaurant: req.body.nomRestaurant,
        locationRestaurant: req.body.locationRestaurant,
        plats: req.body.plats,
        categorieRestaurant: req.body.categorieRestaurant,
        imageRestaurant: `${req.protocol}://${req.get(
          "host"
        )}/img/imageRestaurantDefault.jpg`,
      };
    } else {
      newRestaurant = {
        nomRestaurant: req.body.nomRestaurant,
        locationRestaurant: req.body.locationRestaurant,
        plats: req.body.plats,
        categorieRestaurant: req.body.categorieRestaurant,
        imageRestaurant: `${req.protocol}://${req.get("host")}/img/${
          req.file.filename
        }`,
      };
    }
    Restaurant.create(newRestaurant)
      .then((newRestaurant) => {
        res.status(200).json(newRestaurant);
      })
      .catch((err) => {
        res.status(500).json({ error: err });
      });
  }
}

export function getOneRestaurant(req, res) {
  Restaurant.findById(req.params.id)
    .populate("categorieRestaurant")
    .populate("plats")
    .then((doc) => {
      res.status(200).json(doc);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
}

export function updateOneRestaurant(req, res) {
  if (!validationResult(req).isEmpty()) {
    res.status(400).json({ errors: validationResult(req).array() });
  } else {
    let newRestaurant = {};
    if (req.file == undefined) {
      newRestaurant = {
        nomRestaurant: req.body.nomRestaurant,
        locationRestaurant: req.body.locationRestaurant,
        plats: req.body.plats,
        categorieRestaurant: req.body.categorieRestaurant,
      };
    } else {
      newRestaurant = {
        nomRestaurant: req.body.nomRestaurant,
        locationRestaurant: req.body.locationRestaurant,
        plats: req.body.plats,
        categorieRestaurant: req.body.categorieRestaurant,
        imageRestaurant: `${req.protocol}://${req.get("host")}/img/${
          req.file.filename
        }`,
      };
    }
    Restaurant.findByIdAndUpdate(req.params.id, newRestaurant)
      .then((doc1) => {
        Restaurant.findById(req.params.id)
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
export function deleteOneRestaurant(req, res) {
  Restaurant.findByIdAndDelete(req.params.id)
    .then((doc) => {
      res.status(200).json(doc);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
}
