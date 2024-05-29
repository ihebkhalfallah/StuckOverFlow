import { validationResult } from "express-validator";
import CategorieRestaurant from "../models/categorieRestaurant.js";
import Restaurant from "../models/restaurant.js";

export function getAllCategorieRestaurants(req, res) {
  CategorieRestaurant.find({})
    .populate("restaurants")
    .then((docs) => {
      res.status(200).json(docs);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
}

export function addOneCategorieRestaurant(req, res) {
  if (!validationResult(req).isEmpty()) {
    res.status(400).json({ errors: validationResult(req).array() });
  } else {
    let newCategorieRestaurant = {};
    if (req.file == undefined) {
      newCategorieRestaurant = {
        libelle: req.body.libelle,
        restaurants: req.body.restaurants,
        imageCategorieRestaurant: `${req.protocol}://${req.get(
          "host"
        )}/img/imageCategorieRestaurantDefault.jpg`,
      };
    } else {
      newCategorieRestaurant = {
        libelle: req.body.libelle,
        restaurants: req.body.restaurants,
        imageCategorieRestaurant: `${req.protocol}://${req.get("host")}/img/${
          req.file.filename
        }`,
      };
    }
    CategorieRestaurant.create(newCategorieRestaurant)
      .then((newCategorieRestaurant) => {
        res.status(200).json(newCategorieRestaurant);
      })
      .catch((err) => {
        res.status(500).json({ error: err });
      });
  }
}

export function getOneCategorieRestaurant(req, res) {
  CategorieRestaurant.findById(req.params.id)
    .populate("restaurants")
    .then((doc) => {
      res.status(200).json(doc);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
}

export function updateOneCategorieRestaurant(req, res) {
  if (!validationResult(req).isEmpty()) {
    res.status(400).json({ errors: validationResult(req).array() });
  } else {
    let newCategorieRestaurant = {};
    if (req.file == undefined) {
      newCategorieRestaurant = {
        libelle: req.body.libelle,
        restaurants: req.body.restaurants,
      };
    } else {
      newCategorieRestaurant = {
        libelle: req.body.libelle,
        restaurants: req.body.restaurants,
        imageCategorieRestaurant: `${req.protocol}://${req.get("host")}/img/${
          req.file.filename
        }`,
      };
    }
    CategorieRestaurant.findByIdAndUpdate(req.params.id, newCategorieRestaurant)
      .then((doc1) => {
        CategorieRestaurant.findById(req.params.id)
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

export function deleteOneCategorieRestaurant(req, res) {
  CategorieRestaurant.findByIdAndDelete(req.params.id)
    .then((doc) => {
      res.status(200).json(doc);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
}
