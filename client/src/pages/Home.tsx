import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext.js';

const stats = [
  { label: 'Entrenamientos', value: '67', sub: 'Total' },
  { label: 'Volumen total', value: '430K kg', sub: 'Acumulado' },
  { label: 'Racha actual', value: '6 días', sub: 'Consecutivos' },
];

const ranking = [
  { label: 'Volumen total', value: '#1' },
  { label: 'Entrenamientos', value: '#1' },
  { label: 'Racha de días', value: '#1' },
];

const recentActivity = [
  { name: 'LEGS 5', sets: '8 series', weight: '5.748 kg', date: '25 abr, 18:31' },
  { name: 'PULL 4', sets: '7 series', weight: '3.813 kg', date: '24 abr, 13:58' },
  { name: 'PUSH 3', sets: '9 series', weight: '5.580 kg', date: '23 abr, 12:11' },
];

export default function Home() {
  const { user } = useUser();
  const navigate = useNavigate();

  return (
    <div className="px-6 py-8 max-w-4xl mx-auto">

      {/* Cabecera */}
      <div className="mb-8">
        <p className="text-[#71717a] text-sm mb-1">Resumen de tu progreso esta semana</p>
        <h1 className="text-2xl font-bold text-white">Inicio ⚡</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Columna izquierda */}
        <div className="flex flex-col gap-4">

          {/* Stats */}
          <div className="bg-[#141414] border border-[#1c1c1c] rounded-2xl p-5">
            <p className="text-[#71717a] text-xs font-medium uppercase tracking-wider mb-4">Estadísticas</p>
            <div className="grid grid-cols-3 gap-3">
              {stats.map(s => (
                <div key={s.label} className="text-center">
                  <p className="text-white font-bold text-xl">{s.value}</p>
                  <p className="text-[#52525b] text-xs mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Racha */}
          <div className="bg-[#141414] border border-[#1c1c1c] rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-white font-semibold text-sm">Racha actual</p>
              <span className="text-[#f97316] font-bold text-sm">🔥 6 días</span>
            </div>
            <div className="flex gap-1.5">
              {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((day, i) => (
                <div key={day} className="flex flex-col items-center gap-1 flex-1">
                  <div className={`w-full h-7 rounded-lg flex items-center justify-center text-xs font-bold ${i < 6 ? 'bg-[#f97316] text-white' : 'bg-[#1c1c1c] text-[#52525b]'}`}>
                    ✓
                  </div>
                  <span className="text-[#52525b] text-xs">{day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Actividad reciente */}
          <div className="bg-[#141414] border border-[#1c1c1c] rounded-2xl p-5">
            <p className="text-[#71717a] text-xs font-medium uppercase tracking-wider mb-4">Actividad reciente</p>
            <div className="flex flex-col gap-3">
              {recentActivity.map((a, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div>
                    <p className="text-white text-sm font-semibold">{a.name}</p>
                    <p className="text-[#52525b] text-xs mt-0.5">{a.sets} · {a.date}</p>
                  </div>
                  <p className="text-[#f97316] text-sm font-bold">{a.weight}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Columna derecha */}
        <div className="flex flex-col gap-4">

          {/* Tu posición */}
          <div className="bg-[#141414] border border-[#1c1c1c] rounded-2xl p-5">
            <p className="text-[#71717a] text-xs font-medium uppercase tracking-wider mb-4">Tu posición</p>
            <div className="flex flex-col gap-3">
              {ranking.map(r => (
                <div key={r.label} className="flex items-center justify-between bg-[#1c1c1c] rounded-xl px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">🏆</span>
                    <p className="text-white text-sm font-medium">{r.label}</p>
                  </div>
                  <p className="text-[#f97316] font-bold text-lg">{r.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Botón entrenar */}
          <button
            onClick={() => navigate('/workout')}
            className="w-full bg-[#f97316] hover:bg-[#ea6c0a] text-white font-bold py-4 rounded-2xl text-base transition-colors"
          >
            + Iniciar entrenamiento
          </button>

          {/* Bienvenida */}
          <div className="bg-[#141414] border border-[#1c1c1c] rounded-2xl p-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#f97316] flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                {user?.username.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-white font-bold">{user?.username}</p>
                <p className="text-[#52525b] text-xs mt-0.5">Gimnasio Local · {user?.id === 'guest' ? 'Invitado' : 'Miembro'}</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}