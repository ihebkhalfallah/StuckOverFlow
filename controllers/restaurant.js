import { validationResult } from "express-validator";
import Plat from "../models/plat.js";
import Restaurant from "../models/restaurant.js";
import CategorieRestaurant from "../models/categorieRestaurant.js";
import { getCoordinates } from "../services/geocodingService.js";

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

export async function addOneRestaurant(req, res) {
  if (!validationResult(req).isEmpty()) {
    return res.status(400).json({ errors: validationResult(req).array() });
  }

  let newRestaurantData = {
    nomRestaurant: req.body.nomRestaurant,
    adresseRestaurant: req.body.adresseRestaurant,
    plats: JSON.parse(req.body.plats),
    location: req.body.location,
    categorieRestaurant: JSON.parse(req.body.categorieRestaurant),
    imageRestaurant: req.file
      ? `${req.protocol}://${req.get("host")}/img/${req.file.filename}`
      : `${req.protocol}://${req.get("host")}/img/imageRestaurantDefault.jpg`,
  };

  const { latitude, longitude } = await getCoordinates(
    req.body.adresseRestaurant
  );
  newRestaurantData.location = {
    type: "Point",
    coordinates: [longitude, latitude],
  };

  Restaurant.create(newRestaurantData)
    .then(async (newRestaurant) => {
      const platUpdates = newRestaurant.plats.map((platId) =>
        Plat.findByIdAndUpdate(platId, {
          $addToSet: { restaurants: newRestaurant._id },
        })
      );

      await Promise.all(platUpdates);

      const categorieUpdates = newRestaurant.categorieRestaurant.map(
        (categorieId) =>
          CategorieRestaurant.findByIdAndUpdate(categorieId, {
            $addToSet: { restaurants: newRestaurant._id },
          })
      );

      await Promise.all(categorieUpdates);

      res.status(200).json(newRestaurant);
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
}

export async function updateOneRestaurant(req, res) {
  if (!validationResult(req).isEmpty()) {
    return res.status(400).json({ errors: validationResult(req).array() });
  }

  let updatedRestaurantData = {
    nomRestaurant: req.body.nomRestaurant,
    adresseRestaurant: req.body.adresseRestaurant,
    plats: JSON.parse(req.body.plats),
    location: req.body.location,
    categorieRestaurant: JSON.parse(req.body.categorieRestaurant),
    imageRestaurant: req.file
      ? `${req.protocol}://${req.get("host")}/img/${req.file.filename}`
      : undefined,
  };

  const { latitude, longitude } = await getCoordinates(
    req.body.adresseRestaurant
  );
  updatedRestaurantData.location = {
    type: "Point",
    coordinates: [longitude, latitude],
  };

  Restaurant.findById(req.params.id)
    .then(async (originalRestaurant) => {
      const originalPlats = originalRestaurant.plats;
      const updatedPlats = updatedRestaurantData.plats;

      const platsToAdd = updatedPlats.filter(
        (platId) => !originalPlats.includes(platId)
      );
      const platsToRemove = originalPlats.filter(
        (platId) => !updatedPlats.includes(platId)
      );

      const addPlatUpdates = platsToAdd.map((platId) =>
        Plat.findByIdAndUpdate(platId, {
          $addToSet: { restaurants: req.params.id },
        })
      );

      const removePlatUpdates = platsToRemove.map((platId) =>
        Plat.findByIdAndUpdate(platId, {
          $pull: { restaurants: req.params.id },
        })
      );

      await Promise.all([...addPlatUpdates, ...removePlatUpdates]);

      const originalCategories = originalRestaurant.categorieRestaurant;
      const updatedCategories = updatedRestaurantData.categorieRestaurant;

      const categoriesToAdd = updatedCategories.filter(
        (catId) => !originalCategories.includes(catId)
      );
      const categoriesToRemove = originalCategories.filter(
        (catId) => !updatedCategories.includes(catId)
      );

      const addCategoryUpdates = categoriesToAdd.map((catId) =>
        CategorieRestaurant.findByIdAndUpdate(catId, {
          $addToSet: { restaurants: req.params.id },
        })
      );

      const removeCategoryUpdates = categoriesToRemove.map((catId) =>
        CategorieRestaurant.findByIdAndUpdate(catId, {
          $pull: { restaurants: req.params.id },
        })
      );

      await Promise.all([...addCategoryUpdates, ...removeCategoryUpdates]);

      return Restaurant.findByIdAndUpdate(
        req.params.id,
        updatedRestaurantData,
        { new: true }
      );
    })
    .then((updatedRestaurant) => {
      res.status(200).json(updatedRestaurant);
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
}

export function deleteOneRestaurant(req, res) {
  Restaurant.findByIdAndDelete(req.params.id)
    .then(async (deletedRestaurant) => {
      const platUpdates = deletedRestaurant.plats.map((platId) =>
        Plat.findByIdAndUpdate(platId, {
          $pull: { restaurants: deletedRestaurant._id },
        })
      );

      await Promise.all(platUpdates);

      const categorieUpdates = deletedRestaurant.categorieRestaurant.map(
        (catId) =>
          CategorieRestaurant.findByIdAndUpdate(catId, {
            $pull: { restaurants: deletedRestaurant._id },
          })
      );

      await Promise.all(categorieUpdates);

      res.status(200).json(deletedRestaurant);
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

export function getRestaurantsByAdresse(req, res) {
  const searchString = req.query.searchString.trim();
  if (!searchString) {
    return res.status(400).json({ error: "Recherche vide." });
  }
  const searchPattern = new RegExp(searchString, "i");

  Restaurant.find({ adresseRestaurant: { $regex: searchPattern } })
    .populate("categorieRestaurant")
    .populate("plats")
    .then((restaurants) => {
      res.status(200).json(restaurants);
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
}

export async function findRestaurantsNearPlace(req, res) {
  const { latitude, longitude, maxDistance } = req.query;
  if (!latitude || !longitude || !maxDistance) {
    return res.status(400).json({
      error: "Latitude, longitude, and maxDistance sont obligatoires.",
    });
  }

  try {
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    const distanceInMeters = parseInt(maxDistance);

    if (
      isNaN(lat) ||
      isNaN(lng) ||
      isNaN(distanceInMeters) ||
      distanceInMeters <= 0
    ) {
      return res
        .status(400)
        .json({ error: "Invalide latitude, longitude, or maxDistance." });
    }
    const restaurants = await Restaurant.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [lng, lat],
          },
          $maxDistance: distanceInMeters,
        },
      },
    }).exec();

    res.status(200).json(restaurants);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
