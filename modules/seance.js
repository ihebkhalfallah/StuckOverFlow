import mongoose from "mongoose";

const { Schema, model } = mongoose;

const seanceSchema = new Schema(
  {
    TypeEvent: {
      type: [
        {
          type: String,
          enum: [
            "PRIVATE_COURSE",
            "DANCE_COURSE",
            "BODYCOMBAT_COURSE",
            "SPINNING_COURSE",
            "ORIONTAL_DANCE_COURSE",
          ],
        },
      ],
      required: true,
    },
    IdSalleDeSport: {
      type: String,
      required: true,
    },
    DateEvent: {
      type: Date,
      required: true,
    },
    NbrParticipant: {
      type: Number,
      required: true,
    },
    Capacity: {
      type: Number,
      required: true,
    },
    HeureDebutEvent: {
      type: Date,
      required: true,
    },
    Durée: {
      type: Number,
      required: true,
    },
    HeureFinEvent: {
      type: Date,
    },
    coach: {
      type: Schema.Types.ObjectId,
      ref: "User",
     // required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default model("Seance", seanceSchema);
