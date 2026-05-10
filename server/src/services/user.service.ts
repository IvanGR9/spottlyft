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

export async function getUserByEmail(email: string) {
  const user = await User.findOne({ email }).select('-password');
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
  return User.findById(user._id).select('-password');
}

export async function updateUser(id: string, data: { bio?: string; avatarColor?: string; avatar?: string }) {
  const allowed: Record<string, unknown> = {};
  if (data.bio !== undefined) allowed['bio'] = data.bio.slice(0, 200);
  if (data.avatarColor !== undefined) allowed['avatarColor'] = data.avatarColor;
  if (data.avatar !== undefined) allowed['avatar'] = data.avatar;
  const user = await User.findByIdAndUpdate(id, { $set: allowed }, { new: true }).select('-password');
  if (!user) throw new Error('NOT_FOUND');
  return user;
}
