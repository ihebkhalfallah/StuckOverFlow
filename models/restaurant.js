import mongoose from "mongoose";
const { Schema, model } = mongoose;

const restaurantSchema = new Schema({
  nomRestaurant: {
    type: String,
    required: true,
  },
  adresseRestaurant: {
    type: String,
  },
  imageRestaurant: {
    type: String,
    required: false,
  },
  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
    address: String,
  },
  plats: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plat",
      required: true,
    },
  ],
  categorieRestaurant: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CategorieRestaurant",
      required: true,
    },
  ],
});

restaurantSchema.index({ location: "2dsphere" });

export default model("Restaurant", restaurantSchema);
