import User from '../models/User.js';

export async function getUserById(id: string) {
  const user = await User.findById(id).select('-password');
  if (!user) throw new Error('NOT_FOUND');
  return user;
}

export async function getUserByUsername(username: string, password: string) {
  const user = await User.findOne({ username });
  if (!user) throw new Error('NOT_FOUND');
  if (user.password !== password) throw new Error('INVALID_PASSWORD');
  return User.findById(user._id).select('-password');
}

export async function createUser(data: {
  username: string;
  email: string;
  gymId: string;
  password: string;
}) {
  const user = await User.create(data);
  return User.findById(user._id).select('-password');
}
