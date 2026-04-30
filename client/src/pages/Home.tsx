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

const gymTop3 = [
  { name: 'IvanGR9', weight: '33.060 kg', kg: 33.060, medal: '🥇' },
  { name: 'CarlosF', weight: '28.450 kg', kg: 28.450, medal: '🥈' },
  { name: 'MartaLP', weight: '22.180 kg', kg: 22.180, medal: '🥉' },
];

const gymStats = [
  { value: '238+', label: 'miembros activos' },
  { value: '33K kg', label: 'levantados esta semana' },
  { value: '6 días', label: 'mejor racha activa' },
];

function GuestHome({ navigate }: { navigate: (path: string) => void }) {
  const maxKg = gymTop3[0].kg;

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center px-6 py-14 max-w-md mx-auto">

      {/* Hero */}
      <div className="flex flex-col items-center text-center mb-10">
        <img src="/logo.png" className="w-20 h-20 mb-6" alt="SpottLyft logo" />
        <h1 className="text-3xl font-black text-white leading-tight mb-3">
          ¿Eres el más fuerte<br />de tu gimnasio?
        </h1>
        <p className="text-[#71717a] text-base">Únete a SpottLyft y descúbrelo</p>
      </div>

      {/* Ranking */}
      <div className="w-full bg-[#141414] border border-[#1c1c1c] rounded-2xl p-6 mb-4">
        <p className="text-white font-bold text-base mb-5">🏆 Ranking esta semana</p>
        <div className="flex flex-col gap-5">
          {gymTop3.map((entry) => {
            const pct = Math.round((entry.kg / maxKg) * 100);
            return (
              <div key={entry.name}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{entry.medal}</span>
                    <p className="text-white font-bold text-sm">{entry.name}</p>
                  </div>
                  <p className="text-[#f97316] font-black text-lg">{entry.weight}</p>
                </div>
                <div className="w-full h-1.5 bg-[#1c1c1c] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#f97316] rounded-full"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stats */}
      <div className="w-full bg-[#141414] border border-[#1c1c1c] rounded-2xl p-6 mb-8">
        <div className="grid grid-cols-3 gap-2 text-center">
          {gymStats.map((s) => (
            <div key={s.label}>
              <p className="text-white font-black text-2xl">{s.value}</p>
              <p className="text-[#52525b] text-xs mt-1 leading-tight">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <button
        onClick={() => navigate('/login')}
        className="w-full bg-[#f97316] hover:bg-[#ea6c0a] active:scale-95 text-white font-black py-4 rounded-2xl text-base transition-all mb-4"
      >
        Empieza gratis ahora →
      </button>
      <p className="text-[#71717a] text-sm">
        ¿Ya tienes cuenta?{' '}
        <span
          className="text-[#f97316] cursor-pointer hover:underline"
          onClick={() => navigate('/login')}
        >
          Inicia sesión
        </span>
      </p>

    </div>
  );
}

export default function Home() {
  const { user } = useUser();
  const navigate = useNavigate();

  if (user?.id === 'guest') {
    return <GuestHome navigate={navigate} />;
  }

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
            onClick={() => navigate(user?.id === 'guest' ? '/login' : '/workout')}
            className="w-full bg-[#f97316] hover:bg-[#ea6c0a] text-white font-bold py-4 rounded-2xl text-base transition-colors"
          >
            {user?.id === 'guest' ? 'Únete para entrenar' : '+ Iniciar entrenamiento'}
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