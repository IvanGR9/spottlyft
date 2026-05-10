import { NavLink, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext.js';

export default function Navbar() {
  const { user, logout } = useUser();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <>
      {/* Desktop — sidebar izquierdo */}
      <nav className="hidden md:flex flex-col fixed top-0 left-0 h-full w-56 bg-[#0d0d0d] border-r border-[#1c1c1c] z-50 px-4 py-6">
        
        {/* Logo */}
        <div className="mb-10 px-2">
          <h1 className="text-xl font-bold text-white tracking-tight">
            SPOTT<span className="text-[#f97316]">LYFT</span>
          </h1>
        </div>

        {/* Links */}
        <div className="flex flex-col gap-1 flex-1">
          <NavLink to="/" end className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${isActive ? 'bg-[#f97316] text-white' : 'text-[#71717a] hover:text-white hover:bg-[#1c1c1c]'}`
          }>
            <span className="text-lg">🏠</span> Inicio
          </NavLink>
          <NavLink to="/routines" className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${isActive ? 'bg-[#f97316] text-white' : 'text-[#71717a] hover:text-white hover:bg-[#1c1c1c]'}`
          }>
            <span className="text-lg">💪</span> Entrenar
          </NavLink>
          <NavLink to="/leaderboard" className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${isActive ? 'bg-[#f97316] text-white' : 'text-[#71717a] hover:text-white hover:bg-[#1c1c1c]'}`
          }>
            <span className="text-lg">🏆</span> Ranking
          </NavLink>
          <NavLink to="/profile" className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${isActive ? 'bg-[#f97316] text-white' : 'text-[#71717a] hover:text-white hover:bg-[#1c1c1c]'}`
          }>
            <span className="text-lg">👤</span> Perfil
          </NavLink>
        </div>

        {/* Usuario y logout */}
        <div className="border-t border-[#1c1c1c] pt-4">
          <div className="flex items-center gap-3 px-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-[#f97316] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {user?.username.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-white text-xs font-semibold truncate">{user?.username}</p>
              <p className="text-[#52525b] text-xs truncate">{user?.id === 'guest' ? 'Invitado' : user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full text-left px-3 py-2 text-[#71717a] hover:text-white text-xs transition-colors rounded-xl hover:bg-[#1c1c1c]"
          >
            Cerrar sesión
          </button>
        </div>
      </nav>

      {/* Mobile — bottom bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0d0d0d] border-t border-[#1c1c1c] px-6 py-3 flex justify-around items-center z-50">
        <NavLink to="/" end className={({ isActive }) =>
          `flex flex-col items-center gap-1 text-xs transition-colors ${isActive ? 'text-[#f97316]' : 'text-[#52525b]'}`
        }>
          <span className="text-xl">🏠</span>
          <span>Inicio</span>
        </NavLink>
        <NavLink to="/routines" className={({ isActive }) =>
          `flex flex-col items-center gap-1 text-xs transition-colors ${isActive ? 'text-[#f97316]' : 'text-[#52525b]'}`
        }>
          <span className="text-xl">💪</span>
          <span>Entrenar</span>
        </NavLink>
        <NavLink to="/leaderboard" className={({ isActive }) =>
          `flex flex-col items-center gap-1 text-xs transition-colors ${isActive ? 'text-[#f97316]' : 'text-[#52525b]'}`
        }>
          <span className="text-xl">🏆</span>
          <span>Ranking</span>
        </NavLink>
        <NavLink to="/profile" className={({ isActive }) =>
          `flex flex-col items-center gap-1 text-xs transition-colors ${isActive ? 'text-[#f97316]' : 'text-[#52525b]'}`
        }>
          <span className="text-xl">👤</span>
          <span>Perfil</span>
        </NavLink>
      </nav>
    </>
  );
}