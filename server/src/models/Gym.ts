import mongoose, { Schema } from 'mongoose';

const GymSchema = new Schema({
  name:     { type: String, required: true },
  location: { type: String, required: true },
  qrCode:   { type: String, required: true, unique: true },
}, { timestamps: { createdAt: true, updatedAt: false } });

export default mongoose.model('Gym', GymSchema);
