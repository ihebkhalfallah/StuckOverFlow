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
      res.status(500).json({ error: err.message });
    });
}

export function addOneCategorieRestaurant(req, res) {
  if (!validationResult(req).isEmpty()) {
    return res.status(400).json({ errors: validationResult(req).array() });
  }

  let newCategorieRestaurantData = {
    libelle: req.body.libelle,
    restaurants: req.body.restaurants,
    imageCategorieRestaurant: req.file
      ? `${req.protocol}://${req.get("host")}/img/${req.file.filename}`
      : `${req.protocol}://${req.get(
          "host"
        )}/img/imageCategorieRestaurantDefault.jpg`,
  };

  CategorieRestaurant.create(newCategorieRestaurantData)
    .then(async (newCategorieRestaurant) => {
      try {
        const restaurantUpdates = newCategorieRestaurant.restaurants.map(
          (restaurantId) =>
            Restaurant.findByIdAndUpdate(restaurantId, {
              $addToSet: { categorieRestaurant: newCategorieRestaurant._id },
            })
        );
        await Promise.all(restaurantUpdates);
        res.status(200).json(newCategorieRestaurant);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
}

export function getOneCategorieRestaurant(req, res) {
  CategorieRestaurant.findById(req.params.id)
    .populate("restaurants")
    .then((doc) => {
      res.status(200).json(doc);
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
}

export function updateOneCategorieRestaurant(req, res) {
  if (!validationResult(req).isEmpty()) {
    return res.status(400).json({ errors: validationResult(req).array() });
  }

  let updatedCategorieRestaurantData = {
    libelle: req.body.libelle,
    restaurants: req.body.restaurants,
    imageCategorieRestaurant: req.file
      ? `${req.protocol}://${req.get("host")}/img/${req.file.filename}`
      : undefined,
  };

  CategorieRestaurant.findByIdAndUpdate(
    req.params.id,
    updatedCategorieRestaurantData,
    { new: true }
  )
    .then(async (updatedCategorieRestaurant) => {
      try {
        const restaurantUpdates = updatedCategorieRestaurant.restaurants.map(
          (restaurantId) =>
            Restaurant.findByIdAndUpdate(restaurantId, {
              $addToSet: {
                categorieRestaurant: updatedCategorieRestaurant._id,
              },
            })
        );
        await Promise.all(restaurantUpdates);
        res.status(200).json(updatedCategorieRestaurant);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
}

export function deleteOneCategorieRestaurant(req, res) {
  CategorieRestaurant.findByIdAndDelete(req.params.id)
    .then(async (deletedCategorieRestaurant) => {
      try {
        const restaurantUpdates = deletedCategorieRestaurant.restaurants.map(
          (restaurantId) =>
            Restaurant.findByIdAndUpdate(restaurantId, {
              $pull: { categorieRestaurant: deletedCategorieRestaurant._id },
            })
        );
        await Promise.all(restaurantUpdates);
        res.status(200).json(deletedCategorieRestaurant);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
}
