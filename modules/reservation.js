import mongoose from "mongoose";


const { Schema, model } = mongoose;

const reservationSchema = new Schema(
  {
    User: {
      type: Schema.Types.ObjectId,

      ref: "User",
      required: true,
    },
    seance: {
      type: Schema.Types.ObjectId,
      ref: "Seance",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default model("Reservation", reservationSchema);
