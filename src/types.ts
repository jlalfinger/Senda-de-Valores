export interface Challenge {
  id: number;
  pil: 'conexion' | 'ciudadania' | 'habilidades' | 'desafio';
  icon: string;
  title: string;
  obj: string;
  vr: {
    u: string; // Urban path
    c: string; // Community path
    r: string; // Rural path
  };
  eqp: 'individual' | 'equipo';
  safe: string[];
  kw: string[];
  vq: string | null; // Teammate verification question
  exp: number;
  rew: {
    name: string;
    icon: string;
  };
  hint: string;
}

export type PillarId = 'conexion' | 'ciudadania' | 'habilidades' | 'desafio';

export interface Pillar {
  name: string;
  sub: string;
  icon: string;
  clr: string;
  bg: string;
}

export interface ChallengeProgress {
  t: string;  // Written reflection note
  ts: number; // Completed timestamp
}

export interface SavedState {
  v: number; // Schema version (v: 4)
  pin: string; // Parent 4-digit PIN
  sig: string; // Parent signature
  av: string; // Avatar ID
  al: string; // User alias
  mode: number; // 0 for 11-13 years, 1 for 14-16 years
  done: Record<number, ChallengeProgress>; // Completed challenges map
  ver: number[]; // Verified challenge IDs (teammate verified)
  cur: number | null; // ID of active challenge (null if none)
  ld: number; // Last completion timestamp (for the 7-day cooldown mechanism)
  
  // Scoring, customization, and difficulty fields
  score: number; // Player's current high score
  lives: number; // Number of lives/attempts left
  difficulty: 'facil' | 'medio' | 'dificil'; // Selected game difficulty
  hair: string; // Customized hairstyle ID
  clothes: string; // Customized clothes/outfit ID
  acc: string; // Customized accessory ID
  unlockedMilestones: string[]; // List of IDs of achieved milestones
  entorno: 'urbano' | 'comunitario' | 'rural'; // Selected geographic setting
}
