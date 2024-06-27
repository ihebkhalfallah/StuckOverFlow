import { Schema, model } from "mongoose";

const serviceSchema = new Schema({
    libelle: {
        type: String,
        required: true
    }
}
);



export default model("Service", serviceSchema);