import { NavLink } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#1a1a1a] border-t border-[#2a2a2a] px-6 py-3 flex justify-around items-center z-50 md:top-0 md:bottom-auto md:border-t-0 md:border-b">
      <NavLink
        to="/"
        className={({ isActive }) =>
          `flex flex-col items-center gap-1 text-xs transition-colors ${isActive ? 'text-[#e85d26]' : 'text-[#666]'}`
        }
      >
        <span className="text-xl">🏠</span>
        <span>Inicio</span>
      </NavLink>

      <NavLink
        to="/workout"
        className={({ isActive }) =>
          `flex flex-col items-center gap-1 text-xs transition-colors ${isActive ? 'text-[#e85d26]' : 'text-[#666]'}`
        }
      >
        <span className="text-xl">💪</span>
        <span>Entrenar</span>
      </NavLink>

      <NavLink
        to="/leaderboard"
        className={({ isActive }) =>
          `flex flex-col items-center gap-1 text-xs transition-colors ${isActive ? 'text-[#e85d26]' : 'text-[#666]'}`
        }
      >
        <span className="text-xl">🏆</span>
        <span>Ranking</span>
      </NavLink>

      <NavLink
        to="/profile"
        className={({ isActive }) =>
          `flex flex-col items-center gap-1 text-xs transition-colors ${isActive ? 'text-[#e85d26]' : 'text-[#666]'}`
        }
      >
        <span className="text-xl">👤</span>
        <span>Perfil</span>
      </NavLink>
    </nav>
  );
}