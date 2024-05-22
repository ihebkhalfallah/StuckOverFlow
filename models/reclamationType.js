import mongoose from "mongoose";

const {Schema,model} =mongoose;
const reclamationTypeSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String }
});
export default model('ReclamationType', reclamationTypeSchema);
