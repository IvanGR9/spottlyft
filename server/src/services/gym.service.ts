import mongoose from 'mongoose';
import Gym from '../models/Gym.js';

export async function getAllGyms() {
  return Gym.find();
}

export async function getGymById(id: string) {
  const gym = mongoose.isValidObjectId(id)
    ? await Gym.findById(id)
    : await Gym.findOne({ qrCode: id });
  if (!gym) throw new Error('NOT_FOUND');
  return gym;
}
