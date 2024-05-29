import mongoose from "mongoose";
const { Schema, model } = mongoose;

const restaurantSchema = new Schema({
  nomRestaurant: {
    type: String,
    required: true,
  },
  locationRestaurant: {
    type: Object,
    required: true,
  },
  imageRestaurant: {
    type: String,
    required: false,
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

export default model("Restaurant", restaurantSchema);
