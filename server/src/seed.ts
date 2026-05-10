import { fileURLToPath } from 'url';
import path from 'path';
import { config } from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
config({ path: path.resolve(__dirname, '../.env') });

import mongoose, { Types } from 'mongoose';
import Gym from './models/Gym.js';
import User from './models/User.js';
import Workout from './models/Workout.js';
import Routine from './models/Routine.js';

// ─── helpers ──────────────────────────────────────────────────────────────────

const r  = (min: number, max: number) => Math.random() * (max - min) + min;
const ri = (min: number, max: number) => Math.floor(r(min, max + 1));
const shuffle = <T>(arr: T[]) => [...arr].sort(() => Math.random() - 0.5);

const TODAY = new Date();
TODAY.setHours(12, 0, 0, 0);

function daysAgo(n: number): Date {
  const d = new Date(TODAY);
  d.setDate(d.getDate() - n);
  return d;
}

/**
 * Distribuye targetTotal en `count` valores con ±15% variación y decimales
 * irregulares. La suma es exactamente targetTotal (ajuste en el último slot).
 */
function distributeVolume(targetTotal: number, count: number): number[] {
  const actual = Math.round(targetTotal * r(0.92, 1.08) + ri(1, 999));
  const avg = actual / count;
  const raw = Array.from({ length: count }, () =>
    avg * r(0.85, 1.15) + ri(-9, 9) * 0.1 + ri(-9, 9) * 0.01,
  );
  const scale = actual / raw.reduce((s, v) => s + v, 0);
  const scaled = raw.map(v => Math.round(v * scale * 100) / 100);

  const diff = Math.round((actual - scaled.reduce((s, v) => s + v, 0)) * 100) / 100;
  scaled[scaled.length - 1]! += diff;

  return shuffle(scaled);
}

// ─── fechas ───────────────────────────────────────────────────────────────────

function generateDates(count: number, streakDays: number, daysBack = 91): Date[] {
  const dates: Date[] = [];
  for (let i = 0; i < streakDays; i++) dates.push(daysAgo(i));

  const gapDay = streakDays > 0 ? streakDays : 0; // día libre que rompe la racha
  const available: Date[] = [];
  for (let i = gapDay + 1; i <= daysBack; i++) available.push(daysAgo(i));
  shuffle(available).slice(0, count - streakDays).forEach(d => dates.push(d));

  return dates.sort((a, b) => a.getTime() - b.getTime());
}

// ─── ejercicios (pesos 20-80 kg) ─────────────────────────────────────────────

interface ExDef { name: string; muscle: string; kg: number; minReps: number; maxReps: number; }

