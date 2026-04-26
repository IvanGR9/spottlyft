import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <p className="text-8xl mb-6">🏋️</p>
      <h1 className="text-6xl font-bold text-[#e85d26] mb-2">404</h1>
      <h2 className="text-xl font-semibold text-white mb-2">Página no encontrada</h2>
      <p className="text-[#666] text-sm mb-8">Parece que esta ruta no existe en tu gimnasio</p>
      <button
        onClick={() => navigate('/')}
        className="bg-[#e85d26] hover:bg-[#d14e1a] text-white font-bold px-6 py-3 rounded-xl transition-colors"
      >
        Volver al inicio
      </button>
    </div>
  );
}