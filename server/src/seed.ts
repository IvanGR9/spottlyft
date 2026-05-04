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
  const avg = targetTotal / count;
  const raw = Array.from({ length: count }, () =>
    avg * r(0.85, 1.15) + ri(-9, 9) * 0.1 + ri(-9, 9) * 0.01,
  );
  const scale = targetTotal / raw.reduce((s, v) => s + v, 0);
  const scaled = raw.map(v => Math.round(v * scale * 100) / 100);

  // Ajustar último elemento para compensar el error de redondeo
  const diff = Math.round((targetTotal - scaled.reduce((s, v) => s + v, 0)) * 100) / 100;
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
    { name: 'Press Inclinado en Smith',         muscle: 'Pecho',   kg: 70, minReps: 6,  maxReps: 10 },
    { name: 'Aperturas en Máquina',             muscle: 'Pecho',   kg: 45, minReps: 10, maxReps: 15 },
    { name: 'Extensiones de Tríceps en Polea',  muscle: 'Tríceps', kg: 32, minReps: 10, maxReps: 15 },
    { name: 'Press Militar en Smith',           muscle: 'Hombro',  kg: 52, minReps: 8,  maxReps: 12 },
    { name: 'Elevaciones Laterales',            muscle: 'Hombro',  kg: 20, minReps: 12, maxReps: 20 },
    { name: 'Fondos con Lastre',                muscle: 'Pecho',   kg: 25, minReps: 8,  maxReps: 12 },
  ],
  PULL: [
    { name: 'Jalón al Pecho en Polea',          muscle: 'Espalda', kg: 75, minReps: 8,  maxReps: 12 },
    { name: 'Remo en Polea Baja',               muscle: 'Espalda', kg: 65, minReps: 8,  maxReps: 12 },
    { name: 'Remo con Barra',                   muscle: 'Espalda', kg: 72, minReps: 6,  maxReps: 10 },
    { name: 'Curl de Bíceps con Mancuerna',     muscle: 'Bíceps',  kg: 20, minReps: 10, maxReps: 14 },
    { name: 'Curl Predicador en Máquina',       muscle: 'Bíceps',  kg: 40, minReps: 10, maxReps: 15 },
    { name: 'Face Pull en Polea',               muscle: 'Hombro',  kg: 25, minReps: 15, maxReps: 20 },
    { name: 'Dominadas con Lastre',             muscle: 'Espalda', kg: 20, minReps: 6,  maxReps: 9  },
  ],
  LEGS: [
    { name: 'Prensa de Piernas',                muscle: 'Cuádriceps', kg: 70, minReps: 8,  maxReps: 12 },
    { name: 'Sentadilla Belt Squat',            muscle: 'Cuádriceps', kg: 65, minReps: 8,  maxReps: 10 },
    { name: 'Curl Femoral Sentado',             muscle: 'Isquios',    kg: 52, minReps: 10, maxReps: 15 },
    { name: 'Extensión de Cuádriceps',          muscle: 'Cuádriceps', kg: 48, minReps: 12, maxReps: 15 },
    { name: 'Peso Muerto Rumano',               muscle: 'Isquios',    kg: 65, minReps: 8,  maxReps: 12 },
    { name: 'Elevaciones de Talones',           muscle: 'Gemelos',    kg: 42, minReps: 15, maxReps: 20 },
    { name: 'Hip Thrust en Máquina',            muscle: 'Glúteos',    kg: 60, minReps: 10, maxReps: 14 },
  ],
  UPPER: [
    { name: 'Press de Pecho en Máquina',        muscle: 'Pecho',   kg: 65, minReps: 8,  maxReps: 12 },
    { name: 'Jalón al Pecho en Polea',          muscle: 'Espalda', kg: 70, minReps: 8,  maxReps: 12 },
    { name: 'Press Militar en Smith',           muscle: 'Hombro',  kg: 48, minReps: 8,  maxReps: 12 },
    { name: 'Remo con Mancuerna',               muscle: 'Espalda', kg: 35, minReps: 10, maxReps: 14 },
    { name: 'Curl de Bíceps con Barra',         muscle: 'Bíceps',  kg: 33, minReps: 10, maxReps: 15 },
    { name: 'Extensiones de Tríceps en Polea',  muscle: 'Tríceps', kg: 28, minReps: 12, maxReps: 15 },
  ],
};

