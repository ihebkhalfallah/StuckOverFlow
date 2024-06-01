import mongoose from "mongoose";

const {Schema,model} =mongoose;
const reclamationResponse = new Schema({
    reclamationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Reclamation', required: true },
    reclamationType: { type: mongoose.Schema.Types.ObjectId, ref: 'ReclamationType', required: true },
    date: { type: Date, default: Date.now },
    status: { type: String, enum: ['success', 'failure', 'pending'], default: 'pending' },
    additionalAttributes: {
        responseText: { type: String },
        resolutionDate: { type: Date }, 
        resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        notes: { type: String },
    }
});
export default model('ReclamationResponse', reclamationResponse);
