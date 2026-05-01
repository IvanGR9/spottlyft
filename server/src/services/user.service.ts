import User from '../models/User.js';

export async function getUserById(id: string) {
  const user = await User.findById(id).select('-password');
  if (!user) throw new Error('NOT_FOUND');
  return user;
}

export async function createUser(data: {
  username: string;
  email: string;
  gymId: string;
  password: string;
}) {
  const user = await User.create(data);
  const { password: _pw, ...rest } = user.toObject();
  return rest;
}
