import mongoose, { Schema } from 'mongoose';

const SetSchema = new Schema({
  kg:  { type: Number },
  reps: { type: Number },
  rir:  { type: Number },
}, { _id: false });

const ExerciseEntrySchema = new Schema({
  exerciseId: { type: String },
  name:       { type: String },
  sets:       { type: [SetSchema], default: [] },
}, { _id: false });

const WorkoutSchema = new Schema({
  userId:      { type: Schema.Types.ObjectId, ref: 'User', required: true },
  gymId:       { type: String, required: true },
  title:       { type: String },
  date:        { type: Date, required: true },
  duration:    { type: Number },
  exercises:   { type: [ExerciseEntrySchema], default: [] },
  totalVolume: { type: Number },
}, { timestamps: { createdAt: true, updatedAt: false } });

export default mongoose.model('Workout', WorkoutSchema);
