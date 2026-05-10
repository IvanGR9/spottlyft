import { type Request, type Response } from 'express';
import { getUserById, getUserByUsername, getUserByEmail, createUser, updateUser } from '../services/user.service.js';

export async function getUserByQuery(req: Request, res: Response): Promise<void> {
  const { username, password } = req.query as { username?: string; password?: string };
  if (!username || !password) {
    res.status(400).json({ success: false, error: 'username y password son obligatorios' });
    return;
  }
  try {
    const user = await getUserByUsername(username, password);
    res.status(200).json({ success: true, data: user });
  } catch (err: unknown) {
    const msg = (err as Error).message;
    if (msg === 'NOT_FOUND' || msg === 'INVALID_PASSWORD') {
      res.status(401).json({ success: false, error: 'Usuario o contraseña incorrectos' });
      return;
    }
    res.status(500).json({ success: false, error: 'Error interno' });
  }
}

export async function getUserByEmailHandler(req: Request, res: Response): Promise<void> {
  const { email } = req.query as { email?: string };
  if (!email) {
    res.status(400).json({ success: false, error: 'email es obligatorio' });
    return;
  }
  try {
    const user = await getUserByEmail(email);
    res.status(200).json({ success: true, data: user });
  } catch {
    res.status(404).json({ success: false, error: 'Usuario no encontrado' });
  }
}

export async function getUser(req: Request, res: Response): Promise<void> {
  try {
    const user = await getUserById(String(req.params['id']));
    res.status(200).json({ success: true, data: user });
  } catch {
    res.status(404).json({ success: false, error: 'Usuario no encontrado' });
  }
}

export async function patchUser(req: Request, res: Response): Promise<void> {
  const { bio, avatarColor, avatar } = req.body as { bio?: string; avatarColor?: string; avatar?: string };
  try {
    const user = await updateUser(String(req.params['id']), { bio, avatarColor, avatar });
    res.status(200).json({ success: true, data: user });
  } catch {
    res.status(404).json({ success: false, error: 'Usuario no encontrado' });
  }
}

export async function postUser(req: Request, res: Response): Promise<void> {
  const { username, email, gymId, password } = req.body as {
    username?: string;
    email?: string;
    gymId?: string;
    password?: string;
  };

  if (!username || !email || !gymId || !password) {
    res.status(400).json({ success: false, error: 'username, email, gymId y password son obligatorios' });
    return;
  }

  try {
    const user = await createUser({ username, email, gymId, password });
    res.status(201).json({ success: true, data: user });
  } catch (err: unknown) {
    if ((err as { code?: number }).code === 11000) {
      res.status(409).json({ success: false, error: 'El username o email ya existe' });
      return;
    }
    res.status(500).json({ success: false, error: 'Error al crear el usuario' });
  }
}
