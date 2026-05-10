import mongoose, { Schema } from 'mongoose';

const SetSchema = new Schema({
  kg:   { type: Number },
  reps: { type: Number },
  rir:  { type: Number },
}, { _id: false });

const ExerciseEntrySchema = new Schema({
  name:        { type: String, required: true },
  muscleGroup: { type: String },
  type:        { type: String },
  sets:        { type: [SetSchema], default: [] },
}, { _id: false });

const RoutineSchema = new Schema({
  userId:    { type: Schema.Types.ObjectId, ref: 'User', required: true },
  gymId:     { type: String, required: true },
  name:      { type: String, required: true },
  exercises: { type: [ExerciseEntrySchema], default: [] },
}, { timestamps: true });

export default mongoose.model('Routine', RoutineSchema);
