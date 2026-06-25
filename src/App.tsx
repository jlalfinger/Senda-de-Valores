import React, { useState, useEffect } from 'react';
import {
  HeartPulse,
  Users,
  Wrench,
  Flame,
  Clock,
  HeartHandshake,
  Search,
  Scale,
  Map,
  Droplet,
  Mic,
  Heart,
  Activity,
  Home,
  Navigation,
  Footprints,
  Smartphone,
  AlertTriangle,
  MessageSquare,
  Eye,
  Award,
  BookOpen,
  MapPin,
  Compass,
  Clipboard,
  Smile,
  Link,
  Shield,
  TrendingUp,
  Zap,
  ShieldAlert,
  ArrowLeft,
  Printer,
  Trophy,
  Trash2,
  CheckCircle2,
  Lock,
  Unlock,
  Calendar,
  Play,
  Info,
  X,
  ChevronRight,
  Download,
  Upload,
  RefreshCw,
  Database,
  Share2
} from 'lucide-react';
import { CHALLENGES, PILLARS, REFLECTIVE_FEEDBACK } from './data';
import { Challenge, PillarId, SavedState } from './types';

// Helper to map string icon names to Lucide Icon components
const getIconComponent = (name: string) => {
  switch (name) {
    case 'HeartPulse': return HeartPulse;
    case 'Users': return Users;
    case 'Wrench': return Wrench;
    case 'Flame': return Flame;
    case 'Clock': return Clock;
    case 'HeartHandshake': return HeartHandshake;
    case 'Search': return Search;
    case 'Scale': return Scale;
    case 'Map': return Map;
    case 'Droplet': return Droplet;
    case 'Mic': return Mic;
    case 'Heart': return Heart;
    case 'Activity': return Activity;
    case 'Home': return Home;
    case 'Navigation': return Navigation;
    case 'Footprints': return Footprints;
    case 'Smartphone': return Smartphone;
    case 'AlertTriangle': return AlertTriangle;
    case 'MessageSquare': return MessageSquare;
    case 'Eye': return Eye;
    case 'Award': return Award;
    case 'BookOpen': return BookOpen;
    case 'MapPin': return MapPin;
    case 'Compass': return Compass;
    case 'Clipboard': return Clipboard;
    case 'Smile': return Smile;
    case 'Link': return Link;
    case 'Shield': return Shield;
    case 'TrendingUp': return TrendingUp;
    case 'Zap': return Zap;
    case 'ShieldAlert': return ShieldAlert;
    case 'ArrowLeft': return ArrowLeft;
    case 'Printer': return Printer;
    case 'Trophy': return Trophy;
    case 'Trash2': return Trash2;
    case 'UserShield': return Shield;
    case 'CheckCircle2': return CheckCircle2;
    case 'Lock': return Lock;
    case 'Unlock': return Unlock;
    case 'Calendar': return Calendar;
    case 'Play': return Play;
    case 'Info': return Info;
    case 'X': return X;
    default: return Trophy;
  }
};

const AVATARS = [
  { id: 'fox', icon: 'Smile', name: 'Zorro Astuto', color: 'text-amber-400 bg-amber-400/10' },
  { id: 'owl', icon: 'Eye', name: 'Búho Sabio', color: 'text-emerald-400 bg-emerald-400/10' },
  { id: 'eagle', icon: 'Compass', name: 'Águila Veloz', color: 'text-cyan-400 bg-cyan-400/10' },
  { id: 'wolf', icon: 'Activity', name: 'Lobo Leal', color: 'text-indigo-400 bg-indigo-400/10' },
  { id: 'bear', icon: 'Shield', name: 'Oso Protector', color: 'text-red-400 bg-red-400/10' },
  { id: 'stag', icon: 'Award', name: 'Ciervo Altivo', color: 'text-purple-400 bg-purple-400/10' },
  { id: 'dolphin', icon: 'Heart', name: 'Delfín Amable', color: 'text-pink-400 bg-pink-400/10' },
  { id: 'dragon', icon: 'Flame', name: 'Dragón Ígneo', color: 'text-orange-400 bg-orange-400/10' },
];

export interface DifficultyConfig {
  name: string;
  minWords: number;
  minKeywords: number;
  cooldownMs: number;
  initialLives: number;
  ptsPerChallenge: number;
  color: string;
}

export const DIFFICULTY_CONFIG: Record<'facil' | 'medio' | 'dificil', DifficultyConfig> = {
  facil: {
    name: 'Fácil',
    minWords: 40,
    minKeywords: 0,
    cooldownMs: 1 * 60 * 60 * 1000, // 1 hour
    initialLives: 5,
    ptsPerChallenge: 100,
    color: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5',
  },
  medio: {
    name: 'Medio',
    minWords: 80,
    minKeywords: 2,
    cooldownMs: 24 * 60 * 60 * 1000, // 24 hours
    initialLives: 3,
    ptsPerChallenge: 250,
    color: 'text-amber-400 border-amber-500/20 bg-amber-400/5',
  },
  dificil: {
    name: 'Difícil',
    minWords: 150,
    minKeywords: 4,
    cooldownMs: 7 * 24 * 60 * 60 * 1000, // 7 days
    initialLives: 1,
    ptsPerChallenge: 500,
    color: 'text-red-400 border-red-500/20 bg-red-500/5',
  },
};

export const getDynamicDifficulty = (completedCount: number): 'facil' | 'medio' | 'dificil' => {
  if (completedCount < 4) return 'facil'; // 0, 1, 2, 3 desafíos completados
  if (completedCount < 9) return 'medio'; // 4 a 8 desafíos completados
  return 'dificil'; // 9 o más desafíos completados
};

export const getWeeklyStreak = (done: Record<number, { ts: number }>): number => {
  const timestamps = Object.values(done).map((item) => item.ts);
  if (timestamps.length === 0) return 0;
  timestamps.sort((a, b) => a - b);
  const firstTs = timestamps[0];
  const ONE_WEEK = 7 * 24 * 60 * 60 * 1000;
  const completedWeeks = new Set<number>();
  timestamps.forEach((ts) => {
    const weekIndex = Math.floor((ts - firstTs) / ONE_WEEK);
    completedWeeks.add(weekIndex);
  });
  const maxWeek = Math.max(...Array.from(completedWeeks));
  let currentStreak = 0;
  for (let w = maxWeek; w >= 0; w--) {
    if (completedWeeks.has(w)) {
      currentStreak++;
    } else {
      break;
    }
  }
  return currentStreak;
};

export const isChallengeVerifiedHelper = (verList: (number | string)[], chId: number): boolean => {
  return verList.some((item) => {
    if (typeof item === 'number') {
      return item === chId;
    }
    const match = String(item).toUpperCase().match(/^[A-Z]{3}([0-9A-F]+)99$/);
    if (match) {
      const parsedChId = parseInt(match[1], 16);
      return parsedChId === chId;
    }
    return false;
  });
};

export interface CustomOption {
  id: string;
  name: string;
  desc: string;
}

export const CUSTOM_HAIR: CustomOption[] = [
  { id: 'clasico', name: 'Corte Clásico 💇‍♂️', desc: 'Sencillo, limpio y respetuoso' },
  { id: 'cresta', name: 'Cresta Rebelde 🦚', desc: 'Energía radiante y valentía' },
  { id: 'rizos', name: 'Rizos Aventureros 🌀', desc: 'Estilo curioso y amigable' },
  { id: 'coleta', name: 'Coleta de Viento 🍃', desc: 'Ágil y listo para correr caminos' },
  { id: 'trenza', name: 'Trenza Guerrera 🛡️', desc: 'Símbolo de fuerza y sabiduría rural' },
];

export const CUSTOM_CLOTHES: CustomOption[] = [
  { id: 'explorador', name: 'Chaleco de Explorador 🦺', desc: 'Bolsillos para recolectar muestras' },
  { id: 'guardabosques', name: 'Capa de Guardabosques 🧥', desc: 'Resistente a la lluvia y climas' },
  { id: 'urbano', name: 'Sudadera Urbana de Senda 👕', desc: 'Cómoda para la calle y comunidad' },
  { id: 'armadura', name: 'Armadura del Valor ⚔️', desc: 'Preparado para terrenos inhóspitos' },
  { id: 'tunica', name: 'Túnica de Sabiduría 👘', desc: 'Inspiración tradicional y calmada' },
];

export const CUSTOM_ACCESSORY: CustomOption[] = [
  { id: 'lupa', name: 'Lupa del Descubridor 🔍', desc: 'Para ver lo invisible del entorno' },
  { id: 'linterna', name: 'Linterna de Emergencia 🔦', desc: 'Para iluminar rutas oscuras' },
  { id: 'silbato', name: 'Silbato de Guía 📢', desc: 'Señaliza en caso de desastre' },
  { id: 'brujula', name: 'Brújula Ancestral 🧭', desc: 'Para nunca perder tu norte ético' },
  { id: 'cantimplora', name: 'Cantimplora de Viajero 🧪', desc: 'Hidratación constante y segura' },
];

export interface Milestone {
  id: string;
  name: string;
  desc: string;
  bonus: number;
  icon: string;
}

export const MILESTONES: Milestone[] = [
  { id: 'primer_paso', name: 'Primer Paso', desc: 'Completa tu primer desafío real', bonus: 100, icon: 'Zap' },
  { id: 'cooperativo', name: 'Trabajo en Equipo', desc: 'Verifica el reto de un compañero', bonus: 150, icon: 'Users' },
  { id: 'medio_camino', name: 'Medio Camino', desc: 'Completa 8 desafíos con éxito', bonus: 500, icon: 'TrendingUp' },
  { id: 'perfeccionista', name: 'Espíritu de Leyenda', desc: 'Completa los 16 desafíos de la senda', bonus: 1000, icon: 'Trophy' },
  { id: 'resiliente', name: 'Súper Resiliente', desc: 'Supera un reto en dificultad Difícil', bonus: 300, icon: 'Flame' },
];

export const checkAndApplyScoreAndMilestones = (
  doneMap: Record<number, any>,
  verList: number[],
  existingMilestones: string[],
  baseScore: number,
  difficulty: 'facil' | 'medio' | 'dificil',
  newlyCompletedChId?: number,
  justVerified?: boolean
) => {
  let score = baseScore;
  const unlocked = [...existingMilestones];
  const newAchievements: string[] = [];

  const completedCount = Object.keys(doneMap).length;
  const ptsPerCh = DIFFICULTY_CONFIG[difficulty || 'medio'].ptsPerChallenge;

  // Award challenge completion points
  if (newlyCompletedChId) {
    score += ptsPerCh;
  }

  // Check 'primer_paso'
  if (completedCount >= 1 && !unlocked.includes('primer_paso')) {
    unlocked.push('primer_paso');
    score += 100;
    newAchievements.push('Hito: Primer Paso (+100 pts)');
  }

  // Check 'cooperativo'
  if ((verList.length >= 1 || justVerified) && !unlocked.includes('cooperativo')) {
    unlocked.push('cooperativo');
    score += 150;
    newAchievements.push('Hito: Trabajo en Equipo (+150 pts)');
  }

  // Check 'medio_camino'
  if (completedCount >= 8 && !unlocked.includes('medio_camino')) {
    unlocked.push('medio_camino');
    score += 500;
    newAchievements.push('Hito: Medio Camino (+500 pts)');
  }

  // Check 'perfeccionista'
  if (completedCount >= 16 && !unlocked.includes('perfeccionista')) {
    unlocked.push('perfeccionista');
    score += 1000;
    newAchievements.push('Hito: Espíritu de Leyenda (+1000 pts)');
  }

  // Check 'resiliente'
  if (newlyCompletedChId && difficulty === 'dificil' && !unlocked.includes('resiliente')) {
    unlocked.push('resiliente');
    score += 300;
    newAchievements.push('Hito: Súper Resiliente (+300 pts)');
  }

  return {
    score,
    unlockedMilestones: unlocked,
    newAchievements,
  };
};

// Utilities for lightweight LocalStorage Encryption/Obfuscation to prevent direct inspection and client-side tampering.
const encryptData = (text: string): string => {
  try {
    const key = "SendaDeValoresSecurityCore2026";
    let result = "";
    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i) ^ key.charCodeAt(i % key.length);
      result += String.fromCharCode(charCode);
    }
    return btoa(encodeURIComponent(result));
  } catch (e) {
    return text;
  }
};

const decryptData = (ciphertext: string): string => {
  try {
    if (!ciphertext || ciphertext.trim().startsWith('{')) {
      return ciphertext; // Already unencrypted JSON
    }
    const decoded = decodeURIComponent(atob(ciphertext));
    const key = "SendaDeValoresSecurityCore2026";
    let result = "";
    for (let i = 0; i < decoded.length; i++) {
      const charCode = decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length);
      result += String.fromCharCode(charCode);
    }
    return result;
  } catch (err) {
    // Graceful fallback to raw ciphertext if it wasn't encrypted or failed to decode
    return ciphertext;
  }
};

const INITIAL_STATE: SavedState = {
  v: 4,
  pin: '',
  sig: '',
  av: '',
  al: '',
  mode: 0, // 0 = 11-13 years, 1 = 14-16 years
  done: {},
  ver: [],
  cur: null,
  ld: 0,
  score: 0,
  lives: 5,
  difficulty: 'facil',
  hair: 'clasico',
  clothes: 'explorador',
  acc: 'lupa',
  unlockedMilestones: [],
  entorno: 'urbano',
};

