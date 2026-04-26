import type { LeaderboardEntry } from '../types/index.js';

interface LeaderboardCardProps {
  entry: LeaderboardEntry;
}

export default function LeaderboardCard({ entry }: LeaderboardCardProps) {
  const medalColors: Record<number, string> = {
    1: 'text-yellow-400',
    2: 'text-gray-300',
    3: 'text-amber-600',
  };

  return (
    <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4 flex items-center gap-4">
      {/* Posición */}
      <span className={`text-xl font-bold w-8 text-center ${medalColors[entry.rank] ?? 'text-[#666]'}`}>
        {entry.rank <= 3 ? ['🥇', '🥈', '🥉'][entry.rank - 1] : `#${entry.rank}`}
      </span>

      {/* Avatar */}
      <div className="w-10 h-10 rounded-full bg-[#e85d26] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
        {entry.username.charAt(0).toUpperCase()}
      </div>

      {/* Info */}
      <div className="flex-1">
        <p className="text-white font-semibold">{entry.username}</p>
        <p className="text-[#666] text-xs">{entry.totalWorkouts} entrenamientos · {entry.streak} días de racha</p>
      </div>

      {/* Volumen */}
      <div className="text-right">
        <p className="text-[#e85d26] font-bold">{entry.totalVolume.toLocaleString()} kg</p>
        <p className="text-[#666] text-xs">volumen</p>
      </div>
    </div>
  );
}