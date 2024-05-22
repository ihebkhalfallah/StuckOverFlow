import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const reclamationSchema = new Schema({
    title: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    reclamationTypeId: { type: mongoose.Schema.Types.ObjectId, ref: 'ReclamationType', required: true },
    text: { type: String, required: true },
    date: { type: Date, default: Date.now },
    status: { type: String, enum: ['open', 'resolved', 'pending'], default: 'open' },
    attachments: [{ type: String }],
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    comments: [{ 
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        text: String,
        date: { type: Date, default: Date.now }
    }],
    resolvedDate: { type: Date },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});
export default model('Reclamation', reclamationSchema);
