import { validationResult } from "express-validator";
import Plat from "../models/plat.js";
import Restaurant from "../models/restaurant.js";
import CategorieRestaurant from "../models/categorieRestaurant.js";

export function getAllRestaurants(req, res) {
  Restaurant.find({})
    .populate("categorieRestaurant")
    .populate("plats")
    .then((docs) => {
      res.status(200).json(docs);
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
}

export function addOneRestaurant(req, res) {
  if (!validationResult(req).isEmpty()) {
    return res.status(400).json({ errors: validationResult(req).array() });
  }

  let newRestaurantData = {
    nomRestaurant: req.body.nomRestaurant,
    locationRestaurant: req.body.locationRestaurant,
    plats: req.body.plats,
    categorieRestaurant: req.body.categorieRestaurant,
    imageRestaurant: req.file
      ? `${req.protocol}://${req.get("host")}/img/${req.file.filename}`
      : `${req.protocol}://${req.get("host")}/img/imageRestaurantDefault.jpg`,
  };

  Restaurant.create(newRestaurantData)
    .then((newRestaurant) => {
      const categorieUpdates = newRestaurant.categorieRestaurant.map(
        (categorieResto) =>
          CategorieRestaurant.findByIdAndUpdate(categorieResto, {
            $addToSet: { restaurants: newRestaurant._id },
          })
      );

      const platUpdates = newRestaurant.plats.map((plat) =>
        Plat.findByIdAndUpdate(plat, {
          $addToSet: { restaurants: newRestaurant._id },
        })
      );

      return Promise.all([...categorieUpdates, ...platUpdates])
        .then(() => res.status(200).json(newRestaurant))
        .catch((err) => res.status(500).json({ error: err.message }));
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
}

export function getOneRestaurant(req, res) {
  Restaurant.findById(req.params.id)
    .populate("categorieRestaurant")
    .populate("plats")
    .then((doc) => {
      res.status(200).json(doc);
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
}

export function updateOneRestaurant(req, res) {
  if (!validationResult(req).isEmpty()) {
    return res.status(400).json({ errors: validationResult(req).array() });
  }

  let updatedRestaurantData = {
    nomRestaurant: req.body.nomRestaurant,
    locationRestaurant: req.body.locationRestaurant,
    plats: req.body.plats,
    categorieRestaurant: req.body.categorieRestaurant,
    imageRestaurant: req.file
      ? `${req.protocol}://${req.get("host")}/img/${req.file.filename}`
      : undefined,
  };

  Restaurant.findByIdAndUpdate(req.params.id, updatedRestaurantData, {
    new: true,
  })
    .then((updatedRestaurant) => {
      const categorieUpdates = updatedRestaurant.categorieRestaurant.map(
        (categorieResto) =>
          CategorieRestaurant.findByIdAndUpdate(categorieResto, {
            $addToSet: { restaurants: updatedRestaurant._id },
          })
      );

      const platUpdates = updatedRestaurant.plats.map((plat) =>
        Plat.findByIdAndUpdate(plat, {
          $addToSet: { restaurants: updatedRestaurant._id },
        })
      );

      return Promise.all([...categorieUpdates, ...platUpdates])
        .then(() => res.status(200).json(updatedRestaurant))
        .catch((err) => res.status(500).json({ error: err.message }));
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
}

export function deleteOneRestaurant(req, res) {
  Restaurant.findByIdAndDelete(req.params.id)
    .then((doc) => {
      const categorieUpdates = doc.categorieRestaurant.map((categorieResto) =>
        CategorieRestaurant.findByIdAndUpdate(categorieResto, {
          $pull: { restaurants: doc._id },
        })
      );

      const platUpdates = doc.plats.map((plat) =>
        Plat.findByIdAndUpdate(plat, {
          $pull: { restaurants: doc._id },
        })
      );

      return Promise.all([...categorieUpdates, ...platUpdates])
        .then(() => res.status(200).json(doc))
        .catch((err) => res.status(500).json({ error: err.message }));
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
}
