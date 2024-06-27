import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    password: true
  },
  age: {
    type: Number,
    required: false
  },
  address: {
    type: String,
    required: false
  },
  verified: {
    type: Boolean,
    default: false,
  },
  verificationCode: {
    type: Number,
    default: null,
    required: false
  },
  phoneNumber: {
    type: String,
    required: false,
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user'
  },
  token: {
    type: String,
    default: null,
    required: false
  }
});

export default model('User', userSchema);