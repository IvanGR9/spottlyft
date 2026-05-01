import mongoose, { Schema } from 'mongoose';

const ExerciseSchema = new Schema({
  name:             { type: String, required: true, unique: true },
  muscle:           { type: String, required: true },
  secondaryMuscles: { type: [String], default: [] },
  type:             { type: String },
}, { timestamps: { createdAt: true, updatedAt: false } });

export default mongoose.model('Exercise', ExerciseSchema);