const lib: Record<string, ExDef[]> = {
  PUSH: [
    { name: 'Press de Pecho en Máquina',       muscle: 'Pecho',   kg: 68, minReps: 8,  maxReps: 12 },
    { name: 'Press Inclinado en Smith',         muscle: 'Pecho',   kg: 68, minReps: 6,  maxReps: 10 },
    { name: 'Aperturas en Máquina',             muscle: 'Pecho',   kg: 55, minReps: 10, maxReps: 14 },
    { name: 'Extensiones de Tríceps en Polea',  muscle: 'Tríceps', kg: 30, minReps: 10, maxReps: 15 },
    { name: 'Press Militar en Smith',           muscle: 'Hombro',  kg: 50, minReps: 8,  maxReps: 12 },
    { name: 'Elevaciones Laterales',            muscle: 'Hombro',  kg: 16, minReps: 12, maxReps: 20 },
    { name: 'Fondos con Lastre',                muscle: 'Pecho',   kg: 35, minReps: 8,  maxReps: 12 },
  ],
  PULL: [
    { name: 'Jalón al Pecho en Polea',          muscle: 'Espalda', kg: 76, minReps: 8,  maxReps: 12 },
    { name: 'Remo en Polea Baja',               muscle: 'Espalda', kg: 55, minReps: 8,  maxReps: 12 },
    { name: 'Remo con Barra',                   muscle: 'Espalda', kg: 65, minReps: 6,  maxReps: 10 },
    { name: 'Curl de Bíceps con Mancuerna',     muscle: 'Bíceps',  kg: 18, minReps: 10, maxReps: 14 },
    { name: 'Curl Predicador en Máquina',       muscle: 'Bíceps',  kg: 38, minReps: 10, maxReps: 14 },
    { name: 'Face Pull en Polea',               muscle: 'Hombro',  kg: 22, minReps: 15, maxReps: 20 },
    { name: 'Dominadas con Lastre',             muscle: 'Espalda', kg: 20, minReps: 6,  maxReps: 9  },
  ],
  LEGS: [
    { name: 'Prensa de Piernas',                muscle: 'Cuádriceps', kg: 180, minReps: 8,  maxReps: 12 },
    { name: 'Sentadilla Belt Squat',            muscle: 'Cuádriceps', kg: 100, minReps: 8,  maxReps: 10 },
    { name: 'Curl Femoral Sentado',             muscle: 'Isquios',    kg:  45, minReps: 10, maxReps: 14 },
    { name: 'Extensión de Cuádriceps',          muscle: 'Cuádriceps', kg:  55, minReps: 12, maxReps: 15 },
    { name: 'Peso Muerto Rumano',               muscle: 'Isquios',    kg:  72, minReps: 8,  maxReps: 12 },
    { name: 'Elevaciones de Talones',           muscle: 'Gemelos',    kg:  50, minReps: 15, maxReps: 20 },
    { name: 'Hip Thrust en Máquina',            muscle: 'Glúteos',    kg:  80, minReps: 10, maxReps: 14 },
  ],
  LOWER: [
    { name: 'Prensa de Piernas',                muscle: 'Cuádriceps', kg: 180, minReps: 8,  maxReps: 12 },
    { name: 'Curl Femoral Sentado',             muscle: 'Isquios',    kg:  45, minReps: 10, maxReps: 14 },
    { name: 'Peso Muerto Rumano',               muscle: 'Isquios',    kg:  72, minReps: 8,  maxReps: 12 },
    { name: 'Extensión de Cuádriceps',          muscle: 'Cuádriceps', kg:  55, minReps: 12, maxReps: 15 },
    { name: 'Hip Thrust en Máquina',            muscle: 'Glúteos',    kg:  80, minReps: 10, maxReps: 14 },
    { name: 'Elevaciones de Talones',           muscle: 'Gemelos',    kg:  50, minReps: 15, maxReps: 20 },
    { name: 'Aducción de Cadera',               muscle: 'Glúteos',    kg:  60, minReps: 12, maxReps: 15 },
  ],
  UPPER: [
    { name: 'Press de Pecho en Máquina',        muscle: 'Pecho',   kg: 65, minReps: 8,  maxReps: 12 },
    { name: 'Jalón al Pecho en Polea',          muscle: 'Espalda', kg: 72, minReps: 8,  maxReps: 12 },
    { name: 'Press Militar en Smith',           muscle: 'Hombro',  kg: 47, minReps: 8,  maxReps: 12 },
    { name: 'Remo con Mancuerna',               muscle: 'Espalda', kg: 40, minReps: 10, maxReps: 14 },
    { name: 'Curl de Bíceps con Barra',         muscle: 'Bíceps',  kg: 32, minReps: 10, maxReps: 15 },
    { name: 'Extensiones de Tríceps en Polea',  muscle: 'Tríceps', kg: 30, minReps: 12, maxReps: 15 },
  ],
};

// Pesos específicos para IvanGR9 (sobreescriben la librería)
const ivanKg: Record<string, number> = {
  'Prensa de Piernas':       240,
  'Jalón al Pecho en Polea':  83,
  'Press Inclinado en Smith':  70,
};

interface RoutineDef {
  title:     string;
  duration:  number;
  exercises: { name: string; sets: { kg: number; reps: number; rir: number }[] }[];
}

const ivanRoutines: RoutineDef[] = [
  { title: 'UPPER 1', duration: 73, exercises: [
    { name: 'Press Banca Inclinado Mancuerna', sets: [{ kg: 32, reps: 9, rir: 2 }, { kg: 34, reps: 7, rir: 1 }] },
    { name: 'Remo en T',                       sets: [{ kg: 50, reps: 7, rir: 2 }, { kg: 52, reps: 6, rir: 1 }] },
    { name: 'Press Hombros Smith',             sets: [{ kg: 40, reps: 6, rir: 2 }, { kg: 42, reps: 5, rir: 1 }] },
    { name: 'Press Pecho Máquina',             sets: [{ kg: 70, reps: 10, rir: 2 }, { kg: 72, reps: 9, rir: 1 }] },
    { name: 'Jalón al Pecho Cable',            sets: [{ kg: 55, reps: 9, rir: 2 }, { kg: 57, reps: 7, rir: 1 }] },
    { name: 'Elevación Laterales Mancuerna',   sets: [{ kg: 14, reps: 11, rir: 2 }, { kg: 14, reps: 10, rir: 1 }] },
    { name: 'Curl Bayesian',                   sets: [{ kg: 12, reps: 9, rir: 2 }, { kg: 12, reps: 9, rir: 1 }] },
    { name: 'Tríceps Pressdown',               sets: [{ kg: 30, reps: 8, rir: 2 }, { kg: 32, reps: 8, rir: 1 }] },
  ] },
  { title: 'LOWER 2', duration: 60, exercises: [
    { name: 'Aducción de Caderas',                sets: [{ kg: 60,  reps: 10, rir: 2 }, { kg: 62,  reps: 9,  rir: 1 }] },
    { name: 'Extensiones de Cuads',               sets: [{ kg: 55,  reps: 10, rir: 2 }, { kg: 57,  reps: 10, rir: 1 }] },
    { name: 'Sentadilla Belt Squat',              sets: [{ kg: 120, reps: 8,  rir: 2 }, { kg: 125, reps: 6,  rir: 1 }] },
    { name: 'Curl de Piernas Acostado Máquina',   sets: [{ kg: 45,  reps: 10, rir: 2 }, { kg: 47,  reps: 9,  rir: 1 }] },
    { name: 'Press de Piernas',                   sets: [{ kg: 240, reps: 8,  rir: 2 }, { kg: 240, reps: 7,  rir: 1 }, { kg: 220, reps: 7, rir: 0 }] },
    { name: 'Press de Pantorrilla Máquina',       sets: [{ kg: 80,  reps: 10, rir: 2 }, { kg: 82,  reps: 9,  rir: 1 }] },
  ] },
  { title: 'PUSH 3',  duration: 46, exercises: [
    { name: 'Aperturas Máquina',                       sets: [{ kg: 55, reps: 11, rir: 2 }, { kg: 57, reps: 10, rir: 1 }] },
    { name: 'Elevaciones Laterales Polea Unilateral',  sets: [{ kg: 10, reps: 10, rir: 2 }, { kg: 10, reps: 9,  rir: 1 }] },
    { name: 'Press Pecho Iso-Lateral Máquina',         sets: [{ kg: 65, reps: 9,  rir: 2 }, { kg: 67, reps: 7,  rir: 1 }] },
    { name: 'Press Frances Polea',                     sets: [{ kg: 25, reps: 6,  rir: 2 }, { kg: 25, reps: 5,  rir: 1 }] },
    { name: 'Vuelos Posteriores Máquina',              sets: [{ kg: 50, reps: 10, rir: 2 }, { kg: 52, reps: 9,  rir: 1 }] },
    { name: 'Aperturas Inferior',                      sets: [{ kg: 45, reps: 9,  rir: 2 }, { kg: 47, reps: 8,  rir: 1 }] },
    { name: 'Máquina para Fondos Sentado',             sets: [{ kg: 70, reps: 10, rir: 2 }, { kg: 72, reps: 9,  rir: 1 }] },
  ] },
  { title: 'PULL 4',  duration: 43, exercises: [
    { name: 'Jalón al Pecho Polea',                sets: [{ kg: 75, reps: 9,  rir: 2 }, { kg: 78, reps: 7,  rir: 1 }] },
    { name: 'Remo Unilateral Polea con Banco',      sets: [{ kg: 45, reps: 10, rir: 2 }, { kg: 47, reps: 9,  rir: 1 }] },
    { name: 'Preacher Curl Machine',               sets: [{ kg: 35, reps: 9,  rir: 2 }, { kg: 37, reps: 8,  rir: 1 }] },
    { name: 'Pull Over en Polea',                  sets: [{ kg: 30, reps: 7,  rir: 2 }, { kg: 30, reps: 6,  rir: 1 }] },
    { name: 'Curl de Bíceps Mancuerna',            sets: [{ kg: 16, reps: 12, rir: 2 }, { kg: 18, reps: 10, rir: 1 }] },
    { name: 'Curl Martillo Polea Unilateral',       sets: [{ kg: 12, reps: 7,  rir: 2 }, { kg: 12, reps: 6,  rir: 1 }] },
  ] },
  { title: 'LEGS 5',  duration: 81, exercises: [
    { name: 'Curl de Pierna Sentado',         sets: [{ kg: 40, reps: 11, rir: 2 }, { kg: 42, reps: 10, rir: 1 }, { kg: 42, reps: 9, rir: 0 }] },
    { name: 'Aducción de Caderas',            sets: [{ kg: 60, reps: 9,  rir: 2 }, { kg: 62, reps: 8,  rir: 1 }] },
    { name: 'Peso Muerto Rumano Máquina',     sets: [{ kg: 80, reps: 6,  rir: 2 }, { kg: 82, reps: 5,  rir: 1 }] },
    { name: 'Hiperextensión para Isquios',    sets: [{ kg: 20, reps: 10, rir: 2 }, { kg: 20, reps: 9,  rir: 1 }] },
    { name: 'Extensiones a Una Pierna',       sets: [{ kg: 35, reps: 11, rir: 2 }, { kg: 37, reps: 11, rir: 1 }, { kg: 37, reps: 11, rir: 0 }] },
    { name: 'Elevación de Gemelos Sentado',   sets: [{ kg: 50, reps: 13, rir: 2 }, { kg: 52, reps: 12, rir: 1 }] },
  ] },
];

function buildExercises(category: string, kgOverrides?: Record<string, number>) {
  const pool = lib[category]!;
  return shuffle(pool).slice(0, ri(3, 5)).map(def => ({
    exerciseId: new Types.ObjectId().toString(),
    name:  def.name,
    sets:  Array.from({ length: ri(3, 4) }, (_, i) => ({
      kg:   Math.round((kgOverrides?.[def.name] ?? def.kg) * r(0.97, 1.03) * 10) / 10,
      reps: Math.max(def.minReps, def.minReps + ri(0, 2) - i),
      rir:  ri(0, 3),
    })),
  }));
}

// ─── perfiles ─────────────────────────────────────────────────────────────────

const profiles = [
  { username: 'IvanGR9', email: 'ivan@lowgim.com',   password: 'Lukegr01',  workouts: 67, streak: 6, targetVol: 430_000, level: 18, xp: 9840, cats: ['PUSH','PULL','LEGS'],                    avatar: '' },
  { username: 'CarlosF', email: 'carlos@lowgim.com',  password: 'seed$pass', workouts: 45, streak: 3, targetVol: 380_000, level: 14, xp: 7230, cats: ['PUSH','PULL','LEGS','UPPER','LOWER'],   avatar: 'https://randomuser.me/api/portraits/men/45.jpg' },
  { username: 'MartaLP', email: 'marta@lowgim.com',   password: 'seed$pass', workouts: 38, streak: 5, targetVol: 310_000, level: 11, xp: 5870, cats: ['UPPER','LOWER','UPPER','LOWER'],        avatar: 'https://randomuser.me/api/portraits/women/28.jpg' },
  { username: 'DiegoVM', email: 'diego@lowgim.com',   password: 'seed$pass', workouts: 31, streak: 4, targetVol: 270_000, level: 10, xp: 4610, cats: ['PUSH','PULL','LEGS','PUSH','PULL','LEGS'], avatar: 'https://randomuser.me/api/portraits/men/67.jpg' },
  { username: 'PabloMR', email: 'pablo@lowgim.com',   password: 'seed$pass', workouts: 28, streak: 1, targetVol: 240_000, level: 9,  xp: 3940, cats: ['LEGS','LOWER','UPPER','PUSH'],         avatar: 'https://randomuser.me/api/portraits/men/23.jpg' },
  { username: 'AlexTG',  email: 'alex@lowgim.com',    password: 'seed$pass', workouts: 24, streak: 1, targetVol: 210_000, level: 8,  xp: 3370, cats: ['PUSH','PULL','UPPER'],                  avatar: 'https://randomuser.me/api/portraits/men/55.jpg' },
  { username: 'LauraS',  email: 'laura@lowgim.com',   password: 'seed$pass', workouts: 22, streak: 2, targetVol: 185_000, level: 7,  xp: 2780, cats: ['UPPER','LOWER','UPPER','LOWER'],        avatar: 'https://randomuser.me/api/portraits/women/41.jpg' },
  { username: 'SofiaAR', email: 'sofia@lowgim.com',   password: 'seed$pass', workouts: 17, streak: 0, targetVol: 140_000, level: 6,  xp: 2140, cats: ['LEGS','UPPER','LOWER'],                 avatar: 'https://randomuser.me/api/portraits/women/19.jpg' },
];

