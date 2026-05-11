import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useUser } from '../context/UserContext.js';
import { workoutClient, gymClient, userClient, routineClient } from '../api/client.js';
import type { Workout, LeaderboardEntry, User } from '../types/index.js';

const tabs = ['Resumen', 'Historial', 'Logros'];

const AVATAR_COLORS = ['#f97316', '#3b82f6', '#a855f7', '#22c55e', '#ec4899'];

const MOTIVATIONAL = [
  { icon: '🔥', phrase: '¡El primer paso es el más difícil, y ya lo diste!' },
  { icon: '💪', phrase: 'Cada entrenamiento te acerca a la mejor versión de ti.' },
  { icon: '🎯', phrase: 'La constancia supera al talento. Sigue adelante.' },
];

const WEEKLY_CHALLENGES = [
  { icon: '📅', text: 'Completa 3 entrenamientos esta semana' },
  { icon: '🏋️', text: 'Prueba un ejercicio nuevo hoy' },
  { icon: '⚡', text: 'Supera tu volumen máximo de la semana pasada' },
];

function formatVolume(kg: number): string {
  if (kg >= 1000) return `${(kg / 1000).toFixed(1)}K kg`;
  return `${kg} kg`;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('es-ES', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function rankOf(list: LeaderboardEntry[], userId: string, key: keyof LeaderboardEntry): number {
  return [...list]
    .sort((a, b) => (b[key] as number) - (a[key] as number))
    .findIndex(e => e.userId === userId) + 1;
}

function computeBestMarks(workouts: Workout[]): { name: string; kg: number }[] {
  const map = new Map<string, number>();
  for (const w of workouts) {
    for (const ex of w.exercises) {
      if (!ex.name) continue;
      for (const s of ex.sets) {
        const kg = s.kg ?? 0;
        if (kg > (map.get(ex.name) ?? 0)) map.set(ex.name, kg);
      }
    }
  }
  return [...map.entries()]
    .map(([name, kg]) => ({ name, kg }))
    .sort((a, b) => b.kg - a.kg)
    .slice(0, 5);
}

export default function Profile() {
  const { user, gym, setUser } = useUser();
  const navigate = useNavigate();
  const { userId: paramUserId } = useParams<{ userId: string }>();

  const isOwnProfile = !paramUserId || paramUserId === user?.id;
  const targetUserId = paramUserId ?? user?.id ?? '';

  console.log('[Profile] paramUserId:', paramUserId, '| user?.id:', user?.id, '| isOwnProfile:', isOwnProfile);

  const [profileUser, setProfileUser] = useState<User | null>(isOwnProfile ? user : null);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Resumen');
  const [visibleCount, setVisibleCount] = useState(5);
  const [copiedWorkoutId, setCopiedWorkoutId] = useState<string | null>(null);

  // bio
  const [editingBio, setEditingBio] = useState(false);
  const [bioValue, setBioValue] = useState('');
  const [savingBio, setSavingBio] = useState(false);

  // avatar menu / color / upload
  const [showAvatarMenu, setShowAvatarMenu] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const avatarMenuRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (avatarMenuRef.current && !avatarMenuRef.current.contains(e.target as Node)) {
        setShowAvatarMenu(false);
      }
    }
    if (showAvatarMenu) document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [showAvatarMenu]);

  function resizeToBase64(file: File, maxPx = 200): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = e => {
        const img = new Image();
        img.onload = () => {
          const scale = Math.min(maxPx / img.width, maxPx / img.height, 1);
          const canvas = document.createElement('canvas');
          canvas.width = Math.round(img.width * scale);
          canvas.height = Math.round(img.height * scale);
          canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL('image/jpeg', 0.82));
        };
        img.onerror = reject;
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    e.target.value = '';
    setUploadingAvatar(true);
    try {
      const base64 = await resizeToBase64(file);
      console.log('[Avatar] base64 generado, longitud:', base64.length, '| inicio:', base64.slice(0, 40));
      const updated = await userClient.update(user.id, { avatar: base64 });
      console.log('[Avatar] respuesta servidor — updated.avatar longitud:', updated.avatar?.length ?? 0, '| inicio:', updated.avatar?.slice(0, 40));
      const next = { ...user, avatar: updated.avatar };
      setUser(next);
      setProfileUser(prev => {
        const newState = prev ? { ...prev, avatar: updated.avatar } : prev;
        console.log('[Avatar] profileUser tras setProfileUser — avatar longitud:', newState?.avatar?.length ?? 0);
        return newState;
      });
    } catch (err) {
      console.error('[Avatar] error al subir:', err);
    } finally {
      setUploadingAvatar(false);
    }
  }

  async function handleRemoveAvatar() {
    if (!user) return;
    setShowAvatarMenu(false);
    try {
      const updated = await userClient.update(user.id, { avatar: '' });
      const next = { ...user, avatar: '' };
      setUser(next);
      setProfileUser(prev => prev ? { ...prev, avatar: updated.avatar } : prev);
    } catch { /* ignore */ }
  }

  async function handleSaveBio() {
    if (!user) return;
    setSavingBio(true);
    try {
      const updated = await userClient.update(user.id, { bio: bioValue });
      setUser({ ...user, bio: updated.bio });
      setProfileUser(prev => prev ? { ...prev, bio: updated.bio } : prev);
      setEditingBio(false);
    } catch { /* ignore */ } finally {
      setSavingBio(false);
    }
  }

  async function handleColorSelect(color: string) {
    if (!user) return;
    setShowAvatarMenu(false);
    try {
      const updated = await userClient.update(user.id, { avatarColor: color });
      setUser({ ...user, avatarColor: updated.avatarColor });
      setProfileUser(prev => prev ? { ...prev, avatarColor: updated.avatarColor } : prev);
    } catch { /* ignore */ }
  }

  async function handleCopyRoutine(w: Workout) {
    if (!user) return;
    const id = w.id ?? String((w as unknown as Record<string, unknown>)._id);
    try {
      await routineClient.create({
        userId: user.id,
        gymId: user.gymId,
        name: w.title ?? w.exercises[0]?.name ?? 'Rutina copiada',
        exercises: w.exercises.map(ex => ({
          name: ex.name ?? '',
          muscleGroup: ex.exerciseId ?? undefined,
          sets: ex.sets.map(s => ({ kg: s.kg ?? 0, reps: s.reps ?? 0, rir: s.rir ?? 0 })),
        })),
      });
      setCopiedWorkoutId(id);
      setTimeout(() => setCopiedWorkoutId(null), 2000);
    } catch {
      // silently ignore
    }
  }

  useEffect(() => {
    if (!targetUserId || (isOwnProfile && user?.id === 'guest')) {
      setLoading(false);
      return;
    }
    setWorkouts([]);
    setLeaderboard([]);
    setLoading(true);

    (async () => {
      try {
        if (!isOwnProfile) {
          const fetchedUser = await userClient.getById(targetUserId);
          setProfileUser(fetchedUser);
        }

        const [w, lb] = await Promise.all([
          workoutClient.getByUser(targetUserId),
          gymClient.getLeaderboard(isOwnProfile ? (user?.gymId ?? '') : 'lowgim'),
        ]);
        setWorkouts(w);
        setLeaderboard(lb);
      } catch (err) {
        console.error('[Profile] fetch failed:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, [targetUserId]);

  if (isOwnProfile && user?.id === 'guest') {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center px-6">
        <div className="bg-[#141414] border border-[#1c1c1c] rounded-2xl p-10 max-w-sm w-full text-center">
          <p className="text-6xl mb-6">👤</p>
          <h2 className="text-white font-bold text-xl mb-3">Crea tu perfil en SpottLyft</h2>
          <p className="text-[#71717a] text-sm mb-8">
            Regístrate para ver tu historial, estadísticas y posición en el ranking
          </p>
          <button
            onClick={() => navigate('/login')}
            className="w-full bg-[#f97316] hover:bg-[#ea6c0a] text-white font-bold py-3.5 rounded-xl transition-colors text-sm mb-3"
          >
            Crear cuenta
          </button>
          <button
            onClick={() => navigate('/leaderboard')}
            className="w-full bg-[#141414] hover:bg-[#1c1c1c] text-white font-semibold py-3.5 rounded-xl border border-[#2a2a2a] transition-colors text-sm"
          >
            Ver ranking
          </button>
        </div>
      </div>
    );
  }

  const totalVolume = workouts.reduce((sum, w) => sum + (w.totalVolume ?? 0), 0);
  const totalWorkouts = workouts.length;
  const myEntry = leaderboard.find(e => e.userId === targetUserId);
  const streak = myEntry?.streak ?? profileUser?.streak ?? 0;
  const rankVol = rankOf(leaderboard, targetUserId, 'totalVolume');
  const rankDisplay = rankVol > 0 ? `#${rankVol}` : '—';

  const bestMarks = computeBestMarks(workouts);

  const achievements = [
    { icon: '🔥', title: `Racha de 6 días`,    unlocked: streak >= 6 },
    { icon: '💪', title: '50 entrenamientos',   unlocked: totalWorkouts >= 50 },
    { icon: '🏆', title: '#1 del gimnasio',      unlocked: rankVol === 1 },
    { icon: '⚡', title: 'Racha de 30 días',     unlocked: streak >= 30 },
    { icon: '🎯', title: '100 entrenamientos',   unlocked: totalWorkouts >= 100 },
    { icon: '👑', title: 'Leyenda del gimnasio', unlocked: totalWorkouts >= 200 && streak >= 60 },
  ];

  const recentAchievements = [
    streak > 0 ? { icon: '🔥', title: `Racha de ${streak} días`, sub: streak >= 7 ? '¡Imparable!' : '¡Sigue así!' } : null,
    totalVolume > 0 ? { icon: '💪', title: `${formatVolume(totalVolume)} acumulados`, sub: 'Volumen total' } : null,
    rankVol > 0 ? { icon: '🏆', title: `${rankDisplay} del gimnasio`, sub: 'Posición en ranking' } : null,
  ].filter((a): a is { icon: string; title: string; sub: string } => a !== null);

  return (
    <div className="px-6 py-8 max-w-4xl mx-auto">

      {/* Cabecera */}
      <div className="mb-8">
        {!isOwnProfile && (
          <button
            onClick={() => navigate(-1)}
            className="text-[#71717a] text-sm mb-3 flex items-center gap-1 hover:text-white transition-colors"
          >
            ‹ Volver
          </button>
        )}
        <p className="text-[#71717a] text-sm mb-1">
          {isOwnProfile ? 'Tu historial y estadísticas' : `Perfil de ${profileUser?.username ?? '…'}`}
        </p>
        <h1 className="text-2xl font-bold text-white">
          {isOwnProfile ? 'Perfil' : (profileUser?.username ?? '…')}
        </h1>
      </div>

      {/* Info usuario */}
      <div className="bg-[#141414] border border-[#1c1c1c] rounded-2xl p-6 mb-6">
        <div className="flex items-center gap-4 mb-4">

          {/* Avatar */}
          <div className="relative flex-shrink-0" ref={avatarMenuRef}>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarUpload}
            />
            {/* debug — quitar tras confirmar */}
            {console.log('[Avatar render] profileUser?.avatar longitud:', profileUser?.avatar?.length ?? 0, '| user?.avatar longitud:', user?.avatar?.length ?? 0) as unknown as null}
            <div
              onClick={() => isOwnProfile && setShowAvatarMenu(p => !p)}
              className={`w-16 h-16 rounded-full overflow-hidden flex items-center justify-center text-white font-bold text-2xl select-none ${isOwnProfile ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}`}
              style={profileUser?.avatar ? {} : { backgroundColor: profileUser?.avatarColor ?? '#f97316' }}
            >
              {profileUser?.avatar
                ? <img src={profileUser.avatar} alt="avatar" className="w-full h-full object-cover" />
                : (profileUser?.username.charAt(0).toUpperCase() ?? '?')
              }
            </div>
            {isOwnProfile && (
              <span className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-[#1c1c1c] border border-[#2a2a2a] rounded-full flex items-center justify-center text-[10px] pointer-events-none">
                {uploadingAvatar ? '⏳' : '✏️'}
              </span>
            )}
            {showAvatarMenu && (
              <div className="absolute top-[72px] left-0 z-20 bg-[#1c1c1c] border border-[#2a2a2a] rounded-xl p-3 shadow-xl" style={{ minWidth: 192 }}>
                <p className="text-[#52525b] text-[10px] font-medium uppercase tracking-wider mb-2">Color</p>
                <div className="flex gap-2 mb-3">
                  {AVATAR_COLORS.map(c => (
                    <button
                      key={c}
                      onClick={() => handleColorSelect(c)}
                      className="w-7 h-7 rounded-full border-2 transition-all duration-150 hover:scale-110"
                      style={{
                        backgroundColor: c,
                        borderColor: (profileUser?.avatarColor ?? '#f97316') === c ? 'white' : 'transparent',
                      }}
                    />
                  ))}
                </div>
                <div className="border-t border-[#2a2a2a] pt-2 flex flex-col gap-1">
                  <button
                    onClick={() => { setShowAvatarMenu(false); fileInputRef.current?.click(); }}
                    className="w-full text-left text-sm text-[#a1a1aa] hover:text-white transition-colors py-1 flex items-center gap-2"
                  >
                    📷 Subir foto
                  </button>
                  {profileUser?.avatar && (
                    <button
                      onClick={handleRemoveAvatar}
                      className="w-full text-left text-sm text-red-400/70 hover:text-red-400 transition-colors py-1 flex items-center gap-2"
                    >
                      🗑️ Eliminar foto
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h2 className="text-white font-bold text-xl">{profileUser?.username}</h2>
              {rankVol > 0 && (
                <span className="bg-[#f97316] text-white text-xs font-bold px-2.5 py-1 rounded-full">
                  {rankVol === 1 ? '🥇' : rankVol === 2 ? '🥈' : rankVol === 3 ? '🥉' : '🏅'} {rankDisplay}
                </span>
              )}
            </div>
            <p className="text-[#52525b] text-sm mt-0.5">{isOwnProfile ? (gym?.name ?? 'Gimnasio') : 'Lowgim'} · Miembro</p>
          </div>
        </div>

        {/* Bio */}
        {isOwnProfile && !editingBio && (
          <button
            onClick={() => { setBioValue(profileUser?.bio ?? ''); setEditingBio(true); }}
            className="w-full text-left mb-4 text-sm transition-colors"
          >
            {profileUser?.bio
              ? <span className="text-[#a1a1aa]">{profileUser.bio}</span>
              : <span className="text-[#52525b] italic">Añade una descripción...</span>
            }
          </button>
        )}
        {isOwnProfile && editingBio && (
          <div className="mb-4">
            <textarea
              value={bioValue}
              onChange={e => setBioValue(e.target.value)}
              maxLength={200}
              rows={2}
              autoFocus
              placeholder="Cuéntanos algo sobre ti..."
              className="w-full bg-[#1c1c1c] border border-[#2a2a2a] focus:border-[#f97316]/60 rounded-xl px-3 py-2 text-white text-sm resize-none outline-none transition-colors placeholder:text-[#52525b]"
            />
            <div className="flex items-center justify-between mt-2">
              <span className="text-[#52525b] text-xs">{bioValue.length}/200</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditingBio(false)}
                  className="text-xs text-[#71717a] hover:text-white transition-colors px-3 py-1.5"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveBio}
                  disabled={savingBio}
                  className="text-xs bg-[#f97316] hover:bg-[#ea6c0a] disabled:opacity-50 text-white font-semibold px-3 py-1.5 rounded-lg transition-colors"
                >
                  {savingBio ? 'Guardando…' : 'Guardar'}
                </button>
              </div>
            </div>
          </div>
        )}
        {!isOwnProfile && profileUser?.bio && (
          <p className="text-[#a1a1aa] text-sm mb-4">{profileUser.bio}</p>
        )}

        {/* Stats rápidas */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#1c1c1c]">
          <div className="text-center">
            <p className="text-white font-bold text-xl">{formatVolume(totalVolume)}</p>
            <p className="text-[#52525b] text-xs mt-1">Volumen total</p>
          </div>
          <div className="text-center">
            <p className="text-white font-bold text-xl">{loading ? '—' : totalWorkouts}</p>
            <p className="text-[#52525b] text-xs mt-1">Entrenamientos</p>
          </div>
          <div className="text-center">
            <p className="text-white font-bold text-xl">{streak} días</p>
            <p className="text-[#52525b] text-xs mt-1">Racha actual</p>
          </div>
        </div>
      </div>

      {/* Sección motivacional — solo perfil propio con < 10 entrenos */}
      {isOwnProfile && !loading && totalWorkouts < 10 && (
        <div className="bg-[#141414] border border-[#1c1c1c] rounded-2xl p-5 mb-6">
          <p className="text-[#71717a] text-xs font-medium uppercase tracking-wider mb-4">Tu camino empieza aquí</p>
          <div className="flex flex-col gap-3 mb-5">
            {MOTIVATIONAL.map((m, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-lg leading-none mt-0.5">{m.icon}</span>
                <p className="text-[#a1a1aa] text-sm">{m.phrase}</p>
              </div>
            ))}
          </div>
          <p className="text-[#71717a] text-xs font-medium uppercase tracking-wider mb-3">Retos semanales</p>
          <div className="flex flex-col gap-2">
            {WEEKLY_CHALLENGES.map((c, i) => (
              <div key={i} className="flex items-center gap-3 bg-[#1c1c1c] rounded-xl px-3 py-2.5">
                <span className="text-base">{c.icon}</span>
                <p className="text-white text-sm">{c.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-[#141414] border border-[#1c1c1c] rounded-xl p-1 mb-6">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors ${
              activeTab === tab ? 'bg-[#f97316] text-white' : 'text-[#71717a] hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab: Resumen */}
      {activeTab === 'Resumen' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#141414] border border-[#1c1c1c] rounded-2xl p-5">
            <p className="text-[#71717a] text-xs font-medium uppercase tracking-wider mb-4">Mejores marcas</p>
            {loading && <p className="text-[#52525b] text-sm">Cargando...</p>}
            {!loading && bestMarks.length === 0 && (
              <p className="text-[#52525b] text-sm">Sin registros aún</p>
            )}
            <div className="flex flex-col gap-3">
              {bestMarks.map((r) => (
                <div key={r.name} className="flex items-center justify-between">
                  <p className="text-white text-sm truncate mr-2">{r.name}</p>
                  <p className="text-[#f97316] font-bold text-sm shrink-0">{r.kg} kg</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#141414] border border-[#1c1c1c] rounded-2xl p-5">
            <p className="text-[#71717a] text-xs font-medium uppercase tracking-wider mb-4">Logros recientes</p>
            {!loading && recentAchievements.length === 0 && (
              <p className="text-[#52525b] text-sm">Empieza a entrenar para desbloquear logros</p>
            )}
            <div className="flex flex-col gap-3">
              {recentAchievements.map((a, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-xl">{a.icon}</span>
                  <div>
                    <p className="text-white text-sm font-semibold">{a.title}</p>
                    <p className="text-[#52525b] text-xs">{a.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Historial */}
      {activeTab === 'Historial' && (
        <div className="flex flex-col gap-2">
          {loading && <p className="text-[#71717a] text-sm text-center py-6">Cargando...</p>}
          {!loading && workouts.length === 0 && (
            <div className="bg-[#141414] border border-[#1c1c1c] rounded-2xl p-10 text-center">
              <p className="text-4xl mb-3">🏋️</p>
              <p className="text-white font-semibold mb-1">Sin entrenamientos aún</p>
              <p className="text-[#71717a] text-sm">Completa tu primer entrenamiento para verlo aquí</p>
            </div>
          )}
          {!loading && workouts.slice(0, visibleCount).map(w => {
            const key = w.id ?? String((w as unknown as Record<string, unknown>)._id);
            const copied = copiedWorkoutId === key;
            return (
              <div
                key={key}
                className="bg-[#141414] border border-[#1c1c1c] rounded-xl overflow-hidden hover:border-[#f97316]/30 transition-colors"
              >
                <button
                  onClick={() => navigate(`/workout/${key}`)}
                  className="px-4 py-3 flex items-center justify-between w-full text-left group"
                >
                  <div className="min-w-0">
                    <p className="text-white font-semibold text-sm truncate">
                      {w.title ?? w.exercises[0]?.name ?? 'Entrenamiento'}
                    </p>
                    <p className="text-[#52525b] text-xs mt-0.5">
                      {formatDate(w.date)}{w.duration ? ` · ${w.duration} min` : ''}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-3">
                    <p className="text-[#f97316] font-bold text-sm">{formatVolume(w.totalVolume)}</p>
                    <span className="text-[#52525b] group-hover:text-[#f97316] transition-colors text-xs">›</span>
                  </div>
                </button>
                {!isOwnProfile && (
                  <div className="border-t border-[#1c1c1c] px-4 py-2 flex justify-end">
                    <button
                      onClick={() => handleCopyRoutine(w)}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all duration-150 cursor-pointer ${
                        copied
                          ? 'bg-green-500/10 border-green-500/40 text-green-400'
                          : 'border-[#f97316]/40 text-[#f97316] hover:bg-[#f97316]/10 hover:border-[#f97316]'
                      }`}
                    >
                      {copied ? '¡Rutina copiada! ✓' : 'Copiar rutina'}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
          {!loading && visibleCount < workouts.length && (
            <button
              onClick={() => setVisibleCount(c => c + 5)}
              className="w-full py-3 text-[#71717a] hover:text-white text-sm font-medium transition-colors border border-[#1c1c1c] rounded-xl hover:border-[#f97316]/30"
            >
              Ver más ({workouts.length - visibleCount} restantes)
            </button>
          )}
        </div>
      )}

      {/* Tab: Logros */}
      {activeTab === 'Logros' && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {achievements.map((a, i) => (
            <div
              key={i}
              className={`bg-[#141414] border rounded-2xl p-4 text-center ${
                a.unlocked ? 'border-[#f97316]/30' : 'border-[#1c1c1c] opacity-40'
              }`}
            >
              <span className="text-3xl">{a.icon}</span>
              <p className={`text-sm font-semibold mt-2 ${a.unlocked ? 'text-white' : 'text-[#52525b]'}`}>
                {a.title}
              </p>
              {!a.unlocked && <p className="text-[#52525b] text-xs mt-1">Bloqueado</p>}
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
