import mongoose from "mongoose";
const { Schema, model } = mongoose;

const restaurantSchema = new Schema({
  nomRestaurant: {
    type: String,
    required: true,
  },
  locationRestaurant: {
    type: String,
    required: true,
  },
});

export default model("Restaurant", restaurantSchema);