// ─── main ─────────────────────────────────────────────────────────────────────

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI as string);
  console.log('✅ Conectado a MongoDB\n');

  // ── Fase 1: generar datos en memoria ─────────────────────────────────────
  const ivanRoutineVolumes = ivanRoutines.map(r =>
    r.exercises.reduce((total, ex) =>
      total + ex.sets.reduce((sum, s) => sum + s.kg * s.reps, 0), 0),
  );

  const payloads = profiles.map(p => {
    const isIvan = p.username === 'IvanGR9';
    return {
      profile: p,
      dates:     generateDates(p.workouts, p.streak),
      volumes:   isIvan
        ? Array.from({ length: p.workouts }, (_, i) => ivanRoutineVolumes[i % ivanRoutines.length]!)
        : distributeVolume(p.targetVol, p.workouts),
      exercises: Array.from({ length: p.workouts }, (_, i) =>
        isIvan
          ? ivanRoutines[i % ivanRoutines.length]!.exercises
          : buildExercises(p.cats[i % p.cats.length]!),
      ),
      titles:    isIvan
        ? Array.from({ length: p.workouts }, (_, i) => ivanRoutines[i % ivanRoutines.length]!.title)
        : Array.from({ length: p.workouts }, (_, i) => {
            const cat = p.cats[i % p.cats.length]!;
            return { PUSH: 'Empuje', PULL: 'Tirón', LEGS: 'Piernas', UPPER: 'Tren Superior', LOWER: 'Tren Inferior' }[cat] ?? cat;
          }),
      durations: isIvan
        ? Array.from({ length: p.workouts }, (_, i) => ivanRoutines[i % ivanRoutines.length]!.duration)
        : undefined,
    };
  });

  // ── Fase 2: preview ───────────────────────────────────────────────────────
  console.log('📊 RESUMEN DE VOLÚMENES (preview — aún no escrito en DB)\n');
  console.log('  Usuario     Sesiones   Vol total       Avg/sesión   Racha');
  console.log('  ────────────────────────────────────────────────────────────');
  for (const { profile, volumes } of payloads) {
    const total = Math.round(volumes.reduce((s, v) => s + v, 0) * 100) / 100;
    const avg   = Math.round(total / profile.workouts * 10) / 10;
    console.log(
      `  ${profile.username.padEnd(10)} ${String(profile.workouts).padStart(4)}` +
      `   ${total.toLocaleString('es-ES', { minimumFractionDigits: 2 }).padStart(12)} kg` +
      `   ${avg.toLocaleString('es-ES', { minimumFractionDigits: 1 }).padStart(7)} kg` +
      `   ${profile.streak}d`,
    );
  }
  console.log();

  // ── Fase 3: escribir en DB ───────────────────────────────────────────────
  await Promise.all([Gym.deleteMany({}), User.deleteMany({}), Workout.deleteMany({}), Routine.deleteMany({})]);
  console.log('🧹 Colecciones limpiadas\n');

  const gym   = await Gym.create({ name: 'Lowgim', location: 'Madrid', qrCode: 'lowgim' });
  const gymId = (gym._id as Types.ObjectId).toString();
  console.log(`🏋️  Gimnasio: ${gym.name} (${gymId})\n`);

  for (const { profile, dates, volumes, exercises, titles, durations } of payloads) {
    const user = await User.create({
      username: profile.username,
      email:    profile.email,
      password: profile.password,
      gymId,
      level:    profile.level,
      xp:       profile.xp,
      streak:   profile.streak,
      avatar:   profile.avatar,
    });

    await Workout.insertMany(
      dates.map((date, i) => ({
        userId:      user._id as Types.ObjectId,
        gymId,
        ...(titles?.[i] ? { title: titles[i] } : {}),
        date,
        duration:    durations?.[i] ?? ri(47, 97),
        exercises:   exercises[i]!,
        totalVolume: volumes[i]!,
      })),
    );

    if (profile.username === 'IvanGR9') {
      await Routine.insertMany(
        ivanRoutines.map(r => ({
          userId: user._id as Types.ObjectId,
          gymId,
          name: r.title,
          exercises: r.exercises.map(ex => ({ name: ex.name, sets: ex.sets })),
        })),
      );
      console.log(`📋 ${profile.username.padEnd(10)} ${ivanRoutines.length} rutinas insertadas`);
    }

    console.log(`✅ ${profile.username.padEnd(10)} ${profile.workouts} entrenamientos insertados`);
  }

  console.log('\n✅ Seed completado');
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch(err => {
  console.error('❌ Error en seed:', err);
  process.exit(1);
});
