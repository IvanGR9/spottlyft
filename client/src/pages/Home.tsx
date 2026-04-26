import StatCard from '../components/StatCard.js';

export default function Home() {
  return (
    <div className="px-4 py-6 max-w-2xl mx-auto">
      
      {/* Cabecera */}
      <div className="mb-6">
        <p className="text-[#666] text-sm">Bienvenido de nuevo 👋</p>
        <h1 className="text-2xl font-bold text-white">SpottLyft</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <StatCard label="Entrenamientos" value="0" />
        <StatCard label="Volumen total" value="0 kg" />
        <StatCard label="Racha" value="0 días" />
      </div>

      {/* Botón entrenar */}
      <button className="w-full bg-[#e85d26] hover:bg-[#d14e1a] text-white font-bold py-4 rounded-xl text-lg transition-colors mb-6">
        Iniciar entrenamiento 💪
      </button>

      {/* Actividad reciente */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-3">Actividad reciente</h2>
        <div className="bg-[#1a1a1a] rounded-xl p-6 text-center border border-[#2a2a2a]">
          <p className="text-[#666] text-sm">Aún no hay entrenamientos registrados</p>
          <p className="text-[#444] text-xs mt-1">¡Empieza hoy tu primera sesión!</p>
        </div>
      </div>

    </div>
  );
}