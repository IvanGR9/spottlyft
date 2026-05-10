import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema({
  username:    { type: String, required: true, unique: true },
  email:       { type: String, required: true, unique: true },
  password:    { type: String, required: true },
  gymId:       { type: String, required: true },
  level:       { type: Number, default: 1 },
  xp:          { type: Number, default: 0 },
  streak:      { type: Number, default: 0 },
  bio:         { type: String, default: '' },
  avatarColor: { type: String, default: '#f97316' },
  avatar:      { type: String, default: '' },
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

export default mongoose.model('User', UserSchema);
