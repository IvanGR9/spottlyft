import mongoose, { Schema } from 'mongoose';

const GymSchema = new Schema({
  name:     { type: String, required: true },
  location: { type: String, required: true },
  qrCode:   { type: String, required: true, unique: true },
}, {
  timestamps: { createdAt: true, updatedAt: false },
  toJSON: {
    transform: (_doc, ret) => {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
      return ret;
    },
  },
});

export default mongoose.model('Gym', GymSchema);