// Pesos específicos para IvanGR9 (sobreescriben la librería)
const ivanKg: Record<string, number> = {
  'Prensa de Piernas':       240,
  'Jalón al Pecho en Polea':  83,
  'Press Inclinado en Smith':  70,
};

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
  { username: 'IvanGR9', email: 'ivan@lowgim.com',   password: 'Lukegr01',  workouts: 67, streak: 6, targetVol: 60_121, level: 18, xp: 9840, cats: ['PUSH','PULL','LEGS'] },
  { username: 'CarlosF', email: 'carlos@lowgim.com',  password: 'seed$pass', workouts: 45, streak: 3, targetVol: 40_489, level: 14, xp: 7230, cats: ['PUSH','PULL','LEGS','UPPER'] },
  { username: 'MartaLP', email: 'marta@lowgim.com',   password: 'seed$pass', workouts: 38, streak: 5, targetVol: 34_178, level: 11, xp: 5870, cats: ['UPPER','LEGS','PULL'] },
  { username: 'PabloMR', email: 'pablo@lowgim.com',   password: 'seed$pass', workouts: 28, streak: 1, targetVol: 25_163, level: 9,  xp: 3940, cats: ['PUSH','PULL','LEGS'] },
  { username: 'DiegoVM', email: 'diego@lowgim.com',   password: 'seed$pass', workouts: 31, streak: 4, targetVol: 27_847, level: 10, xp: 4610, cats: ['PUSH','PULL','LEGS','UPPER'] },
  { username: 'LauraS',  email: 'laura@lowgim.com',   password: 'seed$pass', workouts: 22, streak: 2, targetVol: 19_834, level: 7,  xp: 2780, cats: ['UPPER','LEGS'] },
  { username: 'AlexTG',  email: 'alex@lowgim.com',    password: 'seed$pass', workouts: 24, streak: 1, targetVol: 21_573, level: 8,  xp: 3370, cats: ['PUSH','PULL','LEGS'] },
  { username: 'SofiaAR', email: 'sofia@lowgim.com',   password: 'seed$pass', workouts: 17, streak: 0, targetVol: 15_287, level: 6,  xp: 2140, cats: ['UPPER','LEGS'] },
];

// ─── main ─────────────────────────────────────────────────────────────────────

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI as string);
  console.log('✅ Conectado a MongoDB\n');

  // ── Fase 1: generar datos en memoria ─────────────────────────────────────
  const payloads = profiles.map(p => ({
    profile:   p,
    dates:     generateDates(p.workouts, p.streak),
    volumes:   distributeVolume(p.targetVol, p.workouts),
    exercises: Array.from({ length: p.workouts }, (_, i) =>
      buildExercises(p.cats[i % p.cats.length]!, p.username === 'IvanGR9' ? ivanKg : undefined),
    ),
  }));

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
  await Promise.all([Gym.deleteMany({}), User.deleteMany({}), Workout.deleteMany({})]);
  console.log('🧹 Colecciones limpiadas\n');

  const gym   = await Gym.create({ name: 'Lowgim', location: 'Madrid', qrCode: 'lowgim' });
  const gymId = (gym._id as Types.ObjectId).toString();
  console.log(`🏋️  Gimnasio: ${gym.name} (${gymId})\n`);

  for (const { profile, dates, volumes, exercises } of payloads) {
    const user = await User.create({
      username: profile.username,
      email:    profile.email,
      password: profile.password,
      gymId,
      level:    profile.level,
      xp:       profile.xp,
      streak:   profile.streak,
    });

    await Workout.insertMany(
      dates.map((date, i) => ({
        userId:      user._id as Types.ObjectId,
        gymId,
        date,
        duration:    ri(47, 97),
        exercises:   exercises[i]!,
        totalVolume: volumes[i]!,
      })),
    );

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
