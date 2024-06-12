import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        avatar: {
            type: String,
            required: false
        },
        wallet: {
            type: Number,
            required: true
        }
    },
    {
        timestamps: true
    }
    
);

export default model('User', userSchema);