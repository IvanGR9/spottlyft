import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  gymId:    { type: String, required: true },
  level:    { type: Number, default: 1 },
  xp:       { type: Number, default: 0 },
  streak:   { type: Number, default: 0 },
}, { timestamps: { createdAt: true, updatedAt: false } });

export default mongoose.model('User', UserSchema);
