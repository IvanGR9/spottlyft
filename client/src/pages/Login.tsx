import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext.js';

type AuthMode = 'welcome' | 'login' | 'register';

export default function Login() {
  const [mode, setMode] = useState<AuthMode>('welcome');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { setUser, setGym } = useUser();
  const navigate = useNavigate();

  function handleGuest() {
    setUser({ id: 'guest', username: 'Invitado', email: '', gymId: 'gym-1' });
    setGym({ id: 'gym-1', name: 'Gimnasio Local', location: 'Madrid', qrCode: 'QR-GYM-001' });
    navigate('/');
  }

  function handleSubmit() {
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
    setUser({ id: 'user-1', username, email, gymId: 'gym-1' });
    setGym({ id: 'gym-1', name: 'Gimnasio Local', location: 'Madrid', qrCode: 'QR-GYM-001' });
    navigate('/');
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center px-4">
      
      {/* Logo */}
      <div className="mb-10 text-center">
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