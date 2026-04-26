import StatCard from '../components/StatCard.js';

const recentWorkouts = [
  { title: 'LEGS 5', date: '25 abr 2026', duration: '1h 22min', volume: 121391 },
  { title: 'PULL 4', date: '24 abr 2026', duration: '51min', volume: 94936 },
  { title: 'PUSH 3', date: '23 abr 2026', duration: '1h 06min', volume: 154425 },
  { title: 'LOWER 2', date: '21 abr 2026', duration: '56min', volume: 301137 },
  { title: 'UPPER 1', date: '20 abr 2026', duration: '1h 03min', volume: 193335 },
];

export default function Profile() {
  return (
    <div className="px-4 py-6 max-w-2xl mx-auto">

      {/* Cabecera perfil */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-full bg-[#e85d26] flex items-center justify-center text-white font-bold text-2xl">
          I
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">IvanGR9</h1>
          <p className="text-[#666] text-sm">SpottLyft · Gimnasio Local</p>
        </div>
        <div className="ml-auto bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-full">
          🥇 #1 Ranking
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <StatCard label="Entrenamientos" value="67" />
        <StatCard label="Volumen total" value="5.7M kg" />
        <StatCard label="Racha actual" value="6 días" />
      </div>

      {/* Historial reciente */}
      <h2 className="text-lg font-semibold text-white mb-3">Historial reciente</h2>
      <div className="flex flex-col gap-3">
        {recentWorkouts.map((w, i) => (
          <div key={i} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-white font-semibold">{w.title}</p>
              <p className="text-[#666] text-xs mt-1">{w.date} · {w.duration}</p>
            </div>
            <div className="text-right">
              <p className="text-[#e85d26] font-bold">{w.volume.toLocaleString()} kg</p>
              <p className="text-[#666] text-xs">volumen</p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}