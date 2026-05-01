import Gym from '../models/Gym.js';

export async function getAllGyms() {
  return Gym.find();
}

export async function getGymById(id: string) {
  const gym = await Gym.findById(id);
  if (!gym) throw new Error('NOT_FOUND');
  return gym;
}
