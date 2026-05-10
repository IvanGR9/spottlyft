import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase.js';
import { useUser } from '../context/UserContext.js';
import { userClient, gymClient } from '../api/client.js';

type AuthMode = 'welcome' | 'login' | 'register';

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    </svg>
  );
}

export default function Login() {
  const [mode, setMode] = useState<AuthMode>('welcome');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);
  const { setUser, setGym } = useUser();
  const navigate = useNavigate();

  function handleGuest() {
    setUser({ id: 'guest', username: 'Invitado', email: '', gymId: 'lowgim' });
    setGym({ id: 'lowgim', name: 'Lowgim', location: 'Madrid', qrCode: 'lowgim' });
    navigate('/');
  }

  async function handleGoogleLogin() {
    setGoogleLoading(true);
    setError('');
    try {
      googleProvider.setCustomParameters({ prompt: 'select_account' });
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;
      const fbEmail = firebaseUser.email!;
      const displayName = (firebaseUser.displayName ?? fbEmail.split('@')[0]).slice(0, 20);

      let appUser;
      try {
        appUser = await userClient.getByEmail(fbEmail);
      } catch {
        appUser = await userClient.create({
          username: displayName,
          email: fbEmail,
          gymId: 'lowgim',
          password: crypto.randomUUID(),
        });
      }

      const gyms = await gymClient.getAll();
      const gym = gyms[0]!;
      setUser(appUser);
      setGym(gym);
      navigate('/');
    } catch (err: unknown) {
      const code = (err as { code?: string }).code;
      if (code !== 'auth/popup-closed-by-user' && code !== 'auth/cancelled-popup-request') {
        setError('Error al iniciar sesión con Google. Inténtalo de nuevo.');
      }
    } finally {
      setGoogleLoading(false);
    }
  }

  async function handleSubmit() {
    if (username.trim().length < 3) {
      setError('El nombre debe tener al menos 3 caracteres');
      return;
    }
    if (mode === 'register' && !email.includes('@')) {
      setError('Introduce un email válido');
      return;
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    setError('');
    try {
      const user = mode === 'login'
        ? await userClient.login(username.trim(), password)
        : await userClient.create({ username: username.trim(), email, gymId: 'lowgim', password });
      const gym = await gymClient.getById(user.gymId);
      setUser(user);
      setGym(gym);
      navigate('/');
    } catch (err: unknown) {
      setError((err as Error).message);
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center px-4">

      {/* Logo */}
      <div className="mb-10 text-center">
        <img src="/logo.png" alt="SpottLyft" className="w-36 h-36 mb-4 rounded-2xl mx-auto" />
        <h1 className="text-4xl font-bold text-white tracking-tight">
          SPOTT<span className="text-[#f97316]">LYFT</span>
        </h1>
        <p className="text-[#71717a] text-sm mt-2">Compite. Progresa. Domina.</p>
      </div>

      <div className="w-full max-w-sm">

        {mode === 'welcome' && (
          <div className="flex flex-col gap-3">
            <button
              onClick={() => setMode('register')}
              className="w-full bg-[#f97316] hover:bg-[#ea6c0a] text-white font-bold py-3.5 rounded-xl transition-colors text-sm"
            >
              Crear cuenta
            </button>
            <button
              onClick={() => setMode('login')}
              className="w-full bg-[#141414] hover:bg-[#1c1c1c] text-white font-semibold py-3.5 rounded-xl border border-[#2a2a2a] transition-colors text-sm"
            >
              Iniciar sesión
            </button>

            <div className="flex items-center gap-3 my-1">
              <div className="flex-1 h-px bg-[#2a2a2a]" />
              <span className="text-[#52525b] text-xs">o</span>
              <div className="flex-1 h-px bg-[#2a2a2a]" />
            </div>

            <button
              onClick={handleGoogleLogin}
              disabled={googleLoading}
              className="w-full bg-white hover:bg-gray-100 disabled:opacity-60 text-[#1a1a1a] font-semibold py-3.5 rounded-xl transition-colors text-sm flex items-center justify-center gap-2.5"
            >
              <GoogleIcon />
              {googleLoading ? 'Conectando...' : 'Continuar con Google'}
            </button>

            {error && <p className="text-red-400 text-xs text-center">{error}</p>}

            <button
              onClick={handleGuest}
              className="w-full text-[#71717a] hover:text-white font-medium py-3 transition-colors text-sm"
            >
              Entrar como invitado →
            </button>
          </div>
        )}

        {(mode === 'login' || mode === 'register') && (
          <div className="flex flex-col gap-4">
            <h2 className="text-white font-bold text-xl mb-2">
              {mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
            </h2>

            <input
              type="text"
              placeholder="Nombre de usuario"
              value={username}
              onChange={e => { setUsername(e.target.value); setError(''); }}
              className="w-full bg-[#141414] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white text-sm placeholder:text-[#52525b] outline-none focus:border-[#f97316] transition-colors"
            />

            {mode === 'register' && (
              <input
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={e => { setEmail(e.target.value); setError(''); }}
                className="w-full bg-[#141414] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white text-sm placeholder:text-[#52525b] outline-none focus:border-[#f97316] transition-colors"
              />
            )}

            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={e => { setPassword(e.target.value); setError(''); }}
              className="w-full bg-[#141414] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white text-sm placeholder:text-[#52525b] outline-none focus:border-[#f97316] transition-colors"
            />

            {error && (
              <p className="text-red-400 text-xs">{error}</p>
            )}

            <button
              onClick={handleSubmit}
              className="w-full bg-[#f97316] hover:bg-[#ea6c0a] text-white font-bold py-3.5 rounded-xl transition-colors text-sm"
            >
              {mode === 'login' ? 'Entrar' : 'Registrarse'}
            </button>

            <button
              onClick={() => { setMode('welcome'); setError(''); }}
              className="text-[#71717a] hover:text-white text-sm transition-colors text-center"
            >
              ← Volver
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