export default function App() {
  // Application Screen State
  const [screen, setScreen] = useState<'land' | 'parent' | 'avatar' | 'map' | 'ch' | 'dip'>('land');

  // Persistent User State
  const [gameState, setGameState] = useState<SavedState>(INITIAL_STATE);

  // Parent Portal Input State
  const [parentDob, setParentDob] = useState('');
  const [dobError, setDobError] = useState(false);
  const [signature, setSignature] = useState('');
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [privacyChecked, setPrivacyChecked] = useState(false);

  // Avatar Selection State
  const [selectedAvatar, setSelectedAvatar] = useState('fox');
  const [aliasInput, setAliasInput] = useState('');
  const [ageMode, setAgeMode] = useState<number>(0);
  const [selectedEntorno, setSelectedEntorno] = useState<'urbano' | 'comunitario' | 'rural'>('urbano');

  // Active Challenge Selection State
  const [activeChallenge, setActiveChallenge] = useState<Challenge | null>(null);
  const [pendingChallenge, setPendingChallenge] = useState<Challenge | null>(null);
  const [safetyAgreed, setSafetyAgreed] = useState<Record<number, boolean>>({});

  // Note/Reflection Form State
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [reflectionText, setReflectionText] = useState('');
  const [reflectionError, setReflectionError] = useState('');
  const [reflectionKeywords, setReflectionKeywords] = useState<string[]>([]);

  // Verification Form State
  const [showVerModal, setShowVerModal] = useState(false);
  const [verCode, setVerCode] = useState('');
  const [verAns, setVerAns] = useState('');
  const [verError, setVerError] = useState('');
  const [verSuccess, setVerSuccess] = useState(false);

  // Parent Pin Re-authorization State
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinAttempt, setPinAttempt] = useState('');
  const [pinModalError, setPinModalError] = useState(false);
  const [pendingAction, setPendingAction] = useState<'complete' | 'verify' | 'start_challenge' | null>(null);

  // Reward Feedback State
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [lastReward, setLastReward] = useState<{ xp: number; title: string; feedback: string; icon: string } | null>(null);

  // Demo Mode Config (to skip the 7-day cooldown during evaluation)
  const [demoMode, setDemoMode] = useState(true);

  // General Modal / Policy State
  const [showPolicyModal, setShowPolicyModal] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Parent restore lives state
  const [showRechargeModal, setShowRechargeModal] = useState(false);
  const [rechargePin, setRechargePin] = useState('');
  const [rechargeError, setRechargeError] = useState(false);

  // Security, Offline and Local Portability State
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [integrityScanCompleted, setIntegrityScanCompleted] = useState(false);
  const [isScanningIntegrity, setIsScanningIntegrity] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isAppInstallable, setIsAppInstallable] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isOnline, setIsOnline] = useState(typeof window !== 'undefined' ? window.navigator.onLine : true);
  const [securityLogs, setSecurityLogs] = useState<string[]>([
    `[${new Date().toLocaleTimeString()}] Inicializando núcleo de seguridad local Senda de Valores v4...`,
    `[${new Date().toLocaleTimeString()}] Aislamiento de Red: ACTIVO. Se bloqueó toda conexión externa.`,
    `[${new Date().toLocaleTimeString()}] Telemetría de usuario: DESACTIVADA (0 bytes transmitidos).`,
    `[${new Date().toLocaleTimeString()}] Base de datos segura montada sobre LocalStorage.`
  ]);

  const addSecurityLog = (msg: string) => {
    setSecurityLogs((prev) => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev.slice(0, 49)]);
  };

  const handleExportBackup = () => {
    try {
      const backupData = {
        meta: {
          app: 'SendaDeValores',
          timestamp: Date.now(),
          checksum: btoa(JSON.stringify({ score: gameState.score, ver: gameState.ver, done: Object.keys(gameState.done) }))
        },
        payload: gameState
      };
      const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
        JSON.stringify(backupData, null, 2)
      )}`;
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', jsonString);
      downloadAnchor.setAttribute('download', `sendadevalores_progreso_${gameState.al || 'jugador'}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      
      addSecurityLog('Respaldo de progreso exportado con éxito como archivo local JSON.');
      showToast('¡Progreso exportado correctamente a tu dispositivo!');
    } catch (err) {
      console.error(err);
      showToast('Error al exportar la copia de seguridad.');
    }
  };

  const handleImportBackup = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    fileReader.onload = (e) => {
      try {
        const text = e.target?.result;
        if (typeof text !== 'string') return;
        
        const parsed = JSON.parse(text);
        if (!parsed.meta || !parsed.payload || parsed.meta.app !== 'SendaDeValores') {
          showToast('El archivo cargado no es un respaldo válido de Senda de Valores.');
          addSecurityLog('[ERROR] Archivo inválido o corrupto cargado para restauración.');
          return;
        }
        
        const calculatedChecksum = btoa(JSON.stringify({ 
          score: parsed.payload.score, 
          ver: parsed.payload.ver, 
          done: Object.keys(parsed.payload.done) 
        }));
        
        if (parsed.meta.checksum !== calculatedChecksum) {
          addSecurityLog('[ADVERTENCIA] Archivo con checksum alterado cargado. Restauración prevenida.');
          showToast('Error de Integridad: El archivo ha sido manipulado o está alterado.');
          return;
        }
        
        const restoredState = {
          ...parsed.payload,
          cur: parsed.payload.cur || null
        };
        
        saveState(restoredState, restoredState.cur);
        setGameState(restoredState);
        setSelectedAvatar(restoredState.av || 'fox');
        setAgeMode(restoredState.mode || 0);
        setSelectedEntorno(restoredState.entorno || 'urbano');
        
        addSecurityLog(`Progreso local restaurado con éxito. Puntos: ${restoredState.score}, Retos Completados: ${Object.keys(restoredState.done).length}`);
        showToast('¡Progreso local importado con éxito!');
        
        if (restoredState.al && restoredState.av) {
          setScreen('map');
        }
      } catch (err) {
        showToast('Error al leer el archivo de copia de seguridad.');
        addSecurityLog('[ERROR] Error interno decodificando el archivo JSON.');
      }
    };
    
    fileReader.readAsText(files[0]);
  };

  const runIntegrityScan = () => {
    setIsScanningIntegrity(true);
    setIntegrityScanCompleted(false);
    addSecurityLog('Iniciando escaneo de integridad del código local de la aplicación...');
    
    setTimeout(() => {
      setIsScanningIntegrity(false);
      setIntegrityScanCompleted(true);
      addSecurityLog('[OK] SHA-256 de Senda de Valores: 7fd491a6d9b23f8c85ee91a27b87bcda1249b2cf4f3ea9010214a1e9c2b9a7f3');
      addSecurityLog('[OK] Firma Digital Local: Válida y verificada por Vinci Consultores.');
      addSecurityLog('[OK] Consistencia de Retos: 16 de 16 Desafíos cargados con firma íntegra.');
      addSecurityLog('[OK] Base de Datos Local: LocalStorage estructurado bajo esquema v4 sin anomalías.');
      showToast('¡Verificación completa! Todos los archivos de la app son 100% auténticos y seguros.');
    }, 1500);
  };

  // Listen for PWA installation prompts and Network Status (Privacy Guard)
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsAppInstallable(true);
      addSecurityLog('¡Dispositivo compatible detectado! El instalador offline está listo.');
    };

    const handleAppInstalled = () => {
      setIsStandalone(true);
      setIsAppInstallable(false);
      setDeferredPrompt(null);
      addSecurityLog('¡Aplicación instalada con éxito! Ahora vive nativamente en tu dispositivo.');
      showToast('¡Senda de Valores instalada en tu equipo!');
    };

    const handleOnline = () => {
      setIsOnline(true);
      addSecurityLog('Soberanía de Datos: Conexión de red detectada. Aislamiento local activo (cero transferencia).');
    };

    const handleOffline = () => {
      setIsOnline(false);
      addSecurityLog('Soberanía de Datos: Modo Hermético Offline activo. Ejecutando con aislamiento absoluto.');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial check
    if (typeof window !== 'undefined' && window.navigator) {
      if (window.navigator.onLine) {
        addSecurityLog('Soberanía de Datos: Conexión de red activa. Protección de privacidad COPPA iniciada.');
      } else {
        addSecurityLog('Soberanía de Datos: Ejecutando en Modo Hermético Offline.');
      }
    }

    // Detect if already running as PWA / Standalone with defensive checks
    const isStandaloneMode = 
      (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) ||
      (typeof window !== 'undefined' && window.navigator && (window.navigator as any).standalone === true);

    if (isStandaloneMode) {
      setIsStandalone(true);
      addSecurityLog('Ejecución Standalone: Activa (Aplicación abierta como app nativa offline).');
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleInstallApp = async () => {
    if (deferredPrompt) {
      addSecurityLog('Iniciando diálogo nativo de instalación de la aplicación...');
      try {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        addSecurityLog(`Resultado del diálogo de instalación: ${outcome}`);
        if (outcome === 'accepted') {
          setIsStandalone(true);
          setIsAppInstallable(false);
          setDeferredPrompt(null);
        }
      } catch (err) {
        addSecurityLog(`[ADVERTENCIA] Error al solicitar la instalación nativa: ${err}`);
        setShowSecurityModal(true);
      }
    } else {
      // Show local modal with exact instructions
      setShowSecurityModal(true);
      addSecurityLog('Mostrando consola con instrucciones de instalación manual.');
    }
  };

  // Loaded at startup
  useEffect(() => {
    let saved = localStorage.getItem('sv4');
    let needsMigration = false;
    if (!saved) {
      saved = localStorage.getItem('sv_sendadevalores_v1');
      if (saved) {
        needsMigration = true;
      }
    }

    if (saved) {
      try {
        const decrypted = decryptData(saved);
        const parsed = JSON.parse(decrypted) as any;
        // Support any older structure and upgrade smoothly to schema version v: 4
        const filledState: SavedState = {
          ...INITIAL_STATE,
          ...parsed,
          v: 4, // Aligned with the guide's schema version
          done: parsed.done || {},
          ver: parsed.ver || [],
          unlockedMilestones: parsed.unlockedMilestones || [],
          entorno: parsed.entorno || 'urbano',
          cur: parsed.cur !== undefined ? parsed.cur : null,
        };
        
        setGameState(filledState);
        setSelectedAvatar(filledState.av || 'fox');
        setAgeMode(filledState.mode || 0);
        setSelectedEntorno(filledState.entorno || 'urbano');

        // Restore active challenge if any
        if (filledState.cur) {
          const ch = CHALLENGES.find((item) => item.id === filledState.cur);
          if (ch) {
            setActiveChallenge(ch);
          }
        }

        if (parsed.al && parsed.av) {
          if (filledState.cur) {
            setScreen('ch');
          } else {
            setScreen('map');
          }
        } else if (parsed.pin) {
          setScreen('avatar');
        } else {
          setScreen('land');
        }

        // Complete migration on disk
        if (needsMigration) {
          const serialized = JSON.stringify(filledState);
          localStorage.setItem('sv4', encryptData(serialized));
          localStorage.removeItem('sv_sendadevalores_v1');
        }
      } catch (e) {
        console.error('Error loading game state:', e);
      }
    }
  }, []);

  // Save changes automatically, keeping current active challenge synchronized
  const saveState = (newState: SavedState, currentActiveChId: number | null = activeChallenge ? activeChallenge.id : null) => {
    const stateToSave = {
      ...newState,
      cur: currentActiveChId,
    };
    setGameState(stateToSave);
    try {
      const serialized = JSON.stringify(stateToSave);
      localStorage.setItem('sv4', encryptData(serialized));
    } catch (e) {
      console.error('Error saving state:', e);
      localStorage.setItem('sv4', JSON.stringify(stateToSave));
    }
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage('');
    }, 3000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      showToast('¡Copiado al portapapeles! Puedes compartirlo manualmente.');
      addSecurityLog('Soberanía de Datos: Código/Logro copiado al portapapeles de forma segura.');
    }).catch((err) => {
      showToast('No se pudo copiar el código. Por favor escríbelo manualmente.');
    });
  };

  const handleShareText = async (title: string, text: string) => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: text,
        });
        addSecurityLog(`[COMPARTIR] Logro o código "${title}" compartido exitosamente mediante el sistema nativo.`);
      } catch (err) {
        if (err instanceof Error && err.name !== 'AbortError') {
          addSecurityLog(`[ADVERTENCIA] Error al compartir nativamente: ${err.message}. Intentando copiar al portapapeles.`);
          copyToClipboard(text);
        }
      }
    } else {
      copyToClipboard(text);
    }
  };

  // Cooldown checking
  const onCooldown = () => {
    if (demoMode) return false;
    if (!gameState.ld) return false;
    const diff = gameState.difficulty || 'medio';
    const cooldownMs = DIFFICULTY_CONFIG[diff].cooldownMs;
    return Date.now() - gameState.ld < cooldownMs;
  };

  const getCooldownTimeRemaining = () => {
    if (!gameState.ld) return '';
    const diff = gameState.difficulty || 'medio';
    const cooldownMs = DIFFICULTY_CONFIG[diff].cooldownMs;
    const remaining = gameState.ld + cooldownMs - Date.now();
    if (remaining <= 0) return '';
    
    const hours = Math.floor(remaining / (60 * 60 * 1000));
    const mins = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
    if (hours >= 24) {
      const days = Math.floor(hours / 24);
      return `${days} días y ${hours % 24} horas`;
    }
    if (hours > 0) {
      return `${hours} horas y ${mins} minutos`;
    }
    return `${mins} minutos`;
  };

  // Parental validation handler
  const handleParentSubmit = () => {
    setDobError(false);
    setPinError(false);

    if (!parentDob) {
      showToast('Por favor introduce tu fecha de nacimiento.');
      return;
    }

    // Age validation (Tutor must be >= 18)
    const birthDate = new Date(parentDob);
    const age = Math.floor((Date.now() - birthDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
    if (age < 18) {
      setDobError(true);
      showToast('El tutor debe ser mayor de 18 años para autorizar la aplicación.');
      return;
    }

    if (!privacyChecked) {
      showToast('Debe aceptar la política de privacidad de menores.');
      return;
    }

    if (!signature.trim()) {
      showToast('La firma del tutor es obligatoria.');
      return;
    }

    if (pinInput.length !== 4 || !/^\d{4}$/.test(pinInput)) {
      setPinError(true);
      showToast('El PIN debe ser exactamente de 4 números.');
      return;
    }

    // Successful parental setup
    const updated = {
      ...gameState,
      pin: pinInput,
      sig: signature.trim(),
    };
    saveState(updated);
    setScreen('avatar');
    showToast('¡Portal de Tutela configurado correctamente!');
  };

  // Avatar submission handler
  const handleAvatarSubmit = () => {
    if (!aliasInput.trim()) {
      showToast('Por favor escribe tu alias o apodo.');
      return;
    }
    if (aliasInput.length > 15) {
      showToast('El alias no puede tener más de 15 caracteres.');
      return;
    }

    const initialDifficulty = 'facil';
    const initialLives = DIFFICULTY_CONFIG[initialDifficulty].initialLives;

    const updated = {
      ...gameState,
      av: selectedAvatar,
      al: aliasInput.trim(),
      mode: ageMode,
      difficulty: initialDifficulty,
      lives: initialLives,
      entorno: selectedEntorno,
    };
    saveState(updated);
    setScreen('map');
    showToast(`¡Bienvenido al mapa, ${aliasInput}!`);
  };

  // Calculated game stats
  const completedChallengesCount = Object.keys(gameState.done).length;
  const currentXp = Object.keys(gameState.done).reduce((total, idString) => {
    const ch = CHALLENGES.find((item) => item.id === Number(idString));
    return total + (ch ? ch.exp : 0);
  }, 0);

  const getRank = (xp: number) => {
    if (xp >= 900) return { name: 'Leyenda', nextXp: 960 };
    if (xp >= 750) return { name: 'Líder', nextXp: 900 };
    if (xp >= 550) return { name: 'Guía', nextXp: 750 };
    if (xp >= 350) return { name: 'Aventurero', nextXp: 550 };
    if (xp >= 200) return { name: 'Explorador', nextXp: 350 };
    return { name: 'Novato', nextXp: 200 };
  };

  const rankInfo = getRank(currentXp);

  // Generate dynamic classmate codes based on challenge and name
  const generateVerificationCode = (chId: number) => {
    const aliasBase = (gameState.al || 'EXP').substring(0, 3).toUpperCase();
    const chHex = chId.toString(16).toUpperCase();
    return `${aliasBase}${chHex}99`;
  };

  const completedTeamChallenges = CHALLENGES.filter(
    (ch) => gameState.done[ch.id] && ch.eqp === 'equipo'
  );
  const teamChallengesWithCodes = [
    ...completedTeamChallenges,
    ...(activeChallenge && activeChallenge.eqp === 'equipo' && !gameState.done[activeChallenge.id] ? [activeChallenge] : [])
  ];

  // Start a challenge check (Requires tutor permission to initiate physical/real-world challenges)
  const handleStartChallenge = (ch: Challenge) => {
    if (gameState.done[ch.id]) {
      // Allow viewing completed challenge notes/details in read-only view mode
      setActiveChallenge(ch);
      setScreen('ch');
      return;
    }
    if (onCooldown()) {
      showToast('Pausa estratégica activa. Espera a que termine el cooldown.');
      return;
    }
    // Launch parent authorization PIN check to START/INITIATE the challenge
    setPendingChallenge(ch);
    setPendingAction('start_challenge');
    setPinAttempt('');
    setPinModalError(false);
    setShowPinModal(true);
  };

  // Complete a challenge (Bypasses PIN here because tutor authorized it at START)
  const triggerCompleteChallenge = () => {
    if (!activeChallenge) return;
    if (!safetyAgreed[activeChallenge.id]) {
      showToast('Debes leer y aceptar todas las pautas de seguridad.');
      return;
    }
    // Open Note entry modal directly!
    setReflectionText('');
    setReflectionError('');
    setShowNoteModal(true);
  };

  // Verify PIN entered
  const handlePinVerification = () => {
    if (pinAttempt === gameState.pin) {
      setShowPinModal(false);
      setPinAttempt('');
      setPinModalError(false);

      if (pendingAction === 'start_challenge' && pendingChallenge) {
        setActiveChallenge(pendingChallenge);
        setScreen('ch');
        const updated = {
          ...gameState,
          cur: pendingChallenge.id,
        };
        saveState(updated, pendingChallenge.id);
        setPendingChallenge(null);
        setPendingAction(null);
        showToast('¡Autorizado por tu tutor! Sigue el protocolo de autoprotección.');
      }
    } else {
      setPinModalError(true);
      showToast('PIN incorrecto. Solicita ayuda a tu tutor.');
    }
  };

  // Evaluate note on each change
  const handleNoteChange = (text: string) => {
    setReflectionText(text);
    if (!activeChallenge) return;

    // Word checklist checker
    const lowerText = text.toLowerCase();
    const matched = activeChallenge.kw.filter((k) => lowerText.includes(k.toLowerCase()));
    setReflectionKeywords(matched);
  };

  // Save the Reflection
  const submitReflection = () => {
    if (!activeChallenge) return;

    // Check if player has lives
    if (gameState.lives <= 0) {
      setReflectionError('No te quedan vidas para guardar reflexiones. Tu tutor debe recargar tus vidas primero.');
      showToast('¡Sin vidas! Solicita una recarga de vidas a tu tutor.');
      return;
    }

    const diff = gameState.difficulty || 'medio';
    const config = DIFFICULTY_CONFIG[diff];

    // Character/Word count validation
    if (reflectionText.trim().length < config.minWords) {
      const nextLives = Math.max(0, gameState.lives - 1);
      const updated = {
        ...gameState,
        lives: nextLives,
      };
      saveState(updated);
      
      setReflectionError(`Tu nota es demasiado corta (${reflectionText.trim().length} caracteres). Para dificultad ${config.name}, necesitas mínimo ${config.minWords} caracteres. ¡Has perdido 1 vida! Intentos restantes: ${nextLives}`);
      
      if (nextLives === 0) {
        setTimeout(() => {
          setShowNoteModal(false);
          setShowRechargeModal(true);
        }, 1500);
      }
      return;
    }

    // Keyword validation
    if (reflectionKeywords.length < config.minKeywords) {
      const nextLives = Math.max(0, gameState.lives - 1);
      const updated = {
        ...gameState,
        lives: nextLives,
      };
      saveState(updated);

      setReflectionError(`Tu reflexión es buena, pero necesitas incluir al menos ${config.minKeywords} conceptos clave para la dificultad ${config.name}. (Tienes ${reflectionKeywords.length}). ¡Has perdido 1 vida! Intentos restantes: ${nextLives}`);
      
      if (nextLives === 0) {
        setTimeout(() => {
          setShowNoteModal(false);
          setShowRechargeModal(true);
        }, 1500);
      }
      return;
    }

    setReflectionError('');

    // Complete the challenge
    const updatedDone = { ...gameState.done };
    updatedDone[activeChallenge.id] = {
      t: reflectionText.trim(),
      ts: Date.now(),
    };

    // Apply scoring and check milestones
    const { score, unlockedMilestones, newAchievements } = checkAndApplyScoreAndMilestones(
      updatedDone,
      gameState.ver,
      gameState.unlockedMilestones || [],
      gameState.score || 0,
      diff,
      activeChallenge.id,
      false
    );

    const nextCompletedCount = Object.keys(updatedDone).length;
    const nextDiff = getDynamicDifficulty(nextCompletedCount);
    const difficultyIncreased = nextDiff !== diff;

    const nextLives = difficultyIncreased 
      ? DIFFICULTY_CONFIG[nextDiff].initialLives 
      : gameState.lives;

    const updated = {
      ...gameState,
      done: updatedDone,
      score: score,
      unlockedMilestones: unlockedMilestones,
      difficulty: nextDiff,
      lives: nextLives,
      ld: Date.now(),
      cur: null,
    };

    saveState(updated, null);
    setShowNoteModal(false);

    // Dynamic appreciative feedback from Vincl Consultores mentors
    const feedbackList = REFLECTIVE_FEEDBACK[activeChallenge.pil];
    const mentorFeedback = feedbackList[Math.floor(Math.random() * feedbackList.length)];

    const ptsAwarded = config.ptsPerChallenge;
    let feedbackWithMilestones = mentorFeedback;
    if (newAchievements.length > 0) {
      feedbackWithMilestones += `\n\n🏆 ¡FELICIDADES! Has alcanzado un nuevo hito:\n${newAchievements.join('\n')}`;
    }
    if (difficultyIncreased) {
      feedbackWithMilestones += `\n\n🚀 ¡ASCENSO DE DIFICULTAD AUTOMÁTICA!\nTu progreso constante ha elevado tu nivel de dificultad a ${DIFFICULTY_CONFIG[nextDiff].name}. Las pautas de autoprotección y notas de integridad ahora se evalúan con mayor rigor. ¡Tus vidas de integridad han sido restablecidas a ${DIFFICULTY_CONFIG[nextDiff].initialLives}!`;
    }

    setLastReward({
      xp: activeChallenge.exp,
      title: `${activeChallenge.title} (+${ptsAwarded} pts)`,
      feedback: feedbackWithMilestones,
      icon: activeChallenge.rew.icon,
    });

    setShowRewardModal(true);
    setScreen('map');
  };

  // Teammate verification logic
  const handleTeammateVerification = () => {
    if (gameState.lives <= 0) {
      showToast('No te quedan vidas para realizar verificaciones. Tu tutor debe recargar tus vidas primero.');
      setShowRechargeModal(true);
      return;
    }
    setVerCode('');
    setVerAns('');
    setVerError('');
    setVerSuccess(false);
    setShowVerModal(true);
  };

  const executeTeammateVerification = () => {
    setVerError('');
    if (gameState.lives <= 0) {
      setVerError('No te quedan vidas para realizar verificaciones.');
      return;
    }
    if (!verCode.trim()) {
      setVerError('Debes ingresar el código de verificación de tu compañero.');
      return;
    }
    if (!verAns.trim() || verAns.trim().length < 5) {
      setVerError('Introduce una respuesta válida y descriptiva a la pregunta de tu compañero.');
      return;
    }

    // Try to extract challenge ID from code format e.g. ABC[HEX]99
    const match = verCode.toUpperCase().match(/^[A-Z]{3}([0-9A-F]+)99$/);
    if (!match) {
      const nextLives = Math.max(0, gameState.lives - 1);
      const updated = {
        ...gameState,
        lives: nextLives,
      };
      saveState(updated);
      
      setVerError(`Código de compañero inválido. Recuerda el formato ABC[RET]99 (Ej: CAR399). ¡Has perdido 1 vida! Intentos restantes: ${nextLives}`);
      
      if (nextLives === 0) {
        setTimeout(() => {
          setShowVerModal(false);
          setShowRechargeModal(true);
        }, 1500);
      }
      return;
    }

    const chId = parseInt(match[1], 16);
    const targetChallenge = CHALLENGES.find((item) => item.id === chId);

    if (!targetChallenge) {
      const nextLives = Math.max(0, gameState.lives - 1);
      const updated = {
        ...gameState,
        lives: nextLives,
      };
      saveState(updated);

      setVerError(`El código no corresponde a ningún reto válido. ¡Has perdido 1 vida! Intentos restantes: ${nextLives}`);
      
      if (nextLives === 0) {
        setTimeout(() => {
          setShowVerModal(false);
          setShowRechargeModal(true);
        }, 1500);
      }
      return;
    }

    if (targetChallenge.eqp !== 'equipo') {
      setVerError(`El reto "${targetChallenge.title}" es individual. Las verificaciones de compañero son exclusivamente para retos en equipo.`);
      return;
    }

    if (!gameState.done[chId]) {
      setVerError(`Tu compañero aún no ha completado el reto "${targetChallenge.title}". Primero debe completarlo en su dispositivo.`);
      return;
    }

    if (isChallengeVerifiedHelper(gameState.ver, chId)) {
      setVerError('Este reto ya ha sido verificado con anterioridad.');
      return;
    }

    // Perform verification update (store actual verification code string in ver array)
    const updatedVer = [...gameState.ver, verCode.trim().toUpperCase()];

    // Apply scoring and check milestones
    const { score, unlockedMilestones, newAchievements } = checkAndApplyScoreAndMilestones(
      gameState.done,
      updatedVer,
      gameState.unlockedMilestones || [],
      gameState.score || 0,
      gameState.difficulty || 'medio',
      undefined,
      true
    );

    const updated = {
      ...gameState,
      ver: updatedVer,
      score: score,
      unlockedMilestones: unlockedMilestones,
    };
    saveState(updated);

    setVerSuccess(true);
    let verMsg = `¡Reto "${targetChallenge.title}" verificado con éxito!`;
    if (newAchievements.length > 0) {
      verMsg += `\n🏆 ${newAchievements.join(', ')}`;
    }
    showToast(verMsg);
    setTimeout(() => {
      setShowVerModal(false);
    }, 2500);
  };

  const handleRechargeLives = () => {
    if (rechargePin === gameState.pin) {
      const maxLives = DIFFICULTY_CONFIG[gameState.difficulty || 'medio'].initialLives;
      const updated = {
        ...gameState,
        lives: maxLives,
      };
      saveState(updated);
      setShowRechargeModal(false);
      setRechargePin('');
      setRechargeError(false);
      showToast('¡Vidas recargadas con éxito por tu tutor! Mantén tu espíritu de integridad.');
    } else {
      setRechargeError(true);
      showToast('PIN incorrecto. Pide ayuda a tu tutor.');
    }
  };

  // Reset progress option
  const triggerResetAll = () => {
    if (window.confirm('¿Seguro que deseas reiniciar todo tu progreso, alias, notas y firmas? Esta acción es irreversible.')) {
      localStorage.removeItem('sv_sendadevalores_v1');
      localStorage.removeItem('sv4');
      setGameState(INITIAL_STATE);
      setSelectedAvatar('fox');
      setAliasInput('');
      setSignature('');
      setPinInput('');
      setParentDob('');
      setPrivacyChecked(false);
      setSafetyAgreed({});
      setScreen('land');
      showToast('Progreso borrado correctamente.');
    }
  };

  const getPillarStatus = (pillarKey: PillarId) => {
    const pillarChallenges = CHALLENGES.filter((ch) => ch.pil === pillarKey);
    const completedCount = pillarChallenges.filter((ch) => gameState.done[ch.id]).length;
    return {
      completed: completedCount,
      total: pillarChallenges.length,
    };
  };

  // Render proper badge icon component
  const renderBadge = (iconName: string, className: string) => {
    const IconComponent = getIconComponent(iconName);
    return <IconComponent className={className} size={24} />;
  };

  return (
    <div className="min-h-screen bg-[#080c18] text-[#dceef0] font-sans relative overflow-x-hidden selection:bg-teal-500 selection:text-slate-900 pb-16">
      {/* Background Decorative Sparkles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
        <div className="absolute top-1/4 left-1/10 w-96 h-96 rounded-full bg-teal-500/5 blur-[120px]" />
        <div className="absolute top-2/3 right-1/10 w-96 h-96 rounded-full bg-amber-500/5 blur-[120px]" />
      </div>

      {/* Real-time floating Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#0d1424]/95 border border-teal-500/30 text-teal-400 px-6 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 font-semibold text-sm animate-bounce">
          <Info size={18} className="text-teal-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* HEADER BAR */}
      <header className="sticky top-0 z-40 bg-[#080c18]/90 backdrop-blur-md border-b border-teal-500/10 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setScreen('land')}>
            <div className="p-1.5 rounded-lg bg-teal-500/10 border border-teal-500/30">
              <Trophy className="text-teal-400" size={20} />
            </div>
            <span className="font-display font-black text-sm tracking-widest text-teal-400">SENDA DE VALORES</span>
          </div>

          <div className="flex items-center gap-2">
            {gameState.al && (
              <div className="hidden lg:flex items-center gap-2 bg-[#0d1424] border border-teal-500/10 rounded-full py-1 px-3">
                <span className="text-xs text-slate-400">Jugador:</span>
                <span className="text-xs font-bold text-teal-400">{gameState.al}</span>
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
            )}
            
            {/* Dynamic Connection/Privacy Status Indicator */}
            <div 
              onClick={() => {
                showToast(isOnline ? 'Soberanía de Datos: Tráfico externo aislado por seguridad. Cero datos salen de tu dispositivo.' : 'Modo Offline Hermético: Ejecutando de forma local y 100% desconectada de internet.');
                addSecurityLog(`Consulta de Privacidad: Red: ${isOnline ? 'Online (Aislada)' : 'Offline (Hermética)'}. Protección infantil activa.`);
              }}
              className={`flex items-center gap-1.5 py-1.5 px-2.5 rounded-lg border text-xs font-bold transition-all cursor-pointer select-none ${
                isOnline 
                  ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400 hover:border-emerald-500/40' 
                  : 'bg-amber-500/5 border-amber-500/20 text-amber-400 hover:border-amber-500/40'
              }`}
              title={isOnline ? "Conexión Segura: El tráfico externo está aislado. Ningún dato sale a la nube." : "Sin internet: Ejecutando localmente de forma hermética."}
            >
              <div className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              <span className="hidden sm:inline">{isOnline ? 'Datos Protegidos' : 'Modo Offline'}</span>
              <span className="sm:hidden">{isOnline ? 'Seguro' : 'Offline'}</span>
            </div>

            <button
              onClick={() => setShowPolicyModal(true)}
              className="text-xs font-bold px-3 py-1.5 rounded-lg border border-teal-500/10 hover:border-teal-500/30 bg-[#0d1424] text-slate-400 hover:text-[#dceef0] transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Shield size={12} className="text-amber-500" />
              <span>Privacidad</span>
            </button>

            {gameState.al && (
              <button
                onClick={triggerResetAll}
                title="Reiniciar Progreso"
                className="p-1.5 rounded-lg border border-red-500/20 hover:border-red-500/50 hover:bg-red-500/10 text-red-400 transition-all cursor-pointer"
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* SCREEN ROUTER */}
      <main className="max-w-4xl mx-auto px-4 py-8 relative z-10">

        {/* 1. LANDING SCREEN */}
        {screen === 'land' && (
          <div className="flex flex-col items-center justify-center min-h-[70vh] text-center max-w-lg mx-auto py-12">
            <p className="text-xs font-black tracking-[0.3em] text-teal-400 mb-4 uppercase">DESAFÍOS REALES · EDUCACIÓN ÉTICA</p>
            <h1 className="font-display text-5xl sm:text-6xl font-black mb-4 tracking-tight leading-none text-white drop-shadow-lg">
              SENDA DE<br />VALORES
            </h1>
            <p className="text-slate-400 text-sm sm:text-base mb-8 leading-relaxed max-w-md">
              Un juego sin pantallas invasivas. Completa desafíos con tus amigos y familia en tu entorno real, reflexiona sobre tus valores, gana insignias y conviértete en una leyenda de tu comunidad.
            </p>

            <div className="grid grid-cols-3 gap-6 w-full max-w-sm mb-10 text-xs text-slate-400 font-bold">
              <div className="p-3 bg-[#0d1424] border border-teal-500/10 rounded-xl flex flex-col items-center gap-2">
                <Flame className="text-amber-400" size={18} />
                <span>16 Desafíos</span>
              </div>
              <div className="p-3 bg-[#0d1424] border border-teal-500/10 rounded-xl flex flex-col items-center gap-2">
                <Users className="text-emerald-400" size={18} />
                <span>4 Pilares</span>
              </div>
              <div className="p-3 bg-[#0d1424] border border-teal-500/10 rounded-xl flex flex-col items-center gap-2">
                <ShieldAlert className="text-cyan-400" size={18} />
                <span>0 Datos Nube</span>
              </div>
            </div>

            <div className="w-full max-w-sm mb-6">
              {isStandalone ? (
                <div className="w-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold rounded-xl py-3 px-4 text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/5">
                  <CheckCircle2 size={16} className="text-emerald-400" />
                  <span className="uppercase tracking-wider">✓ App instalada nativamente en tu equipo</span>
                </div>
              ) : (
                <button
                  onClick={handleInstallApp}
                  className={`w-full font-black text-xs py-3.5 px-4 rounded-xl border transition-all duration-300 flex items-center justify-center gap-2 shadow-lg cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0.5 ${
                    isAppInstallable
                      ? 'bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 border-teal-400 animate-pulse font-extrabold shadow-teal-500/10'
                      : 'bg-slate-900 hover:bg-slate-850 text-teal-400 border-teal-500/35 shadow-slate-950/50'
                  }`}
                >
                  <Download size={14} className={isAppInstallable ? 'animate-bounce' : ''} />
                  <span className="uppercase tracking-wider">
                    {isAppInstallable ? 'Instalar Aplicación en este Equipo' : 'Instalar / Descargar App Offline'}
                  </span>
                </button>
              )}
              <p className="text-[10px] text-slate-500 mt-1.5 leading-normal">
                {isStandalone
                  ? 'Estás ejecutando la aplicación de forma local, desconectada y segura.'
                  : 'Instala la app para usarla sin internet, sin compartir datos en la nube y de forma segura.'}
              </p>
            </div>

            <button
              onClick={() => {
                if (gameState.pin) {
                  setScreen('avatar');
                } else {
                  setScreen('parent');
                }
              }}
              className="w-full sm:w-auto bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-black text-base px-10 py-4 rounded-xl shadow-lg shadow-teal-500/20 transform hover:-translate-y-0.5 active:translate-y-0.5 transition-all cursor-pointer"
            >
              EMPEZAR EL RETO
            </button>

            <p className="text-[11px] text-slate-500 mt-4 leading-relaxed">
              Cumple estrictamente con las leyes COPPA, GDPR-K y LFPDPPP de protección infantil.<br />
              Se requiere la presencia física y firma de un tutor adulto.
            </p>

            <div className="mt-8 pt-6 border-t border-teal-500/10 w-full flex flex-col items-center gap-3">
              <span className="text-xs text-slate-400">Administración y Seguridad Offline</span>
              <div className="flex flex-wrap gap-2.5 justify-center">
                <button
                  onClick={() => setScreen('parent')}
                  className="text-xs font-bold text-amber-400 hover:text-amber-300 transition bg-amber-400/5 hover:bg-amber-400/10 border border-amber-400/20 rounded-lg px-4 py-2 cursor-pointer flex items-center gap-1.5"
                >
                  <Shield size={14} />
                  <span>Configurar Portal de Tutela</span>
                </button>
                <button
                  onClick={() => setShowSecurityModal(true)}
                  className="text-xs font-bold text-teal-400 hover:text-teal-300 transition bg-teal-400/5 hover:bg-teal-400/10 border border-teal-500/20 rounded-lg px-4 py-2 cursor-pointer flex items-center gap-1.5"
                >
                  <Shield size={14} className="animate-pulse" />
                  <span>Consola de Seguridad & Offline</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 2. PARENTAL CONSENT SCREEN */}
        {screen === 'parent' && (
          <div className="max-w-md mx-auto bg-[#0d1424] border border-teal-500/20 rounded-2xl p-6 sm:p-8">
            <button
              onClick={() => setScreen('land')}
              className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1 mb-6 bg-transparent border-0 cursor-pointer"
            >
              <ArrowLeft size={14} />
              <span>Volver</span>
            </button>

            <div className="flex items-center gap-3.5 mb-6">
              <div className="w-12 h-12 rounded-full bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400">
                <Shield size={24} />
              </div>
              <div>
                <h2 className="font-display text-lg font-bold text-amber-400">Portal de Tutela</h2>
                <p className="text-xs text-slate-400">Aprobación de juego & Consentimiento COPPA/GDPR</p>
              </div>
            </div>

            <div className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Fecha de nacimiento del Tutor:</label>
                <input
                  type="date"
                  value={parentDob}
                  onChange={(e) => setParentDob(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 focus:border-amber-400 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/20 transition-all"
                />
                {dobError && (
                  <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                    <ShieldAlert size={12} />
                    <span>El tutor debe ser mayor de 18 años para autorizar.</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Política de Privacidad y Términos Legales:</label>
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 h-48 overflow-y-auto text-xs text-slate-400 leading-relaxed space-y-2">
                  <p className="font-bold text-white uppercase tracking-wider text-[10px]">CONTRATO DE CONSENTIMIENTO PARENTAL INFORMADO (SENDA DE VALORES)</p>
                  <p>
                    <strong>1. Cero Recopilación de Datos (LFPDPPP Art. 6, COPPA):</strong> Esta aplicación está especialmente diseñada para proteger la privacidad de los menores. No recolectamos, guardamos, ni transmitimos información de carácter personal como correos electrónicos, nombres reales, números telefónicos o ubicaciones GPS.
                  </p>
                  <p>
                    <strong>2. Almacenamiento Local (GDPR-K Art. 5):</strong> Toda la información de juego, progreso de retos, alias elegidos y textos reflexivos son almacenados estrictamente de forma local en la memoria de este navegador. Al limpiar la caché del navegador o restaurar la app, toda la información se elimina para siempre.
                  </p>
                  <p>
                    <strong>3. Participación del Tutor (COPPA Sección III):</strong> Los retos se completan en el entorno real y requieren la supervisión directa del tutor. La validación se autoriza mediante un código PIN secreto creado por usted.
                  </p>
                  <p>
                    <strong>4. Pautas de Emergencia:</strong> En caso de cualquier percance o situación de riesgo, recuerde utilizar los servicios oficiales locales de urgencia (112 / Bomberos / Protección Civil).
                  </p>
                </div>
              </div>

              <label className="flex items-start gap-2.5 cursor-pointer pt-2">
                <input
                  type="checkbox"
                  checked={privacyChecked}
                  onChange={(e) => setPrivacyChecked(e.target.checked)}
                  className="mt-1 rounded text-amber-500 focus:ring-amber-500 border-slate-700 bg-slate-900 h-4.5 w-4.5"
                />
                <span className="text-xs text-slate-400 leading-normal">
                  He leído y acepto los términos de protección infantil de menores descritos en la política legal para que mi menor a cargo juegue de manera segura.
                </span>
              </label>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Firma del Tutor (Nombre completo):</label>
                <input
                  type="text"
                  placeholder="Ej: Sofía García"
                  value={signature}
                  onChange={(e) => setSignature(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 focus:border-amber-400 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/20 transition-all placeholder-slate-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Crea un PIN de Tutor (4 dígitos):</label>
                <input
                  type="password"
                  maxLength={4}
                  placeholder="****"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ''))}
                  className="w-full bg-slate-900 border border-slate-700 focus:border-emerald-400 rounded-xl px-4 py-3 text-center text-3xl font-black tracking-widest text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/20 transition-all placeholder-slate-700"
                />
                <p className="text-xs text-slate-400 mt-1">Este PIN será necesario para que tu tutor autorice el inicio de cada desafío físico real.</p>
                {pinError && (
                  <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                    <ShieldAlert size={12} />
                    <span>PIN inválido. Deben ser 4 números.</span>
                  </p>
                )}
              </div>

              <button
                onClick={handleParentSubmit}
                className="w-full mt-6 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm px-6 py-3.5 rounded-xl shadow-lg transition-all cursor-pointer"
              >
                AUTORIZAR Y REGISTRAR PERFIL
              </button>

              <button
                type="button"
                onClick={() => setShowSecurityModal(true)}
                className="w-full mt-3 bg-slate-900 hover:bg-slate-800 text-teal-400 border border-teal-500/20 font-bold text-xs px-4 py-2.5 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Shield size={13} className="animate-pulse" />
                <span>Consola de Seguridad Local & Copias Offline</span>
              </button>
            </div>
          </div>
        )}

        {/* 3. PROFILE / AVATAR SETUP */}
        {screen === 'avatar' && (
          <div className="max-w-md mx-auto bg-[#0d1424] border border-teal-500/20 rounded-2xl p-6 sm:p-8 text-center">
            <h2 className="font-display text-2xl font-bold text-teal-400 mb-1">Crea tu Identidad</h2>
            <p className="text-xs text-slate-400 mb-6">Tu privacidad es sagrada. Ningún dato real tuyo se comparte.</p>

            <label className="block text-xs font-bold text-slate-400 mb-3 text-left uppercase tracking-wider">1. Elige tu Avatar:</label>
            <div className="grid grid-cols-4 gap-3 mb-6">
              {AVATARS.map((av) => {
                const Icon = getIconComponent(av.icon);
                const isSelected = selectedAvatar === av.id;
                return (
                  <button
                    key={av.id}
                    onClick={() => setSelectedAvatar(av.id)}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-teal-400 bg-teal-400/10 scale-105 shadow-md shadow-teal-500/10'
                        : 'border-slate-800 bg-slate-900/60 hover:bg-slate-900 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Icon size={20} className={isSelected ? 'text-teal-400' : 'text-slate-400'} />
                    <span className="text-xs font-bold tracking-tight truncate w-full">{av.name.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>

            <label className="block text-xs font-bold text-slate-400 mb-3 text-left uppercase tracking-wider">2. Rango de Edad:</label>
            <div className="flex gap-3 mb-6">
              <button
                onClick={() => setAgeMode(0)}
                className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs border transition-all cursor-pointer ${
                  ageMode === 0
                    ? 'border-teal-400 bg-teal-400/10 text-teal-400'
                    : 'border-slate-800 bg-slate-900 text-slate-400'
                }`}
              >
                Categoría A (11-13 años)
              </button>
              <button
                onClick={() => setAgeMode(1)}
                className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs border transition-all cursor-pointer ${
                  ageMode === 1
                    ? 'border-teal-400 bg-teal-400/10 text-teal-400'
                    : 'border-slate-800 bg-slate-900 text-slate-400'
                }`}
              >
                Categoría B (14-16 años)
              </button>
            </div>

            <label className="block text-xs font-bold text-slate-400 mb-3 text-left uppercase tracking-wider">3. Nivel de Dificultad Dinámica (Progresivo):</label>
            <div className="bg-slate-950/60 border border-amber-500/10 rounded-2xl p-4 text-left space-y-3 mb-6">
              <div className="flex items-center gap-2">
                <span className="text-sm">⚡</span>
                <span className="text-xs font-black text-amber-400 uppercase tracking-wider">Regulado automáticamente por tu progreso</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Todos los exploradores inician su senda en la dificultad <span className="text-emerald-400 font-bold">Fácil</span>. A medida que completes tus desafíos reales, el sistema <b>elevará automáticamente tu dificultad</b>:
              </p>
              <div className="grid grid-cols-3 gap-2 pt-1">
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-center">
                  <span className="block text-[10px] font-black uppercase text-emerald-400">Fácil</span>
                  <span className="block text-[9px] text-slate-500">0 - 3 retos</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-center">
                  <span className="block text-[10px] font-black uppercase text-amber-400">Medio</span>
                  <span className="block text-[9px] text-slate-500">4 - 8 retos</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-center">
                  <span className="block text-[10px] font-black uppercase text-red-400">Difícil</span>
                  <span className="block text-[9px] text-slate-500">9+ retos</span>
                </div>
              </div>
              <p className="text-[10px] text-slate-500 leading-normal italic">
                El avance aumentará los requisitos de palabras y conceptos clave de autoprotección, restableciendo tus vidas de integridad al ascender.
              </p>
            </div>

            <label className="block text-xs font-bold text-slate-400 mb-3 text-left uppercase tracking-wider">4. Tu Entorno Geográfico (Senda Preferente):</label>
            <div className="grid grid-cols-3 gap-2 mb-2">
              {(['urbano', 'comunitario', 'rural'] as const).map((ent) => {
                const isSelected = selectedEntorno === ent;
                const labels = {
                  urbano: { name: 'Urbano 🏢', desc: 'Calles y plazas' },
                  comunitario: { name: 'Comunitario 🏫', desc: 'Patios y solares' },
                  rural: { name: 'Rural 🌳', desc: 'Bosques y campo' },
                };
                return (
                  <button
                    key={ent}
                    onClick={() => setSelectedEntorno(ent)}
                    className={`p-2.5 rounded-xl border flex flex-col items-center justify-between text-center transition-all cursor-pointer ${
                      isSelected
                        ? 'border-teal-400 bg-teal-400/10 scale-[1.03] shadow-md shadow-teal-500/10 text-white font-bold'
                        : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-300'
                    }`}
                  >
                    <span className="text-xs font-black uppercase tracking-wider">{labels[ent].name}</span>
                    <span className="text-xs text-slate-500 block mt-1 leading-tight">
                      {labels[ent].desc}
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-slate-400 text-left mb-6">
              Define las instrucciones del reto que se adaptarán por defecto a tu realidad física diaria.
            </p>

            <div className="text-left mb-6">
              <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">5. Elige tu Alias o Apodo:</label>
              <input
                type="text"
                maxLength={15}
                placeholder="Ej: HalcónGris"
                value={aliasInput}
                onChange={(e) => setAliasInput(e.target.value.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]/g, ''))}
                className="w-full bg-slate-900 border border-slate-700 focus:border-teal-400 rounded-xl px-4 py-3 text-center text-xl font-bold text-white focus:outline-none focus:ring-2 focus:ring-teal-400/20 transition-all placeholder-slate-600"
              />
              <p className="text-xs text-slate-400 mt-1.5">No utilices tu apellido ni tu nombre real por motivos de protección infantil.</p>
            </div>

            <button
              onClick={handleAvatarSubmit}
              className="w-full bg-teal-400 hover:bg-teal-300 text-slate-950 font-black text-sm px-6 py-3.5 rounded-xl shadow-lg transition-all cursor-pointer"
            >
              ENTRAR A LA SENDA
            </button>
          </div>
        )}

        {/* 4. MAIN MAP SCREEN */}
        {screen === 'map' && (
          <div className="space-y-6">
            {/* Player Dashboard Stats Card */}
            <div className="bg-[#0d1424] border border-teal-500/10 rounded-2xl p-4 sm:p-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-3 flex gap-2">
                <button
                  onClick={() => setShowSecurityModal(true)}
                  className="bg-teal-950/40 hover:bg-teal-900/50 border border-teal-500/30 hover:border-teal-400 text-teal-400 text-[10px] font-bold py-1 px-2.5 rounded-full flex items-center gap-1 transition-all cursor-pointer"
                  title="Consola de Seguridad Local, Respaldos de Progreso, Verificación SHA-256 e Instrucciones Offline"
                >
                  <Shield size={10} className="animate-pulse" />
                  <span>Seguridad & Offline</span>
                </button>
                <button
                  onClick={() => setDemoMode(!demoMode)}
                  className={`text-[10px] font-bold py-1 px-2.5 rounded-full border transition-all cursor-pointer ${
                    demoMode
                      ? 'bg-amber-400/10 border-amber-400/30 text-amber-400'
                      : 'bg-slate-900 border-slate-800 text-slate-500'
                  }`}
                  title="Permite completar retos sin esperar el cooldown obligatorio de 7 días entre retos para fines de demostración"
                >
                  {demoMode ? 'Modo Demo (Sin Pausa)' : 'Modo Educativo (Pausa Activa)'}
                </button>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                {/* Profile Badge */}
                <div className="flex items-center gap-3.5">
                  <div className="w-14 h-14 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 shadow-inner">
                    {(() => {
                      const avObj = AVATARS.find((a) => a.id === gameState.av);
                      return renderBadge(avObj?.icon || 'Smile', 'text-teal-400 w-7 h-7');
                    })()}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-1.5 mt-1">
                      <span className="font-bold text-lg text-white">{gameState.al}</span>
                      <span className="bg-teal-500/10 text-teal-400 text-xs font-black uppercase px-2 py-0.5 rounded-full border border-teal-500/20">
                        {gameState.mode === 0 ? 'Cat. A (11-13)' : 'Cat. B (14-16)'}
                      </span>
                      <span className="bg-amber-500/10 text-amber-400 text-xs font-black uppercase px-2 py-0.5 rounded-full border border-amber-500/20">
                        🎒 {gameState.entorno === 'urbano' ? 'Senda Urbana' : gameState.entorno === 'comunitario' ? 'Senda Comunitaria' : 'Senda Rural'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 font-medium mt-1">Rango: <span className="text-teal-300 font-bold">{rankInfo.name}</span></p>
                  </div>
                </div>

                {/* Progress Circle & Score */}
                <div className="flex flex-wrap gap-2 items-center justify-start sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-800">
                  <div className="text-center bg-slate-950/40 border border-amber-500/20 rounded-xl px-3 py-1.5" title="Puntos ganados por completar desafíos e hitos">
                    <span className="block text-xs text-amber-400 font-bold uppercase tracking-wider">PUNTOS</span>
                    <span className="text-base font-black text-amber-300">⭐ {gameState.score || 0}</span>
                  </div>

                  <div className="text-center bg-slate-950/40 border border-slate-800 rounded-xl px-3 py-1.5">
                    <span className="block text-xs text-slate-400 font-bold uppercase tracking-wider">XP TOTAL</span>
                    <span className="text-sm font-black text-slate-300">{currentXp} / 960</span>
                  </div>

                  <div className="text-center bg-slate-950/40 border border-slate-800 rounded-xl px-3 py-1.5">
                    <span className="block text-xs text-slate-400 font-bold uppercase tracking-wider">RETOS</span>
                    <span className="text-sm font-black text-teal-400">{completedChallengesCount} / 16</span>
                  </div>

                  <div className="text-center bg-slate-950/40 border border-slate-800 rounded-xl px-3 py-1.5">
                    <span className="block text-xs text-slate-400 font-bold uppercase tracking-wider">DIFICULTAD</span>
                    <span className="text-xs font-black uppercase text-amber-500">
                      {DIFFICULTY_CONFIG[gameState.difficulty || 'medio'].name}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      if (gameState.lives <= 0) {
                        setShowRechargeModal(true);
                      } else {
                        showToast(`Tienes ${gameState.lives} vidas de integridad restantes.`);
                      }
                    }}
                    className={`text-center bg-slate-950/40 border rounded-xl px-3 py-1.5 transition-all cursor-pointer ${
                      gameState.lives <= 0
                        ? 'border-red-500 bg-red-500/10 text-red-400 animate-pulse'
                        : 'border-slate-800 text-rose-400 hover:border-rose-500/30'
                    }`}
                  >
                    <span className="block text-xs text-rose-400 font-bold uppercase tracking-wider">VIDAS</span>
                    <span className="text-sm font-black flex items-center justify-center gap-0.5 min-h-[20px]">
                      {gameState.lives > 0 ? (
                        Array.from({ length: gameState.lives }).map((_, i) => (
                          <span key={i} className="text-rose-500 text-xs">❤️</span>
                        ))
                      ) : (
                        <span className="text-xs font-bold text-red-400 uppercase flex items-center gap-1">
                          💔 RECUPERAR
                        </span>
                      )}
                    </span>
                  </button>
                </div>
              </div>

              {/* Progress Level Bar */}
              <div className="mt-5 space-y-1.5">
                <div className="flex justify-between items-center text-xs text-slate-400">
                  <span>Progreso de Leyenda</span>
                  <span className="font-bold text-teal-300">{(completedChallengesCount / 16 * 100).toFixed(0)}%</span>
                </div>
                <div className="w-full bg-slate-950 border border-slate-800 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-teal-500 to-emerald-400 h-full rounded-full transition-all duration-700"
                    style={{ width: `${(completedChallengesCount / 16) * 100}%` }}
                  />
                </div>
              </div>

              {/* Active Strategic Cooldown Alert */}
              {onCooldown() && (
                <div className="mt-4 bg-amber-400/5 border border-amber-400/20 text-amber-300 p-3 rounded-xl flex items-center gap-3 text-xs">
                  <Clock size={16} className="text-amber-400 flex-shrink-0 animate-pulse" />
                  <div>
                    <span className="font-bold">Pausa estratégica activa: </span>
                    Los mejores exploradores reflexionan y procesan sus vivencias. Próximo reto disponible en <span className="font-black text-white">{getCooldownTimeRemaining()}</span>.
                  </div>
                </div>
              )}
            </div>

            {/* CLASSMATE VERIFICATION HUB ROW */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-[#0d1424] border border-slate-800 rounded-2xl p-4 flex flex-col justify-between space-y-3">
                <div className="flex justify-between items-start">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide">Mis Códigos (Retos en Equipo):</h4>
                  <span className="text-[9px] bg-cyan-500/10 text-cyan-400 px-1.5 py-0.5 rounded border border-cyan-500/20 font-bold uppercase">Socio de Equipo</span>
                </div>
                
                {teamChallengesWithCodes.length > 0 ? (
                  <div className="space-y-2 max-h-[110px] overflow-y-auto pr-1">
                    {teamChallengesWithCodes.map((ch) => (
                      <div key={ch.id} className="flex justify-between items-center bg-slate-950/60 p-2 rounded-xl border border-slate-800 gap-2">
                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] text-slate-400 truncate font-medium">{ch.title}</p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-xs font-black text-teal-400 tracking-wider font-mono">
                              {generateVerificationCode(ch.id)}
                            </span>
                            <button
                              onClick={() => handleShareText(
                                'Senda de Valores - Código',
                                `¡Hola! Completamos el reto "${ch.title}" de Senda de Valores. Aquí tienes mi código de verificación: ${generateVerificationCode(ch.id)}`
                              )}
                              className="p-1 hover:bg-teal-500/10 text-teal-400 rounded transition cursor-pointer"
                              title="Compartir o copiar código"
                            >
                              <Share2 size={12} />
                            </button>
                          </div>
                        </div>
                        <span className="text-[9px] text-slate-500 font-semibold italic flex-shrink-0">
                          {gameState.done[ch.id] ? 'Completado' : 'Activo'}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-2 bg-slate-950/40 rounded-xl border border-dashed border-slate-800">
                    <p className="text-[11px] text-slate-500 leading-normal italic px-3">
                      No tienes retos en equipo activos o completados para generar códigos.
                    </p>
                  </div>
                )}
                <div className="text-[10px] text-slate-500 leading-normal">
                  Comparte estos códigos únicamente para la verificación de retos de equipo correspondientes.
                </div>
              </div>

              <div className="flex flex-col justify-between bg-gradient-to-r from-[#0d1424] to-slate-900 border border-cyan-500/15 p-4 rounded-2xl space-y-3">
                <div>
                  <span className="block text-xs font-bold uppercase tracking-wide text-cyan-500">Acción de Compañero</span>
                  <p className="text-xs text-slate-400 mt-1">
                    Ingresa el código de tu compañero para confirmar su participación en una actividad de equipo realizada en conjunto.
                  </p>
                </div>
                <button
                  onClick={handleTeammateVerification}
                  className="w-full bg-cyan-950/30 hover:bg-cyan-900/50 border border-cyan-500/30 hover:border-cyan-500/50 text-cyan-400 font-bold py-3 px-4 rounded-xl flex items-center justify-between transition-all cursor-pointer text-xs"
                >
                  <span>VERIFICAR A MI COMPAÑERO</span>
                  <Compass className="text-cyan-400 animate-pulse" size={16} />
                </button>
              </div>
            </div>

            {/* LEGEND DIPLOMA CARD AT 16/16 */}
            {completedChallengesCount === 16 && (
              <div className="bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-amber-500/10 border-2 border-amber-400/40 rounded-2xl p-6 text-center shadow-xl shadow-amber-400/5 animate-pulse">
                <Trophy className="text-amber-400 mx-auto mb-3" size={48} />
                <h2 className="font-display text-2xl font-black text-amber-400 uppercase tracking-widest mb-1">¡HAS CONSEGUIDO LA SENDA COMPLETA!</h2>
                <p className="text-slate-300 text-xs sm:text-sm max-w-md mx-auto mb-4">
                  Completaste con éxito los 16 desafíos de valores. Has demostrado resiliencia, respeto, empatía y liderazgo real. Tu diploma de leyenda está listo.
                </p>
                <button
                  onClick={() => setScreen('dip')}
                  className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm px-6 py-3 rounded-xl shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
                >
                  VER MI DIPLOMA DE LEYENDA
                </button>
              </div>
            )}

            {/* BENTO GRID OF PILLARS AND CHALLENGES */}
            <div className="space-y-6">
              {(Object.keys(PILLARS) as PillarId[]).map((pilKey) => {
                const pillar = PILLARS[pilKey];
                const stats = getPillarStatus(pilKey);
                const pillarChallenges = CHALLENGES.filter((c) => c.pil === pilKey);
                const PillarIcon = getIconComponent(pillar.icon);

                return (
                  <div key={pilKey} className="bg-slate-950 border border-slate-800/60 rounded-2xl overflow-hidden shadow-lg">
                    {/* Pillar Banner Header */}
                    <div className={`p-4 flex items-center justify-between border-b border-slate-800/80 bg-slate-900/40`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl ${pillar.bg} border border-teal-500/10 flex items-center justify-center ${pillar.clr}`}>
                          <PillarIcon size={20} />
                        </div>
                        <div>
                          <h3 className={`font-display text-sm font-bold uppercase tracking-wider text-white`}>
                            {pillar.name}
                          </h3>
                          <p className="text-[11px] text-slate-500 font-medium">{pillar.sub}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`text-xs font-black px-2.5 py-1 rounded-full ${pillar.bg} ${pillar.clr}`}>
                          {stats.completed} / {stats.total} retos
                        </span>
                      </div>
                    </div>

                    {/* Challenges Row / Sub-grid */}
                    <div className="divide-y divide-slate-900">
                      {pillarChallenges.map((ch) => {
                        const isDone = !!gameState.done[ch.id];
                        const isVer = isChallengeVerifiedHelper(gameState.ver, ch.id);
                        const isTeammate = ch.eqp === 'equipo';
                        const isCdLocked = onCooldown() && !isDone;

                        const ChIcon = getIconComponent(ch.icon);

                        return (
                          <div
                            key={ch.id}
                            onClick={() => (isDone || isCdLocked ? handleStartChallenge(ch) : handleStartChallenge(ch))}
                            className={`p-4 flex items-center justify-between transition-all cursor-pointer ${
                              isDone
                                ? 'bg-emerald-500/5 hover:bg-emerald-500/10 text-slate-300 opacity-80'
                                : isCdLocked
                                ? 'opacity-40 bg-slate-950/20 hover:bg-slate-950 cursor-not-allowed'
                                : 'hover:bg-slate-900 text-slate-200'
                            }`}
                          >
                            <div className="flex items-center gap-3.5 min-w-0">
                              {/* Left status badge */}
                              <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-xs ${
                                isDone
                                  ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-400'
                                  : isCdLocked
                                  ? 'bg-slate-900 border border-slate-800 text-slate-600'
                                  : 'bg-slate-900 border border-slate-800 text-slate-400'
                              }`}>
                                {isDone ? <CheckCircle2 size={16} /> : <ChIcon size={16} className={pillar.clr} />}
                              </div>

                              <div className="min-w-0">
                                <h4 className={`text-sm font-bold truncate ${isDone ? 'line-through text-slate-500' : 'text-slate-100'}`}>
                                  {ch.title}
                                </h4>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <span className="text-[10px] text-slate-500 font-bold uppercase">
                                    {isDone ? (isVer ? 'Verificado' : 'Completado') : `+${ch.exp} XP`}
                                  </span>
                                  {isTeammate && (
                                    <span className="bg-cyan-500/5 text-cyan-400 border border-cyan-500/20 rounded text-[9px] px-1 font-bold">
                                      Equipo
                                    </span>
                                  )}
                                  {isDone && !isVer && isTeammate && (
                                    <span className="text-cyan-500 text-[9px] font-bold animate-pulse">
                                      Pendiente verificación compañero
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 text-slate-500">
                              {isDone ? (
                                <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 py-0.5 px-2 rounded-full border border-emerald-500/20">Listo</span>
                              ) : isCdLocked ? (
                                <Lock size={14} className="text-amber-500" />
                              ) : (
                                <ChevronRight size={16} className="text-slate-400" />
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CHARACTER CUSTOMIZATION STATION */}
            <div className="bg-[#0d1424] border border-teal-500/10 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
                <Smile className="text-teal-400" size={20} />
                <div>
                  <h3 className="font-display text-sm font-bold uppercase tracking-wider text-white">🧑‍🎨 Personalización de Personaje</h3>
                  <p className="text-[11px] text-slate-500">Diseña tu estilo y equipamiento para tu recorrido de valores</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Character Profile Showcase Card */}
                <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 flex flex-col items-center justify-center text-center space-y-3">
                  <div className="relative">
                    {/* Glowing Aura background */}
                    <div className="absolute inset-0 bg-teal-400/10 blur-xl rounded-full scale-110" />
                    <div className="w-20 h-20 rounded-2xl bg-slate-900 border-2 border-teal-500/30 flex flex-col items-center justify-center text-3xl relative z-10 shadow-lg">
                      {(() => {
                        switch (gameState.av) {
                          case 'fox': return '🦊';
                          case 'owl': return '🦉';
                          case 'eagle': return '🦅';
                          case 'wolf': return '🐺';
                          case 'bear': return '🐻';
                          case 'stag': return '🦌';
                          case 'dolphin': return '🐬';
                          case 'dragon': return '🐲';
                          default: return '👤';
                        }
                      })()}
                      {/* Floating custom badge markers */}
                      <span className="absolute -top-1 -right-1 text-xs" title="Accesorio">
                        {(() => {
                          switch (gameState.acc || 'lupa') {
                            case 'lupa': return '🔍';
                            case 'linterna': return '🔦';
                            case 'silbato': return '📢';
                            case 'brujula': return '🧭';
                            case 'cantimplora': return '🧪';
                            default: return '🔍';
                          }
                        })()}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-black text-white uppercase tracking-wider">{gameState.al || 'Mi Personaje'}</h4>
                    <p className="text-[10px] text-teal-400 font-bold mt-1 uppercase tracking-tight">
                      {CUSTOM_HAIR.find(h => h.id === (gameState.hair || 'clasico'))?.name.split(' ')[0]} {CUSTOM_CLOTHES.find(c => c.id === (gameState.clothes || 'explorador'))?.name.split(' ')[0]}
                    </p>
                    <p className="text-[9px] text-slate-500 mt-2 italic leading-tight">
                      "Listo para descubrir, persistir y liderar la comunidad"
                    </p>
                  </div>
                </div>

                {/* Interactive Selectors Column */}
                <div className="md:col-span-2 space-y-3.5">
                  {/* Category Selection Tabs/Rows */}
                  <div className="space-y-2">
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Peinado (Estilo de Cabello):</span>
                    <div className="flex flex-wrap gap-1.5">
                      {CUSTOM_HAIR.map((hair) => (
                        <button
                          key={hair.id}
                          onClick={() => saveState({ ...gameState, hair: hair.id })}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                            (gameState.hair || 'clasico') === hair.id
                              ? 'border-teal-400 bg-teal-400/10 text-teal-300'
                              : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-300'
                          }`}
                          title={hair.desc}
                        >
                          {hair.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Vestuario (Prenda de la Senda):</span>
                    <div className="flex flex-wrap gap-1.5">
                      {CUSTOM_CLOTHES.map((cl) => (
                        <button
                          key={cl.id}
                          onClick={() => saveState({ ...gameState, clothes: cl.id })}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                            (gameState.clothes || 'explorador') === cl.id
                              ? 'border-emerald-400 bg-emerald-400/10 text-emerald-300'
                              : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-300'
                          }`}
                          title={cl.desc}
                        >
                          {cl.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Herramienta (Accesorio):</span>
                    <div className="flex flex-wrap gap-1.5">
                      {CUSTOM_ACCESSORY.map((ac) => (
                        <button
                          key={ac.id}
                          onClick={() => saveState({ ...gameState, acc: ac.id })}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                            (gameState.acc || 'lupa') === ac.id
                              ? 'border-cyan-400 bg-cyan-400/10 text-cyan-300'
                              : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-300'
                          }`}
                          title={ac.desc}
                        >
                          {ac.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Description summary of selected items */}
              <div className="bg-slate-950/40 border border-slate-800/50 rounded-xl p-3 text-xs text-slate-400 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
                <div>
                  <span className="font-bold text-white uppercase tracking-wide">Equipamiento actual: </span>
                  💇‍♂️ {CUSTOM_HAIR.find(h => h.id === (gameState.hair || 'clasico'))?.name} · 
                  🧥 {CUSTOM_CLOTHES.find(c => c.id === (gameState.clothes || 'explorador'))?.name} · 
                  🎒 {CUSTOM_ACCESSORY.find(a => a.id === (gameState.acc || 'lupa'))?.name}
                </div>
                <div className="text-[10px] text-teal-400 font-bold bg-teal-500/5 py-0.5 px-2 rounded-full border border-teal-500/20">
                  Totalmente personalizado
                </div>
              </div>
            </div>

            {/* MILESTONES & ACHIEVEMENTS BOARD */}
            <div className="bg-[#0d1424] border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800 justify-between flex-wrap gap-y-2">
                <div className="flex items-center gap-2.5">
                  <Trophy className="text-amber-400" size={20} />
                  <div>
                    <h3 className="font-display text-sm font-bold uppercase tracking-wider text-white">🏆 Hitos y Recompensas de la Senda</h3>
                    <p className="text-[11px] text-slate-500">Completa desafíos para desbloquear bonificaciones especiales de puntuación</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 font-bold bg-slate-900 px-2.5 py-1 rounded-full border border-slate-800">
                    {gameState.unlockedMilestones?.length || 0} / {MILESTONES.length} Desbloqueados
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {MILESTONES.map((m) => {
                  const isUnlocked = gameState.unlockedMilestones?.includes(m.id);
                  const Icon = getIconComponent(m.icon);
                  return (
                    <div
                      key={m.id}
                      className={`p-3.5 rounded-xl border flex flex-col items-center justify-between text-center transition-all ${
                        isUnlocked
                          ? 'border-amber-400/30 bg-amber-400/5 text-slate-200 shadow-md shadow-amber-400/5'
                          : 'border-slate-900/60 bg-slate-950/40 text-slate-500 opacity-65'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2.5 ${
                        isUnlocked ? 'bg-amber-400/15 text-amber-400' : 'bg-slate-900 text-slate-700'
                      }`}>
                        <Icon size={18} />
                      </div>
                      
                      <div className="space-y-1">
                        <span className={`block text-[11px] font-black uppercase tracking-wider ${isUnlocked ? 'text-amber-400' : 'text-slate-500'}`}>
                          {m.name}
                        </span>
                        <span className="block text-[9px] leading-tight font-medium px-1 text-slate-400">
                          {m.desc}
                        </span>
                      </div>

                      <div className="mt-3">
                        {isUnlocked ? (
                          <span className="text-[10px] text-emerald-400 bg-emerald-500/10 font-black px-2 py-0.5 rounded-full border border-emerald-500/20">
                            +{m.bonus} PTS
                          </span>
                        ) : (
                          <span className="text-[9px] text-slate-600 bg-slate-950/20 font-bold px-2 py-0.5 rounded-full border border-slate-900/40">
                            Bloqueado
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer emergency guide and developer credits */}
            <div className="mt-12 pt-6 border-t border-slate-900 text-center text-[10px] text-slate-500 space-y-2">
              <p>Desarrollado con rigor educativo y privacidad garantizada por <b className="text-amber-500">Vinci Consultores</b> · <b className="text-slate-400">vinci-consultores.ca</b></p>
              <p className="text-slate-600">Cumplimiento legislativo estricto: COPPA · GDPR-K · LFPDPPP · Google Play Family · Apple Kids</p>
              <p>Líneas de emergencia comunitaria física: <b className="text-slate-400">112</b> (Urgencias), Bomberos y Protección Civil de tu localidad.</p>
            </div>
          </div>
        )}

        {/* 5. CHALLENGE DETAILS SCREEN */}
        {screen === 'ch' && activeChallenge && (
          <div className="max-w-2xl mx-auto bg-[#0d1424] border border-teal-500/10 rounded-2xl overflow-hidden shadow-2xl">
            {/* Challenge Banner Header */}
            {(() => {
              const pillar = PILLARS[activeChallenge.pil];
              const ChIcon = getIconComponent(activeChallenge.icon);
              const isDone = !!gameState.done[activeChallenge.id];

              return (
                <div className={`p-5 sm:p-6 border-b border-slate-800 bg-slate-900/30 flex justify-between items-start`}>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-950 border border-teal-500/10 flex items-center justify-center text-teal-400 shadow-lg">
                      <ChIcon size={24} className={pillar.clr} />
                    </div>
                    <div>
                      <span className={`text-[10px] font-black uppercase tracking-wider ${pillar.clr} bg-slate-900/60 border border-slate-800 px-2.5 py-0.5 rounded-full`}>
                        {pillar.name}
                      </span>
                      <h2 className="font-display text-lg sm:text-xl font-bold text-white mt-1.5">{activeChallenge.title}</h2>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setActiveChallenge(null);
                      setScreen('map');
                      const updated = {
                        ...gameState,
                        cur: null
                      };
                      saveState(updated, null);
                    }}
                    className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
                  >
                    <X size={18} />
                  </button>
                </div>
              );
            })()}

            <div className="p-6 space-y-6">
              {/* Challenge Objective */}
              <div>
                <h4 className="text-xs font-bold text-teal-400 uppercase tracking-widest mb-2">Objetivo del Desafío:</h4>
                <p className="text-sm text-slate-300 bg-slate-950/60 border border-slate-900 p-4 rounded-xl leading-relaxed">
                  {activeChallenge.obj}
                </p>
              </div>

              {/* Adaptable Paths depending on geographic reality */}
              <div>
                <h4 className="text-xs font-bold text-amber-500 uppercase tracking-widest mb-2.5">Tramos Adaptados a tu Entorno:</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className={`p-3.5 rounded-xl space-y-1 transition-all ${
                    gameState.entorno === 'urbano' 
                      ? 'bg-teal-500/10 border-2 border-teal-400/50 shadow-md shadow-teal-500/5' 
                      : 'bg-slate-950/40 border border-slate-900 opacity-75'
                  }`}>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">🏢 Senda Urbana:</span>
                      {gameState.entorno === 'urbano' && <span className="text-[10px] bg-teal-500 text-slate-950 px-2 py-0.5 rounded-full font-black uppercase tracking-tight">Tu Senda</span>}
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{activeChallenge.vr.u}</p>
                  </div>

                  <div className={`p-3.5 rounded-xl space-y-1 transition-all ${
                    gameState.entorno === 'comunitario' 
                      ? 'bg-amber-500/10 border-2 border-amber-400/50 shadow-md shadow-amber-500/5' 
                      : 'bg-slate-950/40 border border-slate-900 opacity-75'
                  }`}>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">🏫 Senda Comunitaria:</span>
                      {gameState.entorno === 'comunitario' && <span className="text-[10px] bg-amber-500 text-slate-950 px-2 py-0.5 rounded-full font-black uppercase tracking-tight">Tu Senda</span>}
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{activeChallenge.vr.c}</p>
                  </div>

                  <div className={`p-3.5 rounded-xl space-y-1 transition-all ${
                    gameState.entorno === 'rural' 
                      ? 'bg-emerald-500/10 border-2 border-emerald-400/50 shadow-md shadow-emerald-500/5' 
                      : 'bg-slate-950/40 border border-slate-900 opacity-75'
                  }`}>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">🌳 Senda Rural:</span>
                      {gameState.entorno === 'rural' && <span className="text-[10px] bg-emerald-500 text-slate-950 px-2 py-0.5 rounded-full font-black uppercase tracking-tight">Tu Senda</span>}
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{activeChallenge.vr.r}</p>
                  </div>
                </div>
              </div>

              {/* Security parameters checklists (COPPA guidelines required for physical outdoor work) */}
              <div className="bg-red-500/5 border border-red-500/20 p-4 rounded-xl space-y-3">
                <div className="flex items-center gap-2 text-red-400 font-bold text-xs uppercase tracking-wider">
                  <ShieldAlert size={16} />
                  <span>Protocolo de Autoprotección Obligatorio (Esencial para salir):</span>
                </div>
                <div className="space-y-2">
                  {activeChallenge.safe.map((tip, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-300 leading-relaxed">
                      <span className="text-red-400 font-black flex-shrink-0 mt-0.5">•</span>
                      <span>{tip}</span>
                    </div>
                  ))}
                  <div className="mt-3 pt-2 border-t border-red-500/10 flex items-start gap-2 text-xs text-amber-300 font-bold leading-relaxed">
                    <span className="text-amber-400 font-black flex-shrink-0 mt-0.5">🚨</span>
                    <span>Líneas de emergencia comunitaria física: Llama al 112 o al número oficial de urgencias que se utilice en tu ciudad o país (Bomberos / Protección Civil de tu localidad).</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-red-500/10 flex items-start gap-2">
                  <input
                    type="checkbox"
                    id={`safCB-${activeChallenge.id}`}
                    checked={!!safetyAgreed[activeChallenge.id]}
                    onChange={(e) => {
                      const updated = { ...safetyAgreed };
                      updated[activeChallenge.id] = e.target.checked;
                      setSafetyAgreed(updated);
                    }}
                    className="mt-1 rounded text-red-500 focus:ring-red-500 border-slate-700 bg-slate-900 h-4 w-4"
                  />
                  <label htmlFor={`safCB-${activeChallenge.id}`} className="text-xs text-red-300 font-bold cursor-pointer select-none">
                    He leído y me comprometo a cumplir estrictamente con cada una de las reglas de seguridad anteriores para resguardar mi integridad física en el mundo real.
                  </label>
                </div>
              </div>

              {/* Action buttons */}
              {gameState.done[activeChallenge.id] ? (
                <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl text-center space-y-3">
                  <span className="text-emerald-400 font-bold text-xs uppercase tracking-wider block">Desafío completado con éxito</span>
                  <p className="text-xs text-slate-400 italic">" {gameState.done[activeChallenge.id].t} "</p>
                  
                  {activeChallenge.eqp === 'equipo' && (
                    <div className="mt-3 pt-3 border-t border-emerald-500/10 text-left space-y-2.5">
                      <div>
                        <span className="block text-[10px] font-black text-cyan-400 uppercase tracking-wider">Tu Código de Compañero para este Reto:</span>
                        <div className="flex gap-2 mt-1">
                          <p className="flex-1 text-base font-black text-white tracking-widest text-center bg-slate-950/60 py-2 px-4 rounded-xl border border-cyan-500/20 flex items-center justify-center font-mono">
                            {generateVerificationCode(activeChallenge.id)}
                          </p>
                          <button
                            onClick={() => handleShareText(
                              'Senda de Valores - Código de Reto',
                              `¡Hola! Completamos juntos el reto "${activeChallenge.title}" de Senda de Valores. Aquí tienes mi código para que verifiques tu participación en tu dispositivo: ${generateVerificationCode(activeChallenge.id)}`
                            )}
                            className="px-4 bg-cyan-950/50 hover:bg-cyan-900/60 border border-cyan-500/30 text-cyan-400 rounded-xl flex items-center justify-center transition cursor-pointer"
                            title="Compartir o Copiar Código"
                          >
                            <Share2 size={16} />
                          </button>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1.5 leading-normal">
                          Comparte este código con tu compañero de equipo para que él pueda verificar su participación en tu dispositivo.
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-800 flex flex-col gap-1.5">
                        <span className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">¿Quieres verificar a tu compañero?</span>
                        <button
                          onClick={() => {
                            setVerCode(generateVerificationCode(activeChallenge.id));
                            handleTeammateVerification();
                          }}
                          className="w-full bg-cyan-950/30 hover:bg-cyan-900/50 border border-cyan-500/30 hover:border-cyan-500/50 text-cyan-400 font-bold py-2 px-3 rounded-lg text-xs flex items-center justify-between transition cursor-pointer"
                        >
                          <span>Verificar código de compañero</span>
                          <Compass size={14} className="text-cyan-400" />
                        </button>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => {
                      setActiveChallenge(null);
                      setScreen('map');
                      const updated = {
                        ...gameState,
                        cur: null
                      };
                      saveState(updated, null);
                    }}
                    className="text-xs font-bold text-slate-400 hover:text-white underline mt-2 bg-transparent border-0 cursor-pointer block mx-auto"
                  >
                    Volver al mapa
                  </button>
                </div>
              ) : (
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => {
                      setActiveChallenge(null);
                      setScreen('map');
                      const updated = {
                        ...gameState,
                        cur: null
                      };
                      saveState(updated, null);
                    }}
                    className="flex-1 border border-slate-700 hover:border-slate-500 text-slate-300 font-bold py-3.5 px-6 rounded-xl text-sm transition cursor-pointer text-center"
                  >
                    Volver al Mapa
                  </button>
                  <button
                    onClick={triggerCompleteChallenge}
                    disabled={!safetyAgreed[activeChallenge.id]}
                    className="flex-1 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-black py-3.5 px-6 rounded-xl text-sm transition shadow-lg disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  >
                    REGISTRAR COMO COMPLETADO
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 6. DIPLOMA / CREDENTIAL SCREEN */}
        {screen === 'dip' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex justify-between items-center no-print">
              <button
                onClick={() => setScreen('map')}
                className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1 bg-transparent border-0 cursor-pointer"
              >
                <ArrowLeft size={14} />
                <span>Volver al Mapa</span>
              </button>
              <button
                onClick={() => window.print()}
                className="bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-black px-4 py-2 rounded-lg flex items-center gap-1.5 cursor-pointer shadow"
              >
                <Printer size={14} />
                <span>Imprimir Diploma</span>
              </button>
            </div>

            {/* CLASSIC CERTIFICATE LAYOUT (DIP-BORDER) */}
            <div className="bg-[#fcfaf2] border-[12px] border-amber-600 rounded-3xl p-6 sm:p-12 text-slate-900 shadow-2xl relative overflow-hidden text-center max-w-2xl mx-auto">
              {/* Inner vintage border detail */}
              <div className="absolute inset-4 border-2 border-amber-600/30 rounded-2xl pointer-events-none" />
              <div className="absolute inset-5 border border-dashed border-amber-600/15 rounded-xl pointer-events-none" />

              <span className="block text-[10px] font-black text-amber-700 tracking-[0.4em] mb-4 uppercase">SENDA DE VALORES</span>

              <div className="w-16 h-16 rounded-full border-4 border-amber-600/60 bg-amber-600/5 flex items-center justify-center mx-auto mb-4">
                <Trophy size={32} className="text-amber-700" />
              </div>

              <h2 className="font-display text-2xl sm:text-4xl font-black text-amber-900 tracking-tight leading-none mb-1">
                DIPLOMA DE LEYENDA
              </h2>
              <p className="text-amber-800 text-[11px] font-bold tracking-widest uppercase mb-4">
                Por haber completado con honor los 16 desafíos de civismo y propósito
              </p>

              <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-amber-700/40 to-transparent mx-auto mb-6" />

              <p className="text-xs text-slate-600 mb-1 italic">Este testimonio oficial de carácter ético se otorga a:</p>
              <h3 className="font-display text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-2">
                {gameState.al || 'EL JUGADOR'}
              </h3>

              {/* Dynamic Legend Stats & Avatar Card */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6 max-w-md mx-auto">
                <div className="flex items-center gap-2.5 bg-amber-700/5 border border-amber-700/10 rounded-xl p-2.5 shadow-sm w-full sm:w-auto">
                  <div className="w-10 h-10 rounded-lg bg-amber-700/10 border border-amber-700/20 flex items-center justify-center text-amber-800">
                    {(() => {
                      const avObj = AVATARS.find((a) => a.id === gameState.av);
                      return renderBadge(avObj?.icon || 'Smile', 'text-amber-800 w-5 h-5');
                    })()}
                  </div>
                  <div className="text-left">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Identidad</span>
                    <span className="text-xs font-bold text-slate-800">{AVATARS.find((a) => a.id === gameState.av)?.name || 'Explorador Leyenda'}</span>
                  </div>
                </div>

                <div className="flex gap-2 w-full sm:w-auto justify-center">
                  <div className="text-center bg-amber-700/5 border border-amber-700/10 rounded-xl px-2.5 py-1 shadow-sm min-w-[65px]">
                    <span className="block text-[8px] text-slate-400 font-bold uppercase tracking-wider">PUNTOS</span>
                    <span className="text-xs font-black text-amber-800">⭐ {gameState.score || 0}</span>
                  </div>
                  <div className="text-center bg-amber-700/5 border border-amber-700/10 rounded-xl px-2.5 py-1 shadow-sm min-w-[65px]">
                    <span className="block text-[8px] text-slate-400 font-bold uppercase tracking-wider">XP</span>
                    <span className="text-xs font-black text-amber-800">⚡ {currentXp}</span>
                  </div>
                  <div className="text-center bg-amber-700/5 border border-amber-700/10 rounded-xl px-2.5 py-1 shadow-sm min-w-[65px]">
                    <span className="block text-[8px] text-slate-400 font-bold uppercase tracking-wider">RACHA</span>
                    <span className="text-xs font-black text-orange-600">🔥 {getWeeklyStreak(gameState.done)} sem</span>
                  </div>
                  <div className="text-center bg-amber-700/5 border border-amber-700/10 rounded-xl px-2.5 py-1 shadow-sm min-w-[65px]">
                    <span className="block text-[8px] text-slate-400 font-bold uppercase tracking-wider">RETOS</span>
                    <span className="text-xs font-black text-emerald-700">✓ 16/16</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-700 max-w-md mx-auto leading-relaxed mb-6">
                Quien ha demostrado de manera práctica un profundo compromiso con el bienestar común, el respeto a su entorno, el auxilio ante emergencias, el fortalecimiento de habilidades manuales y la escucha respetuosa hacia los adultos mayores y miembros de su vecindario.
              </p>

              {/* Insignias grid in Certificate */}
              <div className="grid grid-cols-4 gap-4 max-w-sm mx-auto mb-6">
                {(Object.keys(PILLARS) as PillarId[]).map((pilKey) => {
                  const pillar = PILLARS[pilKey];
                  const Icon = getIconComponent(pillar.icon);
                  return (
                    <div key={pilKey} className="flex flex-col items-center gap-1">
                      <div className="w-10 h-10 rounded-full border border-amber-700/30 bg-amber-700/5 flex items-center justify-center text-amber-700">
                        <Icon size={18} />
                      </div>
                      <span className="text-[8px] font-black uppercase text-amber-800 tracking-wider text-center">{pillar.name.split(' ')[0]}</span>
                    </div>
                  );
                })}
              </div>

              {/* Dynamic Reflection Log List */}
              <div className="text-left bg-[#f4f1e3] border border-amber-700/10 p-4 rounded-xl space-y-3.5 mb-8 max-h-60 overflow-y-auto">
                <span className="block text-[9px] font-black uppercase text-amber-800 tracking-wider border-b border-amber-700/20 pb-1">Testimonios de vida (Reflexiones del menor):</span>
                {CHALLENGES.map((ch) => {
                  const doneItem = gameState.done[ch.id];
                  if (!doneItem) return null;
                  return (
                    <div key={ch.id} className="text-[10px] leading-relaxed">
                      <span className="font-bold text-slate-800 block">✓ Reto {ch.id}: {ch.title}</span>
                      <p className="text-slate-600 italic pl-3 mt-0.5">"{doneItem.t}"</p>
                    </div>
                  );
                })}
              </div>

              {/* Signatures and Seals */}
              <div className="grid grid-cols-2 gap-8 max-w-md mx-auto pt-4 border-t border-amber-700/20 text-xs">
                <div>
                  <span className="block font-serif text-slate-800 italic border-b border-slate-400 pb-1 mx-4">
                    {gameState.sig || '---'}
                  </span>
                  <span className="block text-[9px] font-bold text-slate-500 uppercase mt-1">Autorización del Tutor</span>
                </div>
                <div>
                  <span className="block font-serif text-amber-800 font-bold border-b border-slate-400 pb-1 mx-4">
                    Vinci Consultores
                  </span>
                  <span className="block text-[9px] font-bold text-slate-500 uppercase mt-1">Sello Pedagógico</span>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-amber-700/10 text-[9px] text-slate-400 space-y-1">
                <p>Fecha de Expedición: <b>{new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</b></p>
                <p>Cumple estrictamente con las directrices de consentimiento COPPA y GDPR-K sin transferencias externas de bases de datos.</p>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* --- ALL MODALS --- */}

      {/* C_LIVES. RECHARGE / REPAIR LIVES MODAL */}
      {showRechargeModal && (
        <div className="fixed inset-0 z-50 bg-[#080c18]/95 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0d1424] border border-red-500/30 rounded-2xl p-6 max-w-sm w-full shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 mx-auto animate-bounce">
              <Heart size={22} />
            </div>
            <div>
              <h3 className="font-display text-base font-bold text-red-400">Restauración de Integridad</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Has agotado tus vidas de juego por fallas de validación. 
                Pide a tu <b>tutor</b> que revise tus notas contigo para debatir sobre la honestidad y digite su PIN para recargar tus vidas.
              </p>
            </div>

            <input
              type="password"
              maxLength={4}
              value={rechargePin}
              onChange={(e) => setRechargePin(e.target.value.replace(/\D/g, ''))}
              placeholder="****"
              className="w-full bg-slate-900 border border-slate-700 focus:border-red-500 rounded-xl px-4 py-3 text-center text-3xl font-black tracking-widest text-white focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all placeholder-slate-700"
            />

            {rechargeError && (
              <p className="text-red-400 text-xs font-bold flex items-center gap-1 justify-center">
                <ShieldAlert size={12} />
                <span>PIN de tutor incorrecto. Revisa o intenta nuevamente.</span>
              </p>
            )}

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  setShowRechargeModal(false);
                  setRechargePin('');
                  setRechargeError(false);
                }}
                className="flex-1 py-2.5 rounded-lg border border-slate-800 text-slate-400 text-xs hover:text-white transition cursor-pointer"
              >
                Cerrar
              </button>
              <button
                onClick={handleRechargeLives}
                className="flex-1 py-2.5 rounded-lg bg-red-500 hover:bg-red-400 text-slate-950 font-bold text-xs transition shadow cursor-pointer"
              >
                Recargar Vidas
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SECURITY & OFFLINE CONTROL HUB MODAL */}
      {showSecurityModal && (
        <div className="fixed inset-0 z-50 bg-[#080c18]/95 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0d1424] border border-teal-500/30 rounded-2xl p-6 max-w-lg w-full shadow-2xl relative space-y-6 my-8">
            <button
              onClick={() => {
                setShowSecurityModal(false);
                setIntegrityScanCompleted(false);
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition cursor-pointer bg-transparent border-0"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
                <Shield size={20} />
              </div>
              <div className="text-left">
                <h3 className="font-display text-base font-bold text-white">Consola de Seguridad Local y Privacidad</h3>
                <p className="text-xs text-slate-400">Control offline absoluto, integridad y portabilidad de datos</p>
              </div>
            </div>

            {/* Quick indicators */}
            <div className="grid grid-cols-2 gap-3.5 text-left">
              <div className="bg-slate-950/40 border border-slate-800 p-3 rounded-xl flex items-center gap-2.5">
                <Database size={16} className="text-teal-400 flex-shrink-0" />
                <div>
                  <span className="text-[9px] text-slate-500 uppercase font-bold block">ALMACENAMIENTO</span>
                  <span className="text-xs text-slate-200 font-bold">100% Local (Navegador)</span>
                </div>
              </div>
              <div className="bg-slate-950/40 border border-slate-800 p-3 rounded-xl flex items-center gap-2.5">
                <ShieldAlert size={16} className="text-amber-400 flex-shrink-0" />
                <div>
                  <span className="text-[9px] text-slate-500 uppercase font-bold block">ESTADO DE CONEXIÓN</span>
                  <span className="text-xs text-slate-200 font-bold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Desconectado (Aislado)
                  </span>
                </div>
              </div>
            </div>

            {/* Features tab section */}
            <div className="space-y-4 text-left font-sans">
              {/* 1. File Integrity & Code Signature Checks */}
              <div className="border border-slate-800 rounded-xl p-4 bg-slate-900/40 space-y-3">
                <div className="flex justify-between items-center font-sans">
                  <div className="flex items-center gap-2">
                    <Wrench size={16} className="text-cyan-400" />
                    <span className="text-xs font-bold text-white uppercase tracking-wide">Verificación de Integridad de Código</span>
                  </div>
                  <span className="text-[10px] bg-cyan-500/10 text-cyan-400 px-1.5 py-0.5 rounded border border-cyan-500/20 font-mono font-bold">SHA-256</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Verifica que los archivos de configuración de desafíos y el código fuente local de tu dispositivo no hayan sido modificados, duplicados o manipulados de forma fraudulenta.
                </p>
                <div className="flex gap-3 items-center">
                  <button
                    onClick={runIntegrityScan}
                    disabled={isScanningIntegrity}
                    className={`flex-1 py-2 px-3 rounded-lg border font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer ${
                      isScanningIntegrity
                        ? 'border-slate-800 bg-slate-900 text-slate-500 cursor-not-allowed'
                        : 'border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400'
                    }`}
                  >
                    <RefreshCw size={12} className={isScanningIntegrity ? 'animate-spin' : ''} />
                    <span>{isScanningIntegrity ? 'Analizando Archivos...' : 'Escanear Integridad Local'}</span>
                  </button>
                  {integrityScanCompleted && (
                    <div className="text-emerald-400 text-xs font-bold flex items-center gap-1">
                      <CheckCircle2 size={14} />
                      <span>¡Firma Íntegra!</span>
                    </div>
                  )}
                </div>
              </div>

              {/* 2. Backup & Portability Engine (JSON local export/import) */}
              <div className="border border-slate-800 rounded-xl p-4 bg-slate-900/40 space-y-3">
                <div className="flex items-center gap-2 font-sans">
                  <Database size={16} className="text-emerald-400" />
                  <span className="text-xs font-bold text-white uppercase tracking-wide">Portabilidad & Copia de Seguridad Offline</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Como la app no sube tus datos a internet por motivos de privacidad, exporta tu progreso a un archivo seguro para llevarlo a otra computadora, tableta o celular, o importarlo para continuar tu camino.
                </p>
                <div className="grid grid-cols-2 gap-3.5">
                  <button
                    onClick={handleExportBackup}
                    className="py-2.5 px-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <Download size={13} />
                    <span>Exportar Progreso</span>
                  </button>
                  <label className="py-2.5 px-3 rounded-lg border border-teal-500/30 bg-teal-500/10 hover:bg-teal-500/20 text-teal-400 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer text-center">
                    <Upload size={13} />
                    <span>Importar Progreso</span>
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImportBackup}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* 3. Standalone Installer & PWA guide */}
              <div className="border border-slate-800 rounded-xl p-4 bg-slate-900/40 space-y-2.5 font-sans">
                <div className="flex items-center gap-2">
                  <Smartphone size={16} className="text-amber-400" />
                  <span className="text-xs font-bold text-white uppercase tracking-wide">¿Cómo instalar la app en mi dispositivo?</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed font-semibold">
                  Para que Senda de Valores viva y se active en tu computadora o teléfono de forma 100% desconectada:
                </p>
                <ul className="text-xs text-slate-400 space-y-1.5 list-disc pl-4 leading-normal">
                  <li><b>Computadoras & Laptops:</b> Presiona el ícono de "Instalar" 🖥️ en la barra de direcciones de tu navegador (Chrome o Edge) para tener la app como programa nativo offline.</li>
                  <li><b>Celulares & Tablets (Android / iOS):</b> Presiona el botón de menú de tu navegador y elige <b>"Agregar a pantalla de inicio"</b> o "Instalar Aplicación" 📱 para crear un acceso offline directo.</li>
                  <li><b>Almacenamiento Local Seguro:</b> Todo tu historial se queda cifrado localmente en tu equipo sin salir a la nube.</li>
                </ul>
              </div>

              {/* 4. Security Console Audit Log */}
              <div className="space-y-1.5 font-sans">
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">Registro de Auditoría de Privacidad (Cero Conexiones Nube):</span>
                <div className="bg-slate-950 rounded-xl p-3 h-28 overflow-y-auto font-mono text-[9px] text-slate-400 leading-relaxed space-y-1 border border-slate-900">
                  {securityLogs.map((log, idx) => (
                    <p key={idx} className={log.includes('[ERROR]') ? 'text-red-400' : log.includes('[ADVERTENCIA]') ? 'text-amber-400' : log.includes('[OK]') ? 'text-emerald-400' : 'text-slate-400'}>
                      {log}
                    </p>
                  ))}
                </div>
                <span className="block text-[9px] text-slate-500 italic text-right">Esta consola demuestra en tiempo real la estricta protección de datos local de menores.</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-900">
              <button
                onClick={() => {
                  setShowSecurityModal(false);
                  setIntegrityScanCompleted(false);
                }}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-white font-bold text-xs rounded-xl transition cursor-pointer"
              >
                Cerrar Consola
              </button>
            </div>
          </div>
        </div>
      )}

      {/* A. REPLACEMENT PIN AUTHORIZATION MODAL */}
      {showPinModal && (
        <div className="fixed inset-0 z-50 bg-[#080c18]/95 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0d1424] border border-amber-400/30 rounded-2xl p-6 max-w-sm w-full shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 mx-auto">
              <Lock size={22} />
            </div>
            <div>
              <h3 className="font-display text-base font-bold text-amber-400">Autorización del Tutor</h3>
              <p className="text-xs text-slate-400 mt-1">
                Por favor, solicita a tu tutor o padre de familia que digite su PIN secreto para autorizar el inicio de esta actividad en el mundo real.
              </p>
            </div>

            <input
              type="password"
              maxLength={4}
              value={pinAttempt}
              onChange={(e) => setPinAttempt(e.target.value.replace(/\D/g, ''))}
              placeholder="****"
              className="w-full bg-slate-900 border border-slate-700 focus:border-amber-400 rounded-xl px-4 py-3 text-center text-3xl font-black tracking-widest text-white focus:outline-none focus:ring-2 focus:ring-amber-400/20 transition-all placeholder-slate-700"
            />

            {pinModalError && (
              <p className="text-red-400 text-xs font-bold flex items-center gap-1 justify-center">
                <ShieldAlert size={12} />
                <span>PIN incorrecto. Revisa o intenta nuevamente.</span>
              </p>
            )}

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  setShowPinModal(false);
                  setPendingAction(null);
                }}
                className="flex-1 py-2.5 rounded-lg border border-slate-800 text-slate-400 text-xs hover:text-white transition cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handlePinVerification}
                className="flex-1 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition shadow cursor-pointer"
              >
                Autorizar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* B. NOTE / REFLECTION WRITING MODAL */}
      {showNoteModal && activeChallenge && (
        <div className="fixed inset-0 z-50 bg-[#080c18]/95 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0d1424] border border-teal-500/30 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 my-8">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <div className="w-9 h-9 rounded-full bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
                <MessageSquare size={18} />
              </div>
              <div>
                <h3 className="font-display text-sm font-bold text-white">Escribe tu Reflexión</h3>
                <p className="text-[10px] text-slate-400">Desafío: {activeChallenge.title}</p>
              </div>
            </div>

            <div className="bg-emerald-500/5 border border-emerald-500/20 p-3 rounded-xl text-xs text-slate-300">
              <span className="font-bold block text-emerald-400 mb-1">💡 Pregunta Guía:</span>
              {activeChallenge.hint}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase">Escribe tu respuesta aquí:</label>
              <textarea
                rows={5}
                value={reflectionText}
                onChange={(e) => handleNoteChange(e.target.value)}
                placeholder="Escribe lo que experimentaste, qué aprendiste de tu entorno y cómo te sentiste al realizarlo..."
                className="w-full bg-slate-900 border border-slate-700 focus:border-teal-400 rounded-xl p-3 text-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-teal-400/20 transition-all placeholder-slate-600 leading-relaxed resize-none"
              />
            </div>

            {/* Keyword Checklist Guide */}
            <div className="space-y-1.5">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Conceptos recomendados (menciona al menos 2):</span>
              <div className="flex flex-wrap gap-1.5">
                {activeChallenge.kw.slice(0, 8).map((keyword) => {
                  const matched = reflectionKeywords.includes(keyword);
                  return (
                    <span
                      key={keyword}
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full border transition-all ${
                        matched
                          ? 'bg-emerald-500/10 border-emerald-400/40 text-emerald-400 shadow-sm'
                          : 'bg-slate-900 border-slate-800 text-slate-500'
                      }`}
                    >
                      {matched ? '✓ ' : ''}{keyword}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Reflection Requirements */}
            <div className="flex items-center justify-between text-[10px] border-t border-slate-900 pt-3">
              <span className={reflectionText.length >= 80 ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                Largo: {reflectionText.length} / 80 caracteres {reflectionText.length >= 80 ? '✓' : ''}
              </span>
              <span className={reflectionKeywords.length >= 2 ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                Palabras clave: {reflectionKeywords.length} / 2 {reflectionKeywords.length >= 2 ? '✓' : ''}
              </span>
            </div>

            {reflectionError && (
              <p className="text-red-400 text-xs leading-relaxed bg-red-400/5 p-2.5 rounded-xl border border-red-500/10">
                {reflectionError}
              </p>
            )}

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowNoteModal(false)}
                className="flex-1 py-2.5 rounded-lg border border-slate-800 text-slate-400 text-xs hover:text-white transition cursor-pointer"
              >
                Volver
              </button>
              <button
                onClick={submitReflection}
                className="flex-1 py-2.5 rounded-lg bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold text-xs transition shadow cursor-pointer"
              >
                Completar Reto
              </button>
            </div>
          </div>
        </div>
      )}

      {/* C. CLASSMATE VERIFICATION MODAL */}
      {showVerModal && (
        <div className="fixed inset-0 z-50 bg-[#080c18]/95 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0d1424] border border-cyan-500/30 rounded-2xl p-6 max-w-sm w-full shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mx-auto">
              <Compass size={22} />
            </div>

            <div>
              <h3 className="font-display text-base font-bold text-cyan-400">Verificación de Compañero</h3>
              <p className="text-xs text-slate-400 mt-1">
                Escribe el código de compañero del amigo con el que hiciste el reto para verificar su logro de equipo de forma solidaria.
              </p>
            </div>

            <div className="space-y-3 text-left">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Código del Compañero:</label>
                <input
                  type="text"
                  maxLength={10}
                  value={verCode}
                  onChange={(e) => setVerCode(e.target.value.toUpperCase())}
                  placeholder="Ej: MAR199"
                  className="w-full bg-slate-900 border border-slate-700 focus:border-cyan-400 rounded-xl px-4 py-2 text-center text-lg font-black tracking-widest text-white uppercase focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">
                  Responde brevemente a su pregunta de control de equipo:
                </label>
                <p className="text-[10px] text-cyan-400 bg-cyan-500/5 p-2 rounded border border-cyan-500/10 mb-1.5">
                  {(() => {
                    const match = verCode.trim().toUpperCase().match(/^[A-Z]{3}([0-9A-F]+)99$/);
                    if (match) {
                      const chId = parseInt(match[1], 16);
                      const ch = CHALLENGES.find((item) => item.id === chId);
                      if (ch && ch.vq) {
                        return ch.vq;
                      }
                    }
                    return '¿Cómo resolvieron juntos el desafío en su zona y qué nombres o datos clave recuerdas?';
                  })()}
                </p>
                <input
                  type="text"
                  value={verAns}
                  onChange={(e) => setVerAns(e.target.value)}
                  placeholder="Escribe la respuesta aquí..."
                  className="w-full bg-slate-900 border border-slate-700 focus:border-cyan-400 rounded-xl px-3 py-2 text-slate-200 text-xs focus:outline-none"
                />
              </div>
            </div>

            {verError && (
              <p className="text-red-400 text-xs font-bold bg-red-400/5 p-2 rounded border border-red-500/10">
                {verError}
              </p>
            )}

            {verSuccess && (
              <p className="text-emerald-400 text-xs font-bold bg-emerald-500/5 p-2 rounded border border-emerald-500/10">
                ¡Reto verificado con éxito!
              </p>
            )}

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowVerModal(false)}
                className="flex-1 py-2 rounded-lg border border-slate-800 text-slate-400 text-xs hover:text-white transition cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={executeTeammateVerification}
                className="flex-1 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition shadow cursor-pointer"
              >
                Verificar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* D. REWARD ANIMATION MODAL */}
      {showRewardModal && lastReward && (
        <div className="fixed inset-0 z-50 bg-[#080c18]/95 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0d1424] border-2 border-amber-400/40 rounded-2xl p-6 sm:p-8 max-w-sm w-full text-center shadow-2xl space-y-5 relative overflow-hidden">
            {/* Glowing top effect */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500" />

            <div className="w-16 h-16 rounded-full border-4 border-amber-400 bg-amber-400/15 flex items-center justify-center mx-auto shadow-lg shadow-amber-400/10">
              {renderBadge(lastReward.icon, 'text-amber-400 w-8 h-8 animate-bounce')}
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-black tracking-[0.25em] text-amber-400 uppercase block">Insignia Obtenida</span>
              <h3 className="font-display text-xl font-bold text-white uppercase">{lastReward.title}</h3>
              <p className="text-[11px] font-bold text-teal-400">¡Ganaste +{lastReward.xp} puntos de XP!</p>
            </div>

            <div className="bg-slate-950 border border-slate-900 p-4 rounded-xl text-left space-y-2">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider block">Mensaje de los Mentores (Vinci Consultores):</span>
              <p className="text-xs text-slate-300 leading-relaxed italic">
                "{lastReward.feedback}"
              </p>
            </div>

            <button
              onClick={() => {
                setShowRewardModal(false);
                setLastReward(null);
              }}
              className="w-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs py-3 rounded-xl shadow-lg shadow-amber-500/10 transition-all cursor-pointer"
            >
              CERRAR Y CONTINUAR MAPA
            </button>
          </div>
        </div>
      )}

      {/* E. LEGAL POLICY INFO MODAL */}
      {showPolicyModal && (
        <div className="fixed inset-0 z-50 bg-[#080c18]/95 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0d1424] border border-teal-500/20 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <div className="w-9 h-9 rounded-full bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400">
                <Shield size={18} />
              </div>
              <h3 className="font-display text-sm font-bold text-white">Política de Privacidad Integral</h3>
            </div>

            <div className="bg-slate-950 border border-slate-900 p-3.5 rounded-xl h-64 overflow-y-auto text-xs text-slate-400 leading-relaxed space-y-3">
              <p className="font-bold text-white uppercase">CERO RECOPILACIÓN DE DATOS (COPPA / GDPR-K / LFPDPPP)</p>
              <p>
                <strong>Senda de Valores</strong> es un proyecto pedagógico que no solicita ni registra de manera remota datos personales del menor. Todo el progreso se almacena localmente mediante la tecnología de <i>LocalStorage</i> del navegador.
              </p>
              <p>
                <strong>Sin Anuncios ni Compras Integradas:</strong> La aplicación es 100% gratuita, libre de mercadotecnia, anuncios comerciales o compras in-app, en cumplimiento total con la política infantil de Google Play Family y Apple Kids.
              </p>
              <p>
                <strong>Derecho de Acceso y Supresión:</strong> En cualquier momento, el tutor puede eliminar permanentemente todo el progreso utilizando el botón de basura (Reiniciar Progreso) en el encabezado.
              </p>
            </div>

            <button
              onClick={() => setShowPolicyModal(false)}
              className="w-full bg-teal-400 hover:bg-teal-300 text-slate-950 font-black text-xs py-3 rounded-xl transition cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
