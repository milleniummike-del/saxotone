/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { 
  Play, 
  Square, 
  RotateCcw, 
  CheckCircle, 
  XCircle, 
  Sparkles, 
  Info, 
  HelpCircle, 
  Volume2, 
  BookOpen, 
  GraduationCap, 
  Dices, 
  ChevronRight, 
  ChevronLeft,
  ChevronUp,
  ChevronDown,
  Search,
  Check,
  AlertCircle,
  Plus,
  Trash2,
  Music,
  Upload,
  Download,
  Save
} from "lucide-react";
import { Midi } from "@tonejs/midi";
import { notesList, NoteInfo, Fingering } from "./notesData";

// Define the Key Structure for rendering
interface SaxKeyConfig {
  id: string;
  name: string;
  label: string;
  group: 'lh' | 'rh' | 'palm' | 'side' | 'pinky_l' | 'pinky_r' | 'back';
  tooltip: string;
  cx?: number;
  cy?: number;
  r?: number;
  d?: string; // For custom paths
}

// Layout coordinates for SVG saxophone keys
const saxKeysConfig: SaxKeyConfig[] = [
  // Octave Key (Left Thumb, Back)
  {
    id: "ok",
    name: "Octave Key",
    label: "OK",
    group: "back",
    tooltip: "Octave Key (LH Thumb) - Raises pitch by an octave",
    d: "M 45 105 A 15 15 0 0 1 75 105 A 15 15 0 0 0 45 105 Z" // Crescent shape
  },
  // Front F (Above LH1)
  {
    id: "front_f",
    name: "Front F",
    label: "F-F",
    group: "palm",
    tooltip: "Front F (X Key) - High E/F alternative key",
    cx: 100,
    cy: 85,
    r: 9
  },
  // Left Hand Main Keys
  {
    id: "lh1",
    name: "Key 1 (LH Index)",
    label: "1",
    group: "lh",
    tooltip: "Left Hand 1 - Index finger main key",
    cx: 100,
    cy: 115,
    r: 14
  },
  {
    id: "bis",
    name: "Bis B♭ Key",
    label: "Bis",
    group: "lh",
    tooltip: "Bis Key - Small intermediate key for Bb scale passages",
    cx: 100,
    cy: 142,
    r: 8
  },
  {
    id: "lh2",
    name: "Key 2 (LH Middle)",
    label: "2",
    group: "lh",
    tooltip: "Left Hand 2 - Middle finger main key",
    cx: 100,
    cy: 170,
    r: 14
  },
  {
    id: "lh3",
    name: "Key 3 (LH Ring)",
    label: "3",
    group: "lh",
    tooltip: "Left Hand 3 - Ring finger main key",
    cx: 100,
    cy: 210,
    r: 14
  },

  // LH Palm Keys (Upper Left Side)
  {
    id: "palm_d",
    name: "High D Palm Key",
    label: "D",
    group: "palm",
    tooltip: "High D Palm Key - LH Side key",
    d: "M 65 110 C 50 110, 45 125, 60 125 C 70 125, 75 110, 65 110 Z"
  },
  {
    id: "palm_eb",
    name: "High E♭ Palm Key",
    label: "E♭",
    group: "palm",
    tooltip: "High Eb Palm Key - LH Side key",
    d: "M 65 140 C 50 140, 45 155, 60 155 C 70 155, 75 140, 65 140 Z"
  },
  {
    id: "palm_f",
    name: "High F Palm Key",
    label: "F",
    group: "palm",
    tooltip: "High F Palm Key - LH Side key",
    d: "M 65 170 C 50 170, 45 185, 60 185 C 70 185, 75 170, 65 170 Z"
  },

  // Left Hand Pinky Table (Left side of lower LH area)
  {
    id: "pinky_g_sharp",
    name: "G♯ Key",
    label: "G♯",
    group: "pinky_l",
    tooltip: "G# Key - Left Pinky upper-outer key",
    d: "M 60 215 H 75 V 227 H 60 Z"
  },
  {
    id: "pinky_cs",
    name: "Low C♯ Key",
    label: "C♯",
    group: "pinky_l",
    tooltip: "Low C# Key - Left Pinky inner-upper key",
    d: "M 42 220 H 57 V 232 H 42 Z"
  },
  {
    id: "pinky_b",
    name: "Low B Key",
    label: "B",
    group: "pinky_l",
    tooltip: "Low B Key - Left Pinky outer-middle key",
    d: "M 60 230 H 75 V 242 H 60 Z"
  },
  {
    id: "pinky_bb",
    name: "Low B♭ Key",
    label: "B♭",
    group: "pinky_l",
    tooltip: "Low Bb Key - Left Pinky lower-outer key",
    d: "M 60 245 H 75 V 257 H 60 Z"
  },

  // Right Hand Main Keys
  {
    id: "rh4",
    name: "Key 4 (RH Index)",
    label: "4",
    group: "rh",
    tooltip: "Right Hand 4 - Index finger main key",
    cx: 100,
    cy: 280,
    r: 14
  },
  {
    id: "rh5",
    name: "Key 5 (RH Middle)",
    label: "5",
    group: "rh",
    tooltip: "Right Hand 5 - Middle finger main key",
    cx: 100,
    cy: 320,
    r: 14
  },
  {
    id: "rh6",
    name: "Key 6 (RH Ring)",
    label: "6",
    group: "rh",
    tooltip: "Right Hand 6 - Ring finger main key",
    cx: 100,
    cy: 360,
    r: 14
  },

  // Right Hand Side Keys (Upper Right Side)
  {
    id: "side_e",
    name: "Side High E Key",
    label: "S1",
    group: "side",
    tooltip: "Side High E - Right index knuckle top key",
    d: "M 130 260 C 145 260, 148 275, 135 275 C 128 275, 125 260, 130 260 Z"
  },
  {
    id: "side_c",
    name: "Side C Key",
    label: "S2",
    group: "side",
    tooltip: "Side C - Right index knuckle middle key",
    d: "M 130 290 C 145 290, 148 305, 135 305 C 128 305, 125 290, 130 290 Z"
  },
  {
    id: "side_bb",
    name: "Side B♭ Key",
    label: "S3",
    group: "side",
    tooltip: "Side Bb - Right index knuckle bottom key",
    d: "M 130 320 C 145 320, 148 335, 135 335 C 128 335, 125 320, 130 320 Z"
  },
  {
    id: "side_f_sharp",
    name: "Side High F♯ Key (Trill)",
    label: "Tr",
    group: "side",
    tooltip: "Side F# / Trill key - Right middle finger side",
    d: "M 130 350 C 142 350, 145 362, 135 362 C 128 362, 125 350, 130 350 Z"
  },

  // Right Hand Pinky Keys
  {
    id: "pinky_eb",
    name: "Low E♭ Key (RH Pinky)",
    label: "E♭",
    group: "pinky_r",
    tooltip: "Low Eb Key - Right Pinky upper key",
    d: "M 125 380 C 140 380, 140 395, 125 395 Z"
  },
  {
    id: "pinky_c",
    name: "Low C Key (RH Pinky)",
    label: "C",
    group: "pinky_r",
    tooltip: "Low C Key - Right Pinky lower key",
    d: "M 125 405 C 140 405, 140 420, 125 420 Z"
  },

  // High F# Key
  {
    id: "high_f_sharp",
    name: "High F♯ Key",
    label: "F♯",
    group: "side",
    tooltip: "High F# side key (RH Ring knuckle)",
    d: "M 125 435 C 135 435, 138 447, 125 447 Z"
  }
];

// Reedy saxophone-like synthesizer using Web Audio API
class SaxSynthesizer {
  private ctx: AudioContext | null = null;
  private osc: OscillatorNode | null = null;
  private subOsc: OscillatorNode | null = null;
  private filter: BiquadFilterNode | null = null;
  private gain: GainNode | null = null;
  private lfo: OscillatorNode | null = null;
  private lfoGain: GainNode | null = null;

  private init() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioContextClass();
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  public play(frequency: number, transpositionOffset: number, volume: number = 0.25, duration: number = 1.2) {
    this.init();
    if (!this.ctx) return;

    this.stop();

    // Adjust frequency according to dynamic transposition offset
    const playFrequency = frequency * Math.pow(2, transpositionOffset / 12);

    const now = this.ctx.currentTime;

    this.osc = this.ctx.createOscillator();
    this.subOsc = this.ctx.createOscillator();
    this.filter = this.ctx.createBiquadFilter();
    this.gain = this.ctx.createGain();
    this.lfo = this.ctx.createOscillator();
    this.lfoGain = this.ctx.createGain();

    // Saxophone waveshape configuration:
    // A sawtooth wave with a bandpass or lowpass filter mimics the conical reed bore perfectly!
    this.osc.type = "sawtooth";
    this.osc.frequency.setValueAtTime(playFrequency, now);

    // Warm sub-harmonics for richer low end
    this.subOsc.type = "triangle";
    this.subOsc.frequency.setValueAtTime(playFrequency * 0.5, now);

    // Filter to sweep or stay lowpass to remove harsh digital edges
    this.filter.type = "lowpass";
    this.filter.frequency.setValueAtTime(playFrequency * 2.2, now);
    this.filter.Q.setValueAtTime(2.0, now);

    // Volume envelope
    this.gain.gain.setValueAtTime(0, now);
    this.gain.gain.linearRampToValueAtTime(volume, now + 0.08); // Attack
    this.gain.gain.setValueAtTime(volume, now + duration - 0.25); // Sustain
    this.gain.gain.exponentialRampToValueAtTime(0.001, now + duration); // Decay/Release

    // Natural classical saxophone vibrato: ~5.6 Hz
    this.lfo.frequency.setValueAtTime(5.6, now);
    this.lfoGain.gain.setValueAtTime(3.5, now); // Vibrato depth in Hz

    this.lfo.connect(this.lfoGain);
    this.lfoGain.connect(this.osc.frequency);
    this.lfoGain.connect(this.subOsc.frequency);

    // Connect nodes
    this.osc.connect(this.filter);
    // Sub oscillator is softer
    const subGain = this.ctx.createGain();
    subGain.gain.setValueAtTime(0.12, now);
    this.subOsc.connect(subGain);
    subGain.connect(this.filter);

    this.filter.connect(this.gain);
    this.gain.connect(this.ctx.destination);

    // Start
    this.osc.start(now);
    this.subOsc.start(now);
    this.lfo.start(now);

    // Scheduled Stop
    this.osc.stop(now + duration);
    this.subOsc.stop(now + duration);
    this.lfo.stop(now + duration);
  }

  public stop() {
    try {
      if (this.osc) {
        this.osc.stop();
        this.osc.disconnect();
        this.osc = null;
      }
      if (this.subOsc) {
        this.subOsc.stop();
        this.subOsc.disconnect();
        this.subOsc = null;
      }
      if (this.lfo) {
        this.lfo.stop();
        this.lfo.disconnect();
        this.lfo = null;
      }
    } catch (e) {
      // Ignore
    }
  }
}

const synth = new SaxSynthesizer();

// Preloaded melody presets for the composer
const MELODY_PRESETS = {
  scale: [
    { noteId: "C4", durationType: "1/4" },
    { noteId: "D4", durationType: "1/4" },
    { noteId: "E4", durationType: "1/4" },
    { noteId: "F4", durationType: "1/4" },
    { noteId: "G4", durationType: "1/4" },
    { noteId: "A4", durationType: "1/4" },
    { noteId: "B4", durationType: "1/4" },
    { noteId: "C5", durationType: "1/2" }
  ],
  mary: [
    { noteId: "E4", durationType: "1/4" },
    { noteId: "D4", durationType: "1/4" },
    { noteId: "C4", durationType: "1/4" },
    { noteId: "D4", durationType: "1/4" },
    { noteId: "E4", durationType: "1/4" },
    { noteId: "E4", durationType: "1/4" },
    { noteId: "E4", durationType: "1/2" },
    { noteId: "D4", durationType: "1/4" },
    { noteId: "D4", durationType: "1/4" },
    { noteId: "D4", durationType: "1/2" },
    { noteId: "E4", durationType: "1/4" },
    { noteId: "G4", durationType: "1/4" },
    { noteId: "G4", durationType: "1/2" }
  ],
  joy: [
    { noteId: "E4", durationType: "1/4" },
    { noteId: "E4", durationType: "1/4" },
    { noteId: "F4", durationType: "1/4" },
    { noteId: "G4", durationType: "1/4" },
    { noteId: "G4", durationType: "1/4" },
    { noteId: "F4", durationType: "1/4" },
    { noteId: "E4", durationType: "1/4" },
    { noteId: "D4", durationType: "1/4" },
    { noteId: "C4", durationType: "1/4" },
    { noteId: "C4", durationType: "1/4" },
    { noteId: "D4", durationType: "1/4" },
    { noteId: "E4", durationType: "1/4" },
    { noteId: "E4", durationType: "1/4" },
    { noteId: "D4", durationType: "1/8" },
    { noteId: "D4", durationType: "1/2" }
  ],
  arpeggio: [
    { noteId: "C4", durationType: "1/4" },
    { noteId: "E4", durationType: "1/4" },
    { noteId: "G4", durationType: "1/4" },
    { noteId: "C5", durationType: "1/4" },
    { noteId: "E5", durationType: "1/4" },
    { noteId: "G5", durationType: "1/4" },
    { noteId: "C6", durationType: "1/2" },
    { noteId: "G5", durationType: "1/4" },
    { noteId: "E5", durationType: "1/4" },
    { noteId: "C5", durationType: "1/4" },
    { noteId: "G4", durationType: "1/4" },
    { noteId: "E4", durationType: "1/4" },
    { noteId: "C4", durationType: "1/2" }
  ],
  baker: [
    // Phrase 1
    { noteId: "D5", durationType: "1/8" },
    { noteId: "D6", durationType: "1/2" },
    { noteId: "C#6", durationType: "1/8" },
    { noteId: "B5", durationType: "1/8" },
    { noteId: "A5", durationType: "1/8" },
    { noteId: "B5", durationType: "1/8" },
    { noteId: "C#6", durationType: "1/8" },
    { noteId: "B5", durationType: "1/2" },

    // Phrase 2
    { noteId: "D5", durationType: "1/8" },
    { noteId: "D6", durationType: "1/2" },
    { noteId: "C#6", durationType: "1/8" },
    { noteId: "B5", durationType: "1/8" },
    { noteId: "A5", durationType: "1/8" },
    { noteId: "F#5", durationType: "1/4" },
    { noteId: "D6", durationType: "1/8" },
    { noteId: "C#6", durationType: "1/8" },
    { noteId: "B5", durationType: "1/8" },
    { noteId: "A5", durationType: "1/8" },
    { noteId: "F#5", durationType: "1/1" },

    // Phrase 3
    { noteId: "F#5", durationType: "1/8" },
    { noteId: "D6", durationType: "1/2" },
    { noteId: "C#6", durationType: "1/8" },
    { noteId: "B5", durationType: "1/8" },
    { noteId: "A5", durationType: "1/8" },
    { noteId: "A5", durationType: "1/4" },
    { noteId: "A5", durationType: "1/4" },
    { noteId: "A5", durationType: "1/8" },
    { noteId: "A5", durationType: "1/8" },
    { noteId: "F#5", durationType: "1/2" },

    // Phrase 4
    { noteId: "F#5", durationType: "1/8" },
    { noteId: "D6", durationType: "1/2" },
    { noteId: "C#6", durationType: "1/8" },
    { noteId: "B5", durationType: "1/8" },
    { noteId: "A5", durationType: "1/8" },
    { noteId: "B5", durationType: "1/8" },
    { noteId: "C#6", durationType: "1/8" },
    { noteId: "B5", durationType: "1/8" },
    { noteId: "C#6", durationType: "1/8" },
    { noteId: "B5", durationType: "1/8" },
    { noteId: "E6", durationType: "1/4" },
    { noteId: "F#6", durationType: "1/4" },
    { noteId: "E6", durationType: "1/8" },
    { noteId: "D6", durationType: "1/8" },
    { noteId: "B5", durationType: "1/1" }
  ],
  careless: [
    { noteId: "C#5", durationType: "1/2" },
    { noteId: "B4", durationType: "1/8" },
    { noteId: "A4", durationType: "1/8" },
    { noteId: "G4", durationType: "1/8" },
    { noteId: "F#4", durationType: "1/2" },
    { noteId: "E4", durationType: "1/8" },
    { noteId: "F#4", durationType: "1/8" },
    { noteId: "G4", durationType: "1/8" },
    { noteId: "A4", durationType: "1/2" },
    { noteId: "G4", durationType: "1/8" },
    { noteId: "F#4", durationType: "1/8" },
    { noteId: "E4", durationType: "1/8" },
    { noteId: "D4", durationType: "1/2" },
    { noteId: "C#4", durationType: "1/8" },
    { noteId: "D4", durationType: "1/8" },
    { noteId: "E4", durationType: "1/8" },
    { noteId: "F#4", durationType: "1/4" },
    { noteId: "E4", durationType: "1/2" }
  ]
};

const MELODY_PRESETS_METADATA = {
  scale: { keySignature: 0, instrumentKey: 'Eb-alto' as const },
  mary: { keySignature: 0, instrumentKey: 'Eb-alto' as const },
  joy: { keySignature: 1, instrumentKey: 'Eb-alto' as const },
  arpeggio: { keySignature: 0, instrumentKey: 'Eb-alto' as const },
  baker: { keySignature: 2, instrumentKey: 'Eb-alto' as const }, // D Major
  careless: { keySignature: 5, instrumentKey: 'Eb-alto' as const } // D Minor / F Major
};

export type NoteDurationType = '1/1' | '1/2' | '1/4' | '1/8' | '1/16' | '1/1.' | '1/2.' | '1/4.' | '1/8.' | '1/16.';

const getBeatLength = (type: NoteDurationType) => {
  switch(type) {
    case '1/1': return 4;
    case '1/2': return 2;
    case '1/4': return 1;
    case '1/8': return 0.5;
    case '1/16': return 0.25;
    case '1/1.': return 6;
    case '1/2.': return 3;
    case '1/4.': return 1.5;
    case '1/8.': return 0.75;
    case '1/16.': return 0.375;
    default: return 1;
  }
};

interface KeySignatureConfig {
  name: string;
  type: 'sharp' | 'flat' | 'none';
  count: number;
  alteredNotes: { [noteLetter: string]: '♯' | '♭' | '♮' };
}

const KEY_SIGNATURES: KeySignatureConfig[] = [
  { name: "C Major / A Minor", type: "none", count: 0, alteredNotes: {} },
  { name: "G Major / E Minor", type: "sharp", count: 1, alteredNotes: { 'F': '♯' } },
  { name: "D Major / B Minor", type: "sharp", count: 2, alteredNotes: { 'F': '♯', 'C': '♯' } },
  { name: "A Major / F♯ Minor", type: "sharp", count: 3, alteredNotes: { 'F': '♯', 'C': '♯', 'G': '♯' } },
  { name: "E Major / C♯ Minor", type: "sharp", count: 4, alteredNotes: { 'F': '♯', 'C': '♯', 'G': '♯', 'D': '♯' } },
  { name: "F Major / D Minor", type: "flat", count: 1, alteredNotes: { 'B': '♭' } },
  { name: "B♭ Major / G Minor", type: "flat", count: 2, alteredNotes: { 'B': '♭', 'E': '♭' } },
  { name: "E♭ Major / C Minor", type: "flat", count: 3, alteredNotes: { 'B': '♭', 'E': '♭', 'A': '♭' } },
  { name: "A♭ Major / F Minor", type: "flat", count: 4, alteredNotes: { 'B': '♭', 'E': '♭', 'A': '♭', 'D': '♭' } },
];

function getNoteDisplayAccidental(noteId: string, keySig: KeySignatureConfig): 'flat' | 'sharp' | 'natural' | 'none' {
  const letter = noteId.charAt(0).toUpperCase();
  const isSharp = noteId.includes('#');
  const isFlat = noteId.includes('b') && noteId.length > 2;
  
  const keyAlteration = keySig.alteredNotes[letter];
  
  if (keyAlteration === '♯') {
    if (isSharp) return 'none';
    if (isFlat) return 'flat';
    return 'natural';
  } else if (keyAlteration === '♭') {
    if (isFlat) return 'none';
    if (isSharp) return 'sharp';
    return 'natural';
  } else {
    if (isSharp) return 'sharp';
    if (isFlat) return 'flat';
    return 'none';
  }
}

function getDynamicConcertPitch(note: NoteInfo, instrument: string): string {
  const transpositions = {
    'Eb-alto': -9,
    'Bb-tenor': -14,
    'Bb-soprano': -2,
    'Eb-baritone': -21,
    'C': 0
  };
  const offset = transpositions[instrument as keyof typeof transpositions] || 0;
  const concertSemitones = note.semitonesFromC4 + offset;
  
  const SEMITONE_TO_NOTE_NAMES = [
    "C", "D♭", "D", "E♭", "E", "F", "F♯", "G", "A♭", "A", "B♭", "B"
  ];
  const noteIndex = ((concertSemitones % 12) + 12) % 12;
  const octave = 4 + Math.floor(concertSemitones / 12);
  const name = SEMITONE_TO_NOTE_NAMES[noteIndex];
  
  return `${name}${octave}`;
}

function findClosestNoteBySemitones(semitones: number): NoteInfo {
  let closest = notesList[0];
  let minDiff = Math.abs(closest.semitonesFromC4 - semitones);
  for (let i = 1; i < notesList.length; i++) {
    const diff = Math.abs(notesList[i].semitonesFromC4 - semitones);
    if (diff < minDiff) {
      minDiff = diff;
      closest = notesList[i];
    }
  }
  return closest;
}

export default function App() {
  // App states
  const [currentNoteIndex, setCurrentNoteIndex] = useState<number>(13); // Default to B4 (index 13)
  const [selectedFingeringIndex, setSelectedFingeringIndex] = useState<number>(0);
  const [isConcertPitch, setIsConcertPitch] = useState<boolean>(false);
  const [instrumentKey, setInstrumentKey] = useState<'Eb-alto' | 'Bb-tenor' | 'Bb-soprano' | 'Eb-baritone' | 'C'>('Eb-alto');
  const [selectedKeySignature, setSelectedKeySignature] = useState<number>(0);
  const [targetTransposeKey, setTargetTransposeKey] = useState<number>(0);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [appMode, setAppMode] = useState<'learn' | 'quiz' | 'sandbox'>('learn');

  // Sandbox State: Key toggles when user presses keys manually
  const [sandboxKeys, setSandboxKeys] = useState<string[]>([]);
  const [sandboxMatch, setSandboxMatch] = useState<NoteInfo | null>(null);
  const [sandboxFingeringName, setSandboxFingeringName] = useState<string>("");

  // Quiz State
  const [quizType, setQuizType] = useState<'sight-reading' | 'fingering'>('sight-reading');
  const [quizNote, setQuizNote] = useState<NoteInfo>(notesList[13]);
  const [quizFingering, setQuizFingering] = useState<Fingering>(notesList[13].fingerings[0]);
  const [userQuizKeys, setUserQuizKeys] = useState<string[]>([]);
  const [quizOptions, setQuizOptions] = useState<NoteInfo[]>([]);
  const [quizAnswerChecked, setQuizAnswerChecked] = useState<boolean>(false);
  const [quizIsCorrect, setQuizIsCorrect] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(0);
  const [totalQuestions, setTotalQuestions] = useState<number>(0);
  const [quizFeedback, setQuizFeedback] = useState<string>("");

  // UI state
  const [hoveredKey, setHoveredKey] = useState<SaxKeyConfig | null>(null);
  const [hoveredStaffNote, setHoveredStaffNote] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Melody Composer state
  const [isCompositionMode, setIsCompositionMode] = useState<boolean>(false);
  const [compositionNotes, setCompositionNotes] = useState<{ id: string; noteId: string; durationType: NoteDurationType; tie?: boolean }[]>([
    { id: "p1", noteId: "E4", durationType: "1/4", tie: false },
    { id: "p2", noteId: "D4", durationType: "1/4", tie: false },
    { id: "p3", noteId: "C4", durationType: "1/4", tie: false },
    { id: "p4", noteId: "D4", durationType: "1/4", tie: false },
    { id: "p5", noteId: "E4", durationType: "1/4", tie: false },
    { id: "p6", noteId: "E4", durationType: "1/4", tie: false },
    { id: "p7", noteId: "E4", durationType: "1/2", tie: false }
  ]);
  const [selectedCompositionIndex, setSelectedCompositionIndex] = useState<number | null>(null);
  const [currentDurationType, setCurrentDurationType] = useState<NoteDurationType>('1/4');
  const [tempo, setTempo] = useState<number>(110); // BPM
  const [timeSignature, setTimeSignature] = useState<'4/4' | '3/4' | '2/4' | '6/8'>('4/4');
  const [isMelodyPlaying, setIsMelodyPlaying] = useState<boolean>(false);
  const [activeMelodyIndex, setActiveMelodyIndex] = useState<number>(-1);
  const [isLooping, setIsLooping] = useState<boolean>(false);
  const [hoveredCompositionColumn, setHoveredCompositionColumn] = useState<number | null>(null);

  // Local storage persisted saved melodies
  const [savedMelodies, setSavedMelodies] = useState<{ 
    id: string; 
    name: string; 
    notes: { noteId: string; durationType: NoteDurationType; tie?: boolean }[]; 
    tempo: number;
    keySignature?: number;
    instrumentKey?: 'Eb-alto' | 'Bb-tenor' | 'Bb-soprano' | 'Eb-baritone' | 'C';
    timeSignature?: '4/4' | '3/4' | '2/4' | '6/8';
  }[]>(() => {
    try {
      const saved = localStorage.getItem("sax_fingering_saved_melodies");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to load saved melodies from localStorage:", e);
      return [];
    }
  });
  const [newMelodyName, setNewMelodyName] = useState<string>("");
  const [isSavingMelody, setIsSavingMelody] = useState<boolean>(false);

  useEffect(() => {
    try {
      localStorage.setItem("sax_fingering_saved_melodies", JSON.stringify(savedMelodies));
    } catch (e) {
      console.error("Failed to save melodies to localStorage:", e);
    }
  }, [savedMelodies]);

  const staffContainerRef = useRef<HTMLDivElement>(null);

  const currentNote = notesList[currentNoteIndex];
  const activeFingering = currentNote.fingerings[selectedFingeringIndex] || currentNote.fingerings[0];
  const staffWidth = isCompositionMode ? Math.max(600, 140 + (compositionNotes.length + 1) * 55 + 40) : 600;

  // Sync sandbox match
  useEffect(() => {
    if (appMode === "sandbox") {
      // Find matching standard note/fingering
      let matchedNote: NoteInfo | null = null;
      let matchedFingeringName = "";

      for (const note of notesList) {
        for (const f of note.fingerings) {
          // Check if arrays have exactly same elements
          const keysSorted = [...f.keys].sort();
          const sandboxSorted = [...sandboxKeys].sort();
          if (
            keysSorted.length === sandboxSorted.length &&
            keysSorted.every((val, index) => val === sandboxSorted[index])
          ) {
            matchedNote = note;
            matchedFingeringName = f.name;
            break;
          }
        }
        if (matchedNote) break;
      }

      setSandboxMatch(matchedNote);
      setSandboxFingeringName(matchedFingeringName);
    }
  }, [sandboxKeys, appMode]);

  const getTranspositionOffset = () => {
    if (!isConcertPitch) return 0;
    const transpositions = {
      'Eb-alto': -9,
      'Bb-tenor': -14,
      'Bb-soprano': -2,
      'Eb-baritone': -21,
      'C': 0
    };
    return transpositions[instrumentKey] || 0;
  };

  // Handle Note play
  const handlePlayNote = (note: NoteInfo) => {
    setIsPlaying(true);
    synth.play(note.frequency, getTranspositionOffset());
    setTimeout(() => {
      setIsPlaying(false);
    }, 1200);
  };

  const handleStopNote = () => {
    synth.stop();
    setIsPlaying(false);
    setIsMelodyPlaying(false);
    setActiveMelodyIndex(-1);
  };

  // Change note index safely
  const changeNoteIndex = (newIndex: number) => {
    if (newIndex >= 0 && newIndex < notesList.length) {
      setCurrentNoteIndex(newIndex);
      setSelectedFingeringIndex(0);
      
      // If in composition mode and a note is selected, update that note's pitch!
      if (isCompositionMode && selectedCompositionIndex !== null) {
        setCompositionNotes(prev => {
          const updated = [...prev];
          if (updated[selectedCompositionIndex]) {
            updated[selectedCompositionIndex] = {
              ...updated[selectedCompositionIndex],
              noteId: notesList[newIndex].id
            };
          }
          return updated;
        });
      } else {
        handleStopNote();
      }
    }
  };

  // Sequenced Melody Playback Engine
  useEffect(() => {
    if (!isMelodyPlaying) {
      setActiveMelodyIndex(-1);
      return;
    }

    if (activeMelodyIndex < 0 || activeMelodyIndex >= compositionNotes.length) {
      if (isLooping && compositionNotes.length > 0) {
        setActiveMelodyIndex(0);
      } else {
        setIsMelodyPlaying(false);
        setActiveMelodyIndex(-1);
      }
      return;
    }

    const currentMelodyNote = compositionNotes[activeMelodyIndex];
    const isRest = currentMelodyNote.noteId === "REST";
    const beatCount = getBeatLength(currentMelodyNote.durationType);
    const durationInSeconds = beatCount * (60 / tempo);

    if (isRest) {
      synth.stop();
      setIsPlaying(false);
    } else {
      const noteInfo = notesList.find(n => n.id === currentMelodyNote.noteId);
      if (noteInfo) {
        // Update active note index in main list to sync saxophone visual fingerings
        const idxInList = notesList.findIndex(n => n.id === noteInfo.id);
        if (idxInList !== -1) {
          setCurrentNoteIndex(idxInList);
          setSelectedFingeringIndex(0);
        }

        // Check if this is a continuation of a tie from the previous note
        const isContinuationOfTie = 
          activeMelodyIndex > 0 &&
          compositionNotes[activeMelodyIndex - 1].tie &&
          compositionNotes[activeMelodyIndex - 1].noteId === currentMelodyNote.noteId;

        if (!isContinuationOfTie) {
          // Calculate cumulative tie duration if this is the start of a tie chain
          let totalDuration = durationInSeconds;
          let checkIdx = activeMelodyIndex;
          while (
            checkIdx < compositionNotes.length - 1 &&
            compositionNotes[checkIdx].tie &&
            compositionNotes[checkIdx].noteId === compositionNotes[checkIdx + 1].noteId
          ) {
            const nextNote = compositionNotes[checkIdx + 1];
            const nextBeatCount = getBeatLength(nextNote.durationType);
            const nextDuration = nextBeatCount * (60 / tempo);
            totalDuration += nextDuration;
            checkIdx++;
          }

          synth.play(noteInfo.frequency, getTranspositionOffset(), 0.22, totalDuration);
          setIsPlaying(true);
        } else {
          setIsPlaying(true);
        }
      }
    }

    const timer = setTimeout(() => {
      setActiveMelodyIndex(prev => prev + 1);
    }, durationInSeconds * 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [isMelodyPlaying, activeMelodyIndex, compositionNotes, tempo, isConcertPitch, instrumentKey, isLooping]);

  // Scroll sequencer to keep playhead or selected note in view
  useEffect(() => {
    const container = staffContainerRef.current;
    if (!container) return;

    if (isMelodyPlaying && activeMelodyIndex !== -1) {
      const playheadX = 140 + activeMelodyIndex * 55;
      const containerWidth = container.clientWidth;
      const targetScrollLeft = playheadX - containerWidth / 2;
      container.scrollTo({
        left: Math.max(0, targetScrollLeft),
        behavior: 'smooth'
      });
    } else if (!isMelodyPlaying && selectedCompositionIndex !== null) {
      const selectedX = 140 + selectedCompositionIndex * 55;
      const containerWidth = container.clientWidth;
      const targetScrollLeft = selectedX - containerWidth / 2;
      container.scrollTo({
        left: Math.max(0, targetScrollLeft),
        behavior: 'smooth'
      });
    }
  }, [activeMelodyIndex, isMelodyPlaying, selectedCompositionIndex]);

  // Global keyboard shortcuts (Spacebar for Play/Stop)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is focused on input/search fields
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }

      if (e.code === "Space") {
        e.preventDefault(); // Stop default page scrolling

        if (isCompositionMode) {
          setIsMelodyPlaying(prev => {
            if (!prev) {
              setActiveMelodyIndex(0);
              return true;
            } else {
              synth.stop();
              setIsPlaying(false);
              setActiveMelodyIndex(-1);
              return false;
            }
          });
        } else {
          setIsPlaying(prev => {
            if (!prev) {
              handlePlayNote(notesList[currentNoteIndex]);
              return true;
            } else {
              handleStopNote();
              return false;
            }
          });
        }
      } else if (e.code === "ArrowLeft") {
        if (isCompositionMode && selectedCompositionIndex !== null) {
          e.preventDefault();
          if (selectedCompositionIndex > 0) {
            handleSelectCompositionIndex(selectedCompositionIndex - 1);
          }
        } else if (!isCompositionMode) {
          e.preventDefault();
          if (currentNoteIndex > 0) {
            changeNoteIndex(currentNoteIndex - 1);
          }
        }
      } else if (e.code === "ArrowRight") {
        if (isCompositionMode && selectedCompositionIndex !== null) {
          e.preventDefault();
          if (selectedCompositionIndex < compositionNotes.length - 1) {
            handleSelectCompositionIndex(selectedCompositionIndex + 1);
          }
        } else if (!isCompositionMode) {
          e.preventDefault();
          if (currentNoteIndex < notesList.length - 1) {
            changeNoteIndex(currentNoteIndex + 1);
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isCompositionMode, selectedCompositionIndex, currentNoteIndex, compositionNotes, isConcertPitch]);

  // Composition Mode Helpers
  const handleSelectCompositionIndex = (index: number | null) => {
    setSelectedCompositionIndex(index);
    if (index !== null && compositionNotes[index]) {
      const noteId = compositionNotes[index].noteId;
      if (noteId === "REST") {
        synth.stop();
        setIsPlaying(false);
      } else {
        const noteIdx = notesList.findIndex(n => n.id === noteId);
        if (noteIdx !== -1) {
          setCurrentNoteIndex(noteIdx);
          setSelectedFingeringIndex(0);
          
          // Play the selected note once
          if (!isMelodyPlaying) {
            const noteInfo = notesList[noteIdx];
            const beatCount = getBeatLength(compositionNotes[index].durationType);
            const durationInSeconds = beatCount * (60 / tempo);
            synth.play(noteInfo.frequency, getTranspositionOffset(), 0.22, durationInSeconds);
            setIsPlaying(true);
            setTimeout(() => {
              setIsPlaying(false);
            }, durationInSeconds * 1000);
          }
        }
      }
      setCurrentDurationType(compositionNotes[index].durationType);
    }
  };

  const handleMoveNoteSemitone = (direction: 'up' | 'down') => {
    if (selectedCompositionIndex === null) return;
    const currentMelodyNote = compositionNotes[selectedCompositionIndex];
    if (currentMelodyNote.noteId === "REST") return;

    const noteIdx = notesList.findIndex(n => n.id === currentMelodyNote.noteId);
    if (noteIdx === -1) return;

    let nextNoteIdx = noteIdx;
    if (direction === 'up') {
      nextNoteIdx = Math.min(notesList.length - 1, noteIdx + 1);
    } else {
      nextNoteIdx = Math.max(0, noteIdx - 1);
    }

    if (nextNoteIdx !== noteIdx) {
      const newNoteInfo = notesList[nextNoteIdx];
      setCompositionNotes(prev => {
        const updated = [...prev];
        updated[selectedCompositionIndex] = {
          ...updated[selectedCompositionIndex],
          noteId: newNoteInfo.id
        };
        return updated;
      });

      // Synchronize current state to show fingering for the new note
      setCurrentNoteIndex(nextNoteIdx);
      setSelectedFingeringIndex(0);

      // Play the newly shifted note once
      const beatCount = getBeatLength(currentMelodyNote.durationType);
      const durationInSeconds = beatCount * (60 / tempo);
      synth.play(newNoteInfo.frequency, getTranspositionOffset(), 0.22, durationInSeconds);
      setIsPlaying(true);
      setTimeout(() => {
        setIsPlaying(false);
      }, durationInSeconds * 1000);
    }
  };

  const handleTransposeMelodyInterval = (semitones: number) => {
    if (compositionNotes.length === 0) return;

    const updatedNotes = compositionNotes.map(item => {
      if (item.noteId === "REST") return item;

      const noteInfo = notesList.find(n => n.id === item.noteId);
      if (!noteInfo) return item;

      const currentSemitones = noteInfo.semitonesFromC4;
      const targetSemitones = currentSemitones + semitones;
      const closestNote = findClosestNoteBySemitones(targetSemitones);

      return {
        ...item,
        noteId: closestNote.id
      };
    });

    setCompositionNotes(updatedNotes);

    if (selectedCompositionIndex !== null && updatedNotes[selectedCompositionIndex]) {
      const activeNoteId = updatedNotes[selectedCompositionIndex].noteId;
      if (activeNoteId !== "REST") {
        const idx = notesList.findIndex(n => n.id === activeNoteId);
        if (idx !== -1) {
          setCurrentNoteIndex(idx);
          setSelectedFingeringIndex(0);
        }
      }
    }

    setSuccessMessage(`Transposed entire melody by ${semitones > 0 ? '+' : ''}${semitones} semitone${Math.abs(semitones) !== 1 ? 's' : ''}!`);
    setTimeout(() => setSuccessMessage(""), 4000);
  };

  const handleTransposeMelodyToKeySignature = (targetKeyIndex: number) => {
    if (targetKeyIndex < 0 || targetKeyIndex >= KEY_SIGNATURES.length) return;
    if (compositionNotes.length === 0) {
      setSelectedKeySignature(targetKeyIndex);
      setSuccessMessage(`Changed key signature to ${KEY_SIGNATURES[targetKeyIndex].name}`);
      setTimeout(() => setSuccessMessage(""), 3000);
      return;
    }

    const KEY_SIGNATURE_ROOTS = [0, 7, 2, 9, 4, 5, 10, 3, 8];
    const rootA = KEY_SIGNATURE_ROOTS[selectedKeySignature];
    const rootB = KEY_SIGNATURE_ROOTS[targetKeyIndex];

    let shift = rootB - rootA;
    while (shift > 6) shift -= 12;
    while (shift < -6) shift += 12;

    const updatedNotes = compositionNotes.map(item => {
      if (item.noteId === "REST") return item;

      const noteInfo = notesList.find(n => n.id === item.noteId);
      if (!noteInfo) return item;

      const currentSemitones = noteInfo.semitonesFromC4;
      const targetSemitones = currentSemitones + shift;
      const closestNote = findClosestNoteBySemitones(targetSemitones);

      return {
        ...item,
        noteId: closestNote.id
      };
    });

    setCompositionNotes(updatedNotes);
    setSelectedKeySignature(targetKeyIndex);

    if (selectedCompositionIndex !== null && updatedNotes[selectedCompositionIndex]) {
      const activeNoteId = updatedNotes[selectedCompositionIndex].noteId;
      if (activeNoteId !== "REST") {
        const idx = notesList.findIndex(n => n.id === activeNoteId);
        if (idx !== -1) {
          setCurrentNoteIndex(idx);
          setSelectedFingeringIndex(0);
        }
      }
    }

    if (shift === 0) {
      setSuccessMessage(`Updated key signature to ${KEY_SIGNATURES[targetKeyIndex].name}. Notes stayed in place.`);
    } else {
      setSuccessMessage(`Transposed melody to ${KEY_SIGNATURES[targetKeyIndex].name} (shifted all notes by ${shift > 0 ? '+' : ''}${shift} semitones).`);
    }
    setTimeout(() => setSuccessMessage(""), 4000);
  };

  const handleDurationChange = (type: NoteDurationType) => {
    setCurrentDurationType(type);
    if (selectedCompositionIndex !== null && compositionNotes[selectedCompositionIndex]) {
      setCompositionNotes(prev => {
        const updated = [...prev];
        updated[selectedCompositionIndex] = {
          ...updated[selectedCompositionIndex],
          durationType: type
        };
        return updated;
      });
    }
  };

  const handleAddNoteToMelody = () => {
    const newNote = {
      id: "note_" + Date.now() + "_" + Math.random().toString(36).substr(2, 4),
      noteId: currentNote.id,
      durationType: currentDurationType,
      tie: false
    };
    setCompositionNotes(prev => [...prev, newNote]);
    setSelectedCompositionIndex(compositionNotes.length);
  };

  const handleAddRestToMelody = () => {
    const newNote = {
      id: "note_" + Date.now() + "_" + Math.random().toString(36).substr(2, 4),
      noteId: "REST",
      durationType: currentDurationType,
      tie: false
    };
    setCompositionNotes(prev => [...prev, newNote]);
    setSelectedCompositionIndex(compositionNotes.length);
  };

  const handleInsertNoteToMelody = () => {
    if (selectedCompositionIndex === null) {
      handleAddNoteToMelody();
      return;
    }
    const newNote = {
      id: "note_" + Date.now() + "_" + Math.random().toString(36).substr(2, 4),
      noteId: currentNote.id,
      durationType: currentDurationType,
      tie: false
    };
    const insertIdx = selectedCompositionIndex;
    setCompositionNotes(prev => {
      const updated = [...prev];
      updated.splice(insertIdx, 0, newNote);
      return updated;
    });
    setSelectedCompositionIndex(insertIdx);
  };

  const handleInsertRestToMelody = () => {
    if (selectedCompositionIndex === null) {
      handleAddRestToMelody();
      return;
    }
    const newNote = {
      id: "note_" + Date.now() + "_" + Math.random().toString(36).substr(2, 4),
      noteId: "REST",
      durationType: currentDurationType,
      tie: false
    };
    const insertIdx = selectedCompositionIndex;
    setCompositionNotes(prev => {
      const updated = [...prev];
      updated.splice(insertIdx, 0, newNote);
      return updated;
    });
    setSelectedCompositionIndex(insertIdx);
  };

  const handleToggleRest = () => {
    if (selectedCompositionIndex === null) return;
    setCompositionNotes(prev => {
      const updated = [...prev];
      if (updated[selectedCompositionIndex]) {
        updated[selectedCompositionIndex] = {
          ...updated[selectedCompositionIndex],
          noteId: updated[selectedCompositionIndex].noteId === "REST" ? currentNote.id : "REST"
        };
      }
      return updated;
    });
  };

  const handleToggleTie = () => {
    if (selectedCompositionIndex === null) return;
    setCompositionNotes(prev => {
      const updated = [...prev];
      if (updated[selectedCompositionIndex]) {
        updated[selectedCompositionIndex] = {
          ...updated[selectedCompositionIndex],
          tie: !updated[selectedCompositionIndex].tie
        };
      }
      return updated;
    });
  };

  const handleDeleteNoteFromMelody = (idxToDelete: number) => {
    if (idxToDelete < 0 || idxToDelete >= compositionNotes.length) return;
    handleStopNote();
    const updated = compositionNotes.filter((_, idx) => idx !== idxToDelete);
    setCompositionNotes(updated);
    
    if (updated.length === 0) {
      setSelectedCompositionIndex(null);
    } else if (selectedCompositionIndex !== null) {
      if (selectedCompositionIndex >= updated.length) {
        setSelectedCompositionIndex(updated.length - 1);
      }
    }
  };

  const handleMoveNote = (index: number, direction: 'left' | 'right') => {
    if (direction === 'left' && index > 0) {
      setCompositionNotes(prev => {
        const updated = [...prev];
        const temp = updated[index];
        updated[index] = updated[index - 1];
        updated[index - 1] = temp;
        return updated;
      });
      setSelectedCompositionIndex(index - 1);
    } else if (direction === 'right' && index < compositionNotes.length - 1) {
      setCompositionNotes(prev => {
        const updated = [...prev];
        const temp = updated[index];
        updated[index] = updated[index + 1];
        updated[index + 1] = temp;
        return updated;
      });
      setSelectedCompositionIndex(index + 1);
    }
  };

  const loadPreset = (presetKey: keyof typeof MELODY_PRESETS) => {
    handleStopNote();
    const presetData = MELODY_PRESETS[presetKey].map((p, idx) => ({
      id: `p_${idx}_${Date.now()}`,
      noteId: p.noteId,
      durationType: p.durationType as NoteDurationType,
      tie: (p as any).tie || false
    }));
    setCompositionNotes(presetData);
    
    // Load preset metadata
    const metadata = MELODY_PRESETS_METADATA[presetKey];
    if (metadata) {
      setSelectedKeySignature(metadata.keySignature);
      setTargetTransposeKey(metadata.keySignature);
      setInstrumentKey(metadata.instrumentKey);
    }
    
    setTimeSignature('4/4');
    setSelectedCompositionIndex(null);
  };

  const loadSavedMelody = (melody: typeof savedMelodies[0]) => {
    handleStopNote();
    const loadedNotes = melody.notes.map((n, idx) => ({
      id: `u_${idx}_${Date.now()}`,
      noteId: n.noteId,
      durationType: n.durationType as NoteDurationType,
      tie: n.tie || false
    }));
    setCompositionNotes(loadedNotes);
    setTempo(melody.tempo || 110);
    if (melody.keySignature !== undefined) {
      setSelectedKeySignature(melody.keySignature);
      setTargetTransposeKey(melody.keySignature);
    }
    if (melody.instrumentKey !== undefined) {
      setInstrumentKey(melody.instrumentKey);
    }
    if (melody.timeSignature !== undefined) {
      setTimeSignature(melody.timeSignature);
    } else {
      setTimeSignature('4/4');
    }
    setSelectedCompositionIndex(null);
  };

  const handleSaveMelody = (name: string) => {
    if (!name.trim()) return;
    const melodyToSave = {
      id: `m_${Date.now()}`,
      name: name.trim(),
      notes: compositionNotes.map(n => ({
        noteId: n.noteId,
        durationType: n.durationType,
        tie: n.tie || false
      })),
      tempo: tempo,
      keySignature: selectedKeySignature,
      instrumentKey: instrumentKey,
      timeSignature: timeSignature
    };
    setSavedMelodies(prev => [...prev, melodyToSave]);
    setNewMelodyName("");
    setIsSavingMelody(false);
    setSuccessMessage(`Melody "${name.trim()}" saved successfully!`);
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const handleDeleteMelody = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedMelodies(prev => prev.filter(m => m.id !== id));
  };

  const handleMidiImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    handleStopNote();
    setSuccessMessage("");
    setErrorMessage("");

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const arrayBuffer = event.target?.result as ArrayBuffer;
        if (!arrayBuffer) {
          throw new Error("Could not read file data.");
        }

        const midi = new Midi(arrayBuffer);
        
        // Find a track that has notes
        const playableTrack = midi.tracks.find(track => track.notes.length > 0);
        if (!playableTrack) {
          throw new Error("No MIDI notes found in any tracks of this file.");
        }

        // We can get the tempo from the midi header or fallback to current tempo
        if (midi.header.tempos && midi.header.tempos.length > 0) {
          const fileTempo = Math.round(midi.header.tempos[0].bpm);
          if (fileTempo >= 40 && fileTempo <= 240) {
            setTempo(fileTempo);
          }
        }

        // Map notes in the track
        // Sort notes by start time so they play in sequential order
        const sortedNotes = [...playableTrack.notes].sort((a, b) => a.time - b.time);
        
        const mappedNotes = sortedNotes.map((note, idx) => {
          let mappedName = note.name;
          // Ensure enharmonics map perfectly to notesList IDs
          mappedName = mappedName.replace("Db", "C#");
          mappedName = mappedName.replace("Eb", "D#");
          mappedName = mappedName.replace("Gb", "F#");
          mappedName = mappedName.replace("Ab", "G#");
          mappedName = mappedName.replace("Bb", "A#");
          if (mappedName === "A#3") {
            mappedName = "Bb3";
          }

          let matchingNote = notesList.find(n => n.id === mappedName);
          if (!matchingNote) {
            // Clamping to standard sax range Bb3 (midi 58) to F#6 (midi 90)
            const clampedMidi = Math.max(58, Math.min(90, note.midi));
            const targetSemitones = clampedMidi - 60;
            matchingNote = notesList.reduce((prev, curr) => {
              return Math.abs(curr.semitonesFromC4 - targetSemitones) < Math.abs(prev.semitonesFromC4 - targetSemitones) ? curr : prev;
            });
          }

          const bpm = midi.header.tempos && midi.header.tempos.length > 0 ? midi.header.tempos[0].bpm : tempo;
          const beatCount = note.duration * (bpm / 60);

          let durationType: NoteDurationType = '1/4';
          if (beatCount >= 3) {
            durationType = '1/1';
          } else if (beatCount >= 1.5) {
            durationType = '1/2';
          } else if (beatCount >= 0.75) {
            durationType = '1/4';
          } else if (beatCount >= 0.375) {
            durationType = '1/8';
          } else {
            durationType = '1/16';
          }

          return {
            id: `midi_${idx}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
            noteId: matchingNote.id,
            durationType,
            tie: false
          };
        });

        if (mappedNotes.length === 0) {
          throw new Error("No valid notes could be imported.");
        }

        const finalNotes = mappedNotes.slice(0, 64);
        setCompositionNotes(finalNotes);
        setSelectedCompositionIndex(null);
        setSuccessMessage(`Successfully imported ${finalNotes.length} notes from MIDI!`);
        
        setTimeout(() => setSuccessMessage(""), 5000);
      } catch (err: any) {
        setErrorMessage(err?.message || "Failed to parse MIDI file. Make sure it's a valid standard MIDI.");
        setTimeout(() => setErrorMessage(""), 6000);
      }
    };

    reader.onerror = () => {
      setErrorMessage("Error reading the file.");
      setTimeout(() => setErrorMessage(""), 5000);
    };

    reader.readAsArrayBuffer(file);
    e.target.value = "";
  };

  const escapeXml = (unsafe: string) => {
    return unsafe.replace(/[<>&'"]/g, (c) => {
      switch (c) {
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '&': return '&amp;';
        case '\'': return '&apos;';
        case '"': return '&quot;';
        default: return c;
      }
    });
  };

  const exportMelodyToXML = () => {
    if (compositionNotes.length === 0) {
      setErrorMessage("No notes in current melody to export.");
      setTimeout(() => setErrorMessage(""), 3500);
      return;
    }

    const name = newMelodyName.trim() || "My Melody";
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<melody>\n`;
    xml += `  <name>${escapeXml(name)}</name>\n`;
    xml += `  <tempo>${tempo}</tempo>\n`;
    xml += `  <keySignature>${selectedKeySignature}</keySignature>\n`;
    xml += `  <instrumentKey>${instrumentKey}</instrumentKey>\n`;
    xml += `  <timeSignature>${timeSignature}</timeSignature>\n`;
    xml += `  <notes>\n`;
    
    compositionNotes.forEach(n => {
      xml += `    <note>\n`;
      xml += `      <noteId>${n.noteId}</noteId>\n`;
      xml += `      <durationType>${n.durationType}</durationType>\n`;
      xml += `      <tie>${n.tie || false}</tie>\n`;
      xml += `    </note>\n`;
    });
    
    xml += `  </notes>\n`;
    xml += `</melody>`;

    const blob = new Blob([xml], { type: 'application/xml;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${name.toLowerCase().replace(/\s+/g, '_')}_melody.xml`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setSuccessMessage(`Exported "${name}" to XML successfully!`);
    setTimeout(() => setSuccessMessage(""), 4000);
  };

  const handleXmlImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    handleStopNote();
    setSuccessMessage("");
    setErrorMessage("");

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const xmlText = event.target?.result as string;
        if (!xmlText) {
          throw new Error("Could not read file data.");
        }

        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, "text/xml");
        
        // Check for parsing error
        const parserError = xmlDoc.querySelector("parsererror");
        if (parserError) {
          throw new Error("Invalid XML file format or syntax error.");
        }

        const root = xmlDoc.querySelector("melody");
        if (!root) {
          throw new Error("Invalid melody XML. Root element '<melody>' not found.");
        }

        const nameEl = root.querySelector("name");
        const tempoEl = root.querySelector("tempo");
        const keySignatureEl = root.querySelector("keySignature");
        const instrumentKeyEl = root.querySelector("instrumentKey");
        const timeSignatureEl = root.querySelector("timeSignature");
        
        const parsedName = nameEl?.textContent || "Imported Melody";
        const parsedTempo = tempoEl ? parseInt(tempoEl.textContent || "110", 10) : 110;
        const parsedKeySignature = keySignatureEl ? parseInt(keySignatureEl.textContent || "0", 10) : 0;
        const parsedInstrumentKey = (instrumentKeyEl?.textContent || "Eb-alto") as any;
        const parsedTimeSignature = timeSignatureEl?.textContent || "4/4";

        const noteElements = root.querySelectorAll("notes > note, note");
        if (noteElements.length === 0) {
          throw new Error("No notes found in the XML file.");
        }

        const importedNotes: { id: string; noteId: string; durationType: NoteDurationType; tie?: boolean }[] = [];
        
        noteElements.forEach((noteNode, index) => {
          const noteIdEl = noteNode.querySelector("noteId");
          const durationTypeEl = noteNode.querySelector("durationType");
          const tieEl = noteNode.querySelector("tie");

          const noteId = noteIdEl?.textContent || "REST";
          const durationType = (durationTypeEl?.textContent || "1/4") as NoteDurationType;
          const tie = tieEl?.textContent === "true";

          const validDurations = ['1/1', '1/2', '1/4', '1/8', '1/16', '1/1.', '1/2.', '1/4.', '1/8.', '1/16.'];
          const finalDuration = validDurations.includes(durationType) ? durationType : '1/4';

          importedNotes.push({
            id: `note_${Date.now()}_${index}`,
            noteId,
            durationType: finalDuration,
            tie
          });
        });

        setCompositionNotes(importedNotes);
        setNewMelodyName(parsedName);
        setTempo(parsedTempo);
        setSelectedKeySignature(parsedKeySignature);
        setTargetTransposeKey(parsedKeySignature);
        
        if (['Eb-alto', 'Bb-tenor', 'Bb-soprano', 'Eb-baritone', 'C'].includes(parsedInstrumentKey)) {
          setInstrumentKey(parsedInstrumentKey);
        }
        
        if (['4/4', '3/4', '2/4', '6/8'].includes(parsedTimeSignature)) {
          setTimeSignature(parsedTimeSignature);
        }

        setSelectedCompositionIndex(0);
        setSuccessMessage(`Successfully imported XML melody "${parsedName}" with ${importedNotes.length} notes!`);
        setTimeout(() => setSuccessMessage(""), 5000);
      } catch (error: any) {
        setErrorMessage(error.message || "Failed to parse XML file.");
        setTimeout(() => setErrorMessage(""), 5000);
      }
    };
    
    reader.onerror = () => {
      setErrorMessage("Error reading XML file.");
      setTimeout(() => setErrorMessage(""), 5000);
    };

    reader.readAsText(file);
    e.target.value = "";
  };

  // Setup a new quiz question
  const generateQuizQuestion = () => {
    handleStopNote();
    setQuizAnswerChecked(false);
    setQuizIsCorrect(false);
    setUserQuizKeys([]);
    setQuizFeedback("");

    // Choose random note
    const randomIndex = Math.floor(Math.random() * notesList.length);
    const selectedNote = notesList[randomIndex];
    setQuizNote(selectedNote);

    // Pick random fingering from this note
    const randFingeringIndex = Math.floor(Math.random() * selectedNote.fingerings.length);
    const selectedFingering = selectedNote.fingerings[randFingeringIndex];
    setQuizFingering(selectedFingering);

    if (quizType === 'fingering') {
      // Need 4 choices including the correct note
      const choices: NoteInfo[] = [selectedNote];
      while (choices.length < 4) {
        const randomChoice = notesList[Math.floor(Math.random() * notesList.length)];
        if (!choices.some(c => c.id === randomChoice.id)) {
          choices.push(randomChoice);
        }
      }
      // Shuffle choices
      setQuizOptions(choices.sort(() => Math.random() - 0.5));
    }
  };

  // Regenerate question on quiz type change or mode change
  useEffect(() => {
    if (appMode === 'quiz') {
      generateQuizQuestion();
    }
  }, [quizType, appMode]);

  // Check the interactive fingering answer
  const submitSightReadingQuiz = () => {
    const isKeysMatch = (fKeys: string[], userKeys: string[]) => {
      const sortedF = [...fKeys].sort();
      const sortedU = [...userKeys].sort();
      return (
        sortedF.length === sortedU.length &&
        sortedF.every((val, index) => val === sortedU[index])
      );
    };

    // Correct if user matches ANY of the note's valid fingerings!
    const correctFingering = quizNote.fingerings.find(f => isKeysMatch(f.keys, userQuizKeys));

    setTotalQuestions(prev => prev + 1);
    setQuizAnswerChecked(true);

    if (correctFingering) {
      setQuizIsCorrect(true);
      setScore(prev => prev + 1);
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > highScore) setHighScore(newStreak);
      setQuizFeedback(`Brilliant! Correct fingering for ${quizNote.writtenName} (${correctFingering.name}).`);
      // Play note sound as positive reinforcement
      synth.play(quizNote.frequency, getTranspositionOffset(), 0.2, 0.8);
    } else {
      setQuizIsCorrect(false);
      setStreak(0);
      
      // Determine what was missed/wrong
      const correctKeys = quizFingering.keys;
      const missed = correctKeys.filter(k => !userQuizKeys.includes(k));
      const extra = userQuizKeys.filter(k => !correctKeys.includes(k));

      let fb = `Almost! Here is the standard fingering. `;
      if (missed.length > 0) {
        fb += `You missed: [${missed.map(k => saxKeysConfig.find(sc => sc.id === k)?.label || k).join(", ")}]. `;
      }
      if (extra.length > 0) {
        fb += `Unneeded pressed keys: [${extra.map(k => saxKeysConfig.find(sc => sc.id === k)?.label || k).join(", ")}]. `;
      }
      setQuizFeedback(fb);
    }
  };

  // Submit multiple choice answer
  const submitFingeringQuiz = (selectedChoice: NoteInfo) => {
    setTotalQuestions(prev => prev + 1);
    setQuizAnswerChecked(true);

    if (selectedChoice.id === quizNote.id) {
      setQuizIsCorrect(true);
      setScore(prev => prev + 1);
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > highScore) setHighScore(newStreak);
      setQuizFeedback(`Spot on! This fingering plays ${quizNote.writtenName}.`);
      synth.play(quizNote.frequency, getTranspositionOffset(), 0.2, 0.8);
    } else {
      setQuizIsCorrect(false);
      setStreak(0);
      setQuizFeedback(`Oops! This was the fingering for ${quizNote.writtenName}. You selected ${selectedChoice.writtenName}.`);
    }
  };

  // Toggle individual key in Sandbox or Sight reading mode
  const handleKeyToggle = (keyId: string) => {
    if (appMode === "sandbox") {
      setSandboxKeys(prev => 
        prev.includes(keyId) ? prev.filter(k => k !== keyId) : [...prev, keyId]
      );
    } else if (appMode === "quiz" && quizType === "sight-reading" && !quizAnswerChecked) {
      setUserQuizKeys(prev => 
        prev.includes(keyId) ? prev.filter(k => k !== keyId) : [...prev, keyId]
      );
    }
  };

  // Staff coordinates math
  // We center the staff vertically. Middle line is B4 (offset = 0).
  // Total vertical space is 160px.
  // Each staff step (line-to-space) is 8px.
  // G4 is offset -2. Staff y = 80 - (-2 * 8) = 80 + 16 = 96px.
  const calculateStaffY = (offset: number) => {
    return 100 - offset * 8;
  };

  // Click on staff to select or add notes
  const handleStaffClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (appMode !== 'learn') return;
    const svgElement = e.currentTarget.querySelector('svg');
    const rect = svgElement ? svgElement.getBoundingClientRect() : e.currentTarget.getBoundingClientRect();
    const staffWidth = isCompositionMode ? Math.max(600, 140 + (compositionNotes.length + 1) * 55 + 40) : 600;
    
    // Scale coordinates into the SVG coordinate space (0..staffWidth, 0..200)
    const clickX = (e.clientX - rect.left) * (staffWidth / rect.width);
    const clickY = (e.clientY - rect.top) * (200 / rect.height);
    
    // Find closest note by staffOffset
    let closestNoteIndex = 0;
    let minDiff = Infinity;
    
    notesList.forEach((note, index) => {
      const noteY = calculateStaffY(note.staffOffset);
      const diff = Math.abs(clickY - noteY);
      if (diff < minDiff) {
        minDiff = diff;
        closestNoteIndex = index;
      }
    });

    if (minDiff < 16) {
      const clickedNote = notesList[closestNoteIndex];
      
      if (isCompositionMode) {
        // Find closest note column
        const colIndex = Math.round((clickX - 140) / 55);
        
        if (colIndex >= 0 && colIndex < compositionNotes.length) {
          // Clicked on or near an existing note in the composition!
          // Just select it - do not change the pitch
          handleSelectCompositionIndex(colIndex);
        } else if (colIndex === compositionNotes.length || clickX >= 140 + compositionNotes.length * 55 - 20) {
          // Clicked to the right of the last note -> Append a new note!
          const newNote = {
            id: "note_" + Date.now() + "_" + Math.random().toString(36).substr(2, 4),
            noteId: clickedNote.id,
            durationType: currentDurationType,
            tie: false
          };
          setCompositionNotes(prev => [...prev, newNote]);
          handleSelectCompositionIndex(compositionNotes.length);
        }
      } else {
        // Single note mode
        changeNoteIndex(closestNoteIndex);
      }
    }
  };

  // Hover over staff
  const handleStaffMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (appMode !== 'learn') return;
    const svgElement = e.currentTarget.querySelector('svg');
    const rect = svgElement ? svgElement.getBoundingClientRect() : e.currentTarget.getBoundingClientRect();
    const staffWidth = isCompositionMode ? Math.max(600, 140 + (compositionNotes.length + 1) * 55 + 40) : 600;
    
    const hoverX = (e.clientX - rect.left) * (staffWidth / rect.width);
    const hoverY = (e.clientY - rect.top) * (200 / rect.height);

    let closestNoteIndex = 0;
    let minDiff = Infinity;

    notesList.forEach((note, index) => {
      const noteY = calculateStaffY(note.staffOffset);
      const diff = Math.abs(hoverY - noteY);
      if (diff < minDiff) {
        minDiff = diff;
        closestNoteIndex = index;
      }
    });

    if (minDiff < 16) {
      setHoveredStaffNote(closestNoteIndex);
      
      if (isCompositionMode) {
        const colIndex = Math.round((hoverX - 140) / 55);
        if (colIndex >= 0 && colIndex <= compositionNotes.length) {
          setHoveredCompositionColumn(colIndex);
        } else {
          setHoveredCompositionColumn(null);
        }
      } else {
        setHoveredCompositionColumn(null);
      }
    } else {
      setHoveredStaffNote(null);
      setHoveredCompositionColumn(null);
    }
  };

  // Filter notes based on search query
  const filteredNotes = notesList.filter(note => 
    note.writtenName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.writtenNameSharp.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.register.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#fdfcfb] text-[#1a1a1a] flex flex-col font-sans selection:bg-[#c5a059] selection:text-white">
      {/* Visual Header */}
      <header className="border-b border-[#1a1a1a]/10 bg-[#fdfcfb] sticky top-0 z-10 px-4 py-4 md:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#c5a059]/10 border border-[#c5a059]/30 rounded-full text-[#c5a059]">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] tracking-[0.3em] uppercase font-sans text-gray-500 font-bold">Reference Tool</p>
              <h1 className="text-2xl md:text-3xl font-serif font-light tracking-tight text-[#1a1a1a]">
                SAXOTONE
              </h1>
              <p className="text-xs text-[#1a1a1a]/60 font-mono mt-0.5">
                Standard Range & Altissimo Fingering Visualizer
              </p>
            </div>
          </div>

          {/* Core App Navigation Mode Selector */}
          <div className="flex bg-[#f4f2ee] p-1 rounded-full border border-[#1a1a1a]/10">
            <button
              onClick={() => { setAppMode('learn'); handleStopNote(); }}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold font-sans transition-all duration-300 ${
                appMode === 'learn'
                  ? 'bg-[#1a1a1a] text-white shadow-sm'
                  : 'text-[#1a1a1a]/60 hover:text-[#1a1a1a] hover:bg-[#1a1a1a]/5'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Explore & Learn</span>
            </button>
            <button
              onClick={() => { setAppMode('quiz'); handleStopNote(); }}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold font-sans transition-all duration-300 ${
                appMode === 'quiz'
                  ? 'bg-[#1a1a1a] text-white shadow-sm'
                  : 'text-[#1a1a1a]/60 hover:text-[#1a1a1a] hover:bg-[#1a1a1a]/5'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Fingering Quiz</span>
            </button>
            <button
              onClick={() => { setAppMode('sandbox'); handleStopNote(); }}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold font-sans transition-all duration-300 ${
                appMode === 'sandbox'
                  ? 'bg-[#1a1a1a] text-white shadow-sm'
                  : 'text-[#1a1a1a]/60 hover:text-[#1a1a1a] hover:bg-[#1a1a1a]/5'
              }`}
            >
              <Dices className="w-3.5 h-3.5" />
              <span>Key Sandbox</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column (Fingering Lists, Clefs, Audio & Modes) */}
        <div className="lg:col-span-7 flex flex-col gap-6">

          {/* SUCCESS & ERROR NOTIFICATIONS */}
          {(successMessage || errorMessage) && (
            <div className="flex flex-col gap-3 font-sans">
              {successMessage && (
                <div className="bg-emerald-50 border border-emerald-500/20 text-emerald-800 rounded-xl p-3.5 flex items-start gap-2.5 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
                  <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <div className="text-xs font-semibold leading-relaxed">{successMessage}</div>
                </div>
              )}
              {errorMessage && (
                <div className="bg-rose-50 border border-rose-500/20 text-rose-800 rounded-xl p-3.5 flex items-start gap-2.5 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
                  <AlertCircle className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />
                  <div className="text-xs font-semibold leading-relaxed">{errorMessage}</div>
                </div>
              )}
            </div>
          )}

          {/* TRANSPOSE & SEARCH CONTROLS */}
          <div className="bg-white border border-[#1a1a1a]/10 rounded-2xl p-5 flex flex-col gap-4 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Instrument Selection */}
              <div className="flex flex-col gap-1.5 font-sans">
                <label className="text-[10px] uppercase font-mono tracking-wider text-[#1a1a1a]/60">Instrument Key</label>
                <select
                  value={instrumentKey}
                  onChange={(e) => setInstrumentKey(e.target.value as any)}
                  className="bg-[#f4f2ee] border border-[#1a1a1a]/10 rounded-xl px-3 py-2 text-xs text-[#1a1a1a] font-medium focus:outline-none focus:border-[#c5a059] transition"
                >
                  <option value="Eb-alto">E♭ Alto Saxophone</option>
                  <option value="Bb-tenor">B♭ Tenor Saxophone</option>
                  <option value="Bb-soprano">B♭ Soprano Saxophone</option>
                  <option value="Eb-baritone">E♭ Baritone Saxophone</option>
                  <option value="C">C Instrument (Concert Pitch)</option>
                </select>
              </div>

              {/* Key Signature Selection */}
              <div className="flex flex-col gap-1.5 font-sans">
                <label className="text-[10px] uppercase font-mono tracking-wider text-[#1a1a1a]/60">Key Signature</label>
                <select
                  value={selectedKeySignature}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setSelectedKeySignature(val);
                    setTargetTransposeKey(val);
                  }}
                  className="bg-[#f4f2ee] border border-[#1a1a1a]/10 rounded-xl px-3 py-2 text-xs text-[#1a1a1a] font-medium focus:outline-none focus:border-[#c5a059] transition"
                >
                  {KEY_SIGNATURES.map((ks, i) => (
                    <option key={ks.name} value={i}>
                      {ks.name} {ks.type === 'sharp' ? `(${ks.count}♯)` : ks.type === 'flat' ? `(${ks.count}♭)` : ""}
                    </option>
                  ))}
                </select>
              </div>

              {/* Time Signature Selection */}
              <div className="flex flex-col gap-1.5 font-sans">
                <label className="text-[10px] uppercase font-mono tracking-wider text-[#1a1a1a]/60">Time Signature</label>
                <select
                  value={timeSignature}
                  onChange={(e) => setTimeSignature(e.target.value)}
                  className="bg-[#f4f2ee] border border-[#1a1a1a]/10 rounded-xl px-3 py-2 text-xs text-[#1a1a1a] font-medium focus:outline-none focus:border-[#c5a059] transition"
                >
                  <option value="4/4">4/4 Standard</option>
                  <option value="3/4">3/4 Waltz</option>
                  <option value="2/4">2/4 March</option>
                  <option value="6/8">6/8 Compound</option>
                </select>
              </div>

              {/* Search Note */}
              <div className="flex flex-col gap-1.5 font-sans">
                <label className="text-[10px] uppercase font-mono tracking-wider text-[#1a1a1a]/60">Search Notes</label>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#1a1a1a]/40" />
                  <input
                    type="text"
                    placeholder="Search (e.g. C5, Bb4)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#f4f2ee] border border-[#1a1a1a]/10 rounded-xl py-2 pl-9 pr-4 text-xs text-[#1a1a1a] placeholder:text-[#1a1a1a]/40 focus:outline-none focus:border-[#c5a059] transition"
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-2.5 text-[10px] text-[#1a1a1a]/50 hover:text-[#1a1a1a] font-bold"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between pt-3 border-t border-[#1a1a1a]/5 gap-3">
              <div className="flex items-center gap-2 font-sans text-xs">
                <span className="text-[#1a1a1a]/60">Current View Pitch:</span>
                <button
                  onClick={() => setIsConcertPitch(!isConcertPitch)}
                  className="font-bold text-[#c5a059] hover:text-[#9a7532] transition flex items-center gap-1.5"
                >
                  <span className="bg-[#c5a059]/10 px-2 py-0.5 rounded border border-[#c5a059]/20">
                    {isConcertPitch ? "Concert Pitch (Real Audio)" : "Saxophone Written Pitch"}
                  </span>
                  <span className="text-[10px] uppercase font-mono tracking-wide text-[#1a1a1a]/40">(Click to switch)</span>
                </button>
              </div>

              {isConcertPitch && (
                <div className="text-[11px] font-mono text-[#c5a059] bg-[#c5a059]/5 px-3 py-1 rounded-lg border border-[#c5a059]/15">
                  Playing sound transposed by {(() => {
                    const trans = {
                      'Eb-alto': '-9 semitones',
                      'Bb-tenor': '-14 semitones',
                      'Bb-soprano': '-2 semitones',
                      'Eb-baritone': '-21 semitones',
                      'C': '0 semitones'
                    };
                    return trans[instrumentKey] || '0 semitones';
                  })()}.
                </div>
              )}
            </div>
          </div>

          {/* VIEW 1: EXPLORE & LEARN REGISTRY */}
          {appMode === 'learn' && (
            <>
              {/* Dynamic Music Staff Card */}
              <div className="bg-white border border-[#1a1a1a]/10 rounded-3xl p-6 shadow-sm flex flex-col gap-4 relative overflow-hidden group">
                
                {/* Mode Selector Tab inside Card */}
                <div className="flex border-b border-[#1a1a1a]/10 pb-1 mb-1">
                  <button
                    onClick={() => {
                      setIsCompositionMode(false);
                      handleStopNote();
                    }}
                    className={`pb-2 px-4 text-xs font-bold font-sans border-b-2 transition-all duration-200 ${
                      !isCompositionMode
                        ? 'border-[#c5a059] text-[#1a1a1a]'
                        : 'border-transparent text-[#1a1a1a]/40 hover:text-[#1a1a1a]/70'
                    }`}
                  >
                    Single Note Reference
                  </button>
                  <button
                    onClick={() => {
                      setIsCompositionMode(true);
                      handleStopNote();
                    }}
                    className={`pb-2 px-4 text-xs font-bold font-sans border-b-2 transition-all duration-200 flex items-center gap-1.5 ${
                      isCompositionMode
                        ? 'border-[#c5a059] text-[#1a1a1a]'
                        : 'border-transparent text-[#1a1a1a]/40 hover:text-[#1a1a1a]/70'
                    }`}
                  >
                    <Music className="w-3.5 h-3.5 text-[#c5a059]" />
                    Melody Composer & Sequencer
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 bg-[#c5a059]/10 text-[#c5a059] text-[10px] font-bold font-sans rounded-full border border-[#c5a059]/20 uppercase tracking-widest">
                      {isCompositionMode ? "Interactive Sequencer" : "Interactive Music Staff"}
                    </span>
                    <span className="text-xs text-[#1a1a1a]/60 font-sans hidden sm:inline">
                      {isCompositionMode ? "Click staff to place notes • Scroll horizontally" : "Click staff to change note"}
                    </span>
                  </div>

                  {/* Note Navigators (Single Note Mode Only) */}
                  {!isCompositionMode && (
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => changeNoteIndex(currentNoteIndex - 1)}
                        disabled={currentNoteIndex === 0}
                        className="p-1.5 bg-[#fdfcfb] hover:bg-[#f4f2ee] border border-[#1a1a1a]/10 rounded-full text-[#1a1a1a] disabled:opacity-20 disabled:cursor-not-allowed transition shadow-sm"
                        title="Previous Chromatic Note"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => changeNoteIndex(currentNoteIndex + 1)}
                        disabled={currentNoteIndex === notesList.length - 1}
                        className="p-1.5 bg-[#fdfcfb] hover:bg-[#f4f2ee] border border-[#1a1a1a]/10 rounded-full text-[#1a1a1a] disabled:opacity-20 disabled:cursor-not-allowed transition shadow-sm"
                        title="Next Chromatic Note"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* SVG Treble Clef Music Staff */}
                <div 
                  ref={staffContainerRef}
                  className="bg-[#fdfcfb]/60 border border-[#1a1a1a]/10 rounded-2xl relative overflow-x-auto py-2 cursor-pointer select-none scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent"
                  onMouseMove={handleStaffMouseMove}
                  onMouseLeave={() => {
                    setHoveredStaffNote(null);
                    setHoveredCompositionColumn(null);
                  }}
                  onClick={handleStaffClick}
                >
                  <svg 
                    viewBox={`0 0 ${staffWidth} 200`} 
                    style={{ minWidth: staffWidth }}
                    className="h-44"
                  >
                    {/* Background Staff Lines (5 standard lines spaced 16px apart) */}
                    {[0, 1, 2, 3, 4].map((i) => {
                      const y = 68 + i * 16;
                      return (
                         <line 
                           key={i} 
                           x1="20" 
                           y1={y} 
                           x2={staffWidth - 20} 
                           y2={y} 
                           stroke="#1a1a1a" 
                           strokeOpacity="0.25"
                           strokeWidth="2" 
                         />
                      );
                    })}

                    {/* Left & Right bar lines */}
                    <line x1="20" y1="68" x2="20" y2="132" stroke="#1a1a1a" strokeOpacity="0.3" strokeWidth="3" />
                    <line x1={staffWidth - 20} y1="68" x2={staffWidth - 20} y2="132" stroke="#1a1a1a" strokeOpacity="0.3" strokeWidth="3" />

                    {/* Standard Treble Clef Path */}
                    <g transform="translate(30, 48) scale(0.65)" fill="#1a1a1a" fillOpacity="0.8" stroke="#1a1a1a" strokeWidth="1">
                      <path d="M21.5,123.6c-1.5,0.1-3.1-0.2-4.5-0.9c-2.4-1.2-3.8-3.7-3.7-6.5c0.1-4.7,4.3-8.5,9.4-8.5c5,0,9,3.5,9.1,8.1C31.9,120.4,27,123.5,21.5,123.6z M18.4,115.1c0,1.9,1.4,3.5,3.2,3.5c1.8,0,3.1-1.6,3.1-3.5c0-2-1.3-3.6-3.1-3.6C19.7,111.5,18.4,113.1,18.4,115.1z" />
                      <path d="M29.5,108.3c-2.7,2.2-6.1,3.4-9.6,3.3c-5.7-0.1-10.4-4-10.4-9.3c0-3.3,1.8-6.3,4.9-7.9c1.9-1,4.1-1.4,6.3-1.2c0.7,0.1,1.1,0.7,1,1.4c-0.1,0.7-0.7,1.1-1.4,1c-1.7-0.1-3.5,0.1-5,0.9c-2.3,1.2-3.6,3.3-3.6,5.8c0,4,3.7,7.1,8.2,7.2c2.9,0,5.8-1,8-2.8c0.5-0.4,1.3-0.4,1.7,0.1C30,107.3,30,108,29.5,108.3z" />
                      <path d="M43.7,85.1c-0.2,4.8-1.5,9.6-3.8,13.9c-3,5.6-7.7,10-13.6,12.5c-0.6,0.3-1.3,0-1.6-0.6c-0.3-0.6,0-1.3,0.6-1.6c5.3-2.3,9.5-6.2,12.2-11.3c2.1-3.9,3.3-8.3,3.5-12.8c0-5-3.3-9.5-8.1-11.4c-0.6-0.2-1-0.9-0.7-1.5c0.2-0.6,0.9-1,1.5-0.7C40,75.9,43.7,80.3,43.7,85.1z" />
                      <path d="M28.4,56.3c-5.6,0-10.6,3.2-12.8,8.1c-2,4.4-1.6,9.6,1,13.4c2.8,4,7.8,6.3,12.7,5.9c0.7-0.1,1.3,0.4,1.3,1c0.1,0.7-0.4,1.3-1,1.3c-5.8,0.5-11.6-2-14.8-6.7c-3.1-4.5-3.5-10.8-1.1-15.9c2.6-5.7,8.4-9.4,14.8-9.4c0.7,0,1.2,0.5,1.2,1.2C29.6,55.7,29,56.3,28.4,56.3z" />
                      <path d="M30.4,7.1c-0.4-0.1-0.8,0-1.1,0.3c-0.3,0.3-0.4,0.7-0.3,1.1l11.4,115.8c0.1,0.6,0.6,1,1.2,1c0,0,0.1,0,0.1,0c0.7-0.1,1.1-0.7,1-1.4L31.3,8.1C31.2,7.5,30.8,7.1,30.4,7.1z" />
                      <path d="M41.7,113.6c-3.5,0-6.4,2.9-6.4,6.4c0,3.5,2.9,6.4,6.4,6.4s6.4-2.9,6.4-6.4C48.1,116.5,45.2,113.6,41.7,113.6z" />
                      <path d="M30.3,11.2c2.1,3.4,4,7,5.6,10.7c3,7.1,4.7,14.7,5,22.4c0.1,1.9-0.1,3.8-0.5,5.7c-0.1,0.7-0.8,1.1-1.4,1c-0.7-0.1-1.1-0.8-1-1.4c0.3-1.6,0.5-3.3,0.4-4.9c-0.3-7.1-1.9-14-4.6-20.6c-1.5-3.5-3.3-6.9-5.3-10.1c-0.4-0.6-0.2-1.3,0.4-1.7C39.4,10.9,40.1,11,40.3,11.2z" />
                    </g>

                    {/* Key Signature accidentals on staff */}
                    {(() => {
                      const keySig = KEY_SIGNATURES[selectedKeySignature];
                      if (keySig.type === 'sharp') {
                        const sharpOffsets = [4, 1, 5, 2];
                        return Array.from({ length: keySig.count }).map((_, idx) => {
                          const offset = sharpOffsets[idx % sharpOffsets.length];
                          const x = 76 + idx * 10;
                          const y = calculateStaffY(offset);
                          return (
                            <text key={`key-sharp-${idx}`} x={x} y={y + 7} fill="#1a1a1a" fillOpacity="0.8" fontSize="22" fontWeight="bold" className="font-sans">♯</text>
                          );
                        });
                      } else if (keySig.type === 'flat') {
                        const flatOffsets = [0, 3, -1, 2];
                        return Array.from({ length: keySig.count }).map((_, idx) => {
                          const offset = flatOffsets[idx % flatOffsets.length];
                          const x = 76 + idx * 10;
                          const y = calculateStaffY(offset);
                          return (
                            <text key={`key-flat-${idx}`} x={x} y={y + 6} fill="#1a1a1a" fillOpacity="0.8" fontSize="24" fontWeight="bold" className="font-sans">♭</text>
                          );
                        });
                      }
                      return null;
                    })()}

                    {/* Time Signature */}
                    {isCompositionMode && (
                      (() => {
                        const timeSigX = 76 + (KEY_SIGNATURES[selectedKeySignature].count * 10) + 4;
                        const [num, den] = timeSignature.split('/');
                        return (
                          <g className="font-serif select-none" fill="#1a1a1a" fillOpacity="0.8" fontSize="22" fontWeight="bold" textAnchor="middle">
                            <text x={timeSigX} y={92}>{num}</text>
                            <text x={timeSigX} y={118}>{den}</text>
                          </g>
                        );
                      })()
                    )}

                    {/* Bar Lines and Measure Numbers */}
                    {isCompositionMode && (
                      (() => {
                        let currentBeats = 0;
                        const beatsPerMeasure = timeSignature === '4/4' ? 4 : timeSignature === '3/4' ? 3 : timeSignature === '2/4' ? 2 : 3;
                        let measureCount = 1;
                        const elements: React.ReactNode[] = [];

                        elements.push(
                          <text key="measure-1" x="140" y="52" fill="#1a1a1a" fillOpacity="0.4" fontSize="9" fontFamily="monospace" fontWeight="bold" textAnchor="middle">m.1</text>
                        );

                        compositionNotes.forEach((item, idx) => {
                          currentBeats += getBeatLength(item.durationType);
                          if (currentBeats >= beatsPerMeasure - 0.01 && idx < compositionNotes.length - 1) {
                            const barX = 140 + idx * 55 + 27.5;
                            measureCount++;
                            elements.push(
                              <g key={`bar-measure-${idx}`}>
                                <line 
                                  x1={barX} 
                                  y1="68" 
                                  x2={barX} 
                                  y2="132" 
                                  stroke="#1a1a1a" 
                                  strokeOpacity="0.35" 
                                  strokeWidth="2" 
                                />
                                <text 
                                  x={barX + 27.5} 
                                  y="52" 
                                  fill="#1a1a1a" 
                                  fillOpacity="0.4" 
                                  fontSize="9" 
                                  fontFamily="monospace" 
                                  fontWeight="bold" 
                                  textAnchor="middle"
                                >
                                  m.{measureCount}
                                </text>
                              </g>
                            );
                            currentBeats = 0;
                          }
                        });
                        return elements;
                      })()
                    )}

                    {/* RENDER ACTIVE MELODY SECTIONS */}
                    {isCompositionMode ? (
                      <>
                        {/* Real-time Vertical Playhead Line */}
                        {isMelodyPlaying && activeMelodyIndex !== -1 && (
                          <line 
                            x1={140 + activeMelodyIndex * 55} 
                            y1="20" 
                            x2={140 + activeMelodyIndex * 55} 
                            y2="160" 
                            stroke="#c5a059" 
                            strokeWidth="2.5" 
                            strokeDasharray="4 2"
                            className="transition-all duration-100"
                          />
                        )}

                        {/* Melody Notes */}
                        {compositionNotes.map((item, idx) => {
                          const isRest = item.noteId === "REST";
                          const noteInfo = !isRest ? notesList.find(n => n.id === item.noteId) : null;
                          if (!isRest && !noteInfo) return null;

                          const noteX = 140 + idx * 55;
                          const isDotted = item.durationType.endsWith('.');
                          const baseDuration = isDotted ? item.durationType.slice(0, -1) : item.durationType;
                          const noteY = isRest ? 100 : calculateStaffY(noteInfo!.staffOffset);
                          const isSelected = selectedCompositionIndex === idx;
                          const isCurrentlyPlaying = isMelodyPlaying && activeMelodyIndex === idx;

                          const stemUp = noteInfo ? noteInfo.staffOffset < 0 : false;
                          const isOpenNote = baseDuration === '1/1' || baseDuration === '1/2';
                          const fillStyle = isCurrentlyPlaying
                            ? '#c5a059'
                            : isSelected
                            ? '#1a1a1a'
                            : '#1a1a1a';

                          return (
                            <g 
                              key={item.id} 
                              className="cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSelectCompositionIndex(idx);
                              }}
                            >
                              {/* Accent box behind note */}
                              {(isSelected || isCurrentlyPlaying) && (
                                <rect
                                  x={noteX - 22}
                                  y="20"
                                  width="44"
                                  height="160"
                                  rx="8"
                                  fill={isCurrentlyPlaying ? "#c5a059" : "#1a1a1a"}
                                  fillOpacity={isCurrentlyPlaying ? "0.15" : "0.06"}
                                  stroke={isCurrentlyPlaying ? "#c5a059" : "#1a1a1a"}
                                  strokeOpacity={isCurrentlyPlaying ? "0.5" : "0.2"}
                                  strokeWidth={isCurrentlyPlaying ? "2" : "1"}
                                  strokeDasharray={isCurrentlyPlaying ? "none" : "3 3"}
                                />
                              )}

                              {isRest ? (
                                // Render Rest Symbol
                                <>
                                  {(() => {
                                    if (baseDuration === '1/1') {
                                      return <rect x={noteX - 8} y={84} width="16" height="8" fill={fillStyle} />;
                                    } else if (baseDuration === '1/2') {
                                      return <rect x={noteX - 8} y={92} width="16" height="8" fill={fillStyle} />;
                                    } else if (baseDuration === '1/4') {
                                      return <path d={`M ${noteX - 3} 78 C ${noteX + 3} 82, ${noteX + 5} 88, ${noteX - 1} 94 C ${noteX - 5} 98, ${noteX - 3} 103, ${noteX + 3} 103 C ${noteX - 2} 110, ${noteX - 5} 115, ${noteX - 1} 122 C ${noteX + 1} 125, ${noteX - 2} 128, ${noteX - 3} 128`} fill="none" stroke={fillStyle} strokeWidth="2.5" strokeLinecap="round" />;
                                    } else if (baseDuration === '1/8') {
                                      return (
                                        <g>
                                          <circle cx={noteX - 3} cy={94} r="3" fill={fillStyle} />
                                          <path d={`M ${noteX - 3} 94 Q ${noteX + 4} 90, ${noteX + 4} 84 Q ${noteX + 2} 94, ${noteX - 2} 114`} fill="none" stroke={fillStyle} strokeWidth="2" strokeLinecap="round" />
                                        </g>
                                      );
                                    } else if (baseDuration === '1/16') {
                                      return (
                                        <g>
                                          <circle cx={noteX - 3} cy={90} r="2.5" fill={fillStyle} />
                                          <path d={`M ${noteX - 3} 90 Q ${noteX + 4} 86, ${noteX + 4} 80 Q ${noteX + 2} 90, ${noteX - 2} 102`} fill="none" stroke={fillStyle} strokeWidth="2" strokeLinecap="round" />
                                          <circle cx={noteX - 5} cy={102} r="2.5" fill={fillStyle} />
                                          <path d={`M ${noteX - 5} 102 Q ${noteX + 2} 98, ${noteX + 2} 92 Q ${noteX} 102, ${noteX - 4} 114`} fill="none" stroke={fillStyle} strokeWidth="2" strokeLinecap="round" />
                                        </g>
                                      );
                                    }
                                    return null;
                                  })()}
                                  {isDotted && (
                                    <circle cx={noteX + 14} cy={92} r="2.5" fill={fillStyle} />
                                  )}
                                </>
                              ) : (
                                <>
                                  {/* Ledger Lines */}
                                  {noteInfo!.staffOffset <= -6 && (
                                    <line x1={noteX - 16} y1="148" x2={noteX + 16} y2="148" stroke="#1a1a1a" strokeWidth="2" strokeOpacity={isCurrentlyPlaying ? "1" : "0.7"} />
                                  )}
                                  {noteInfo!.staffOffset <= -7 && (
                                    <line x1={noteX - 16} y1="164" x2={noteX + 16} y2="164" stroke="#1a1a1a" strokeWidth="2" strokeOpacity={isCurrentlyPlaying ? "1" : "0.7"} />
                                  )}
                                  {noteInfo!.staffOffset >= 6 && (
                                    <line x1={noteX - 16} y1="52" x2={noteX + 16} y2="52" stroke="#1a1a1a" strokeWidth="2" strokeOpacity={isCurrentlyPlaying ? "1" : "0.7"} />
                                  )}
                                  {noteInfo!.staffOffset >= 8 && (
                                    <line x1={noteX - 16} y1="36" x2={noteX + 16} y2="36" stroke="#1a1a1a" strokeWidth="2" strokeOpacity={isCurrentlyPlaying ? "1" : "0.7"} />
                                  )}
                                  {noteInfo!.staffOffset >= 10 && (
                                    <line x1={noteX - 16} y1="20" x2={noteX + 16} y2="20" stroke="#1a1a1a" strokeWidth="2" strokeOpacity={isCurrentlyPlaying ? "1" : "0.7"} />
                                  )}
                                  {noteInfo!.staffOffset >= 12 && (
                                    <line x1={noteX - 16} y1="4" x2={noteX + 16} y2="4" stroke="#1a1a1a" strokeWidth="2" strokeOpacity={isCurrentlyPlaying ? "1" : "0.7"} />
                                  )}

                                  {/* Note Head */}
                                  <ellipse 
                                    cx={noteX} 
                                    cy={noteY} 
                                    rx="10.5" 
                                    ry="7" 
                                    transform={`rotate(-18 ${noteX} ${noteY})`}
                                    fill={isOpenNote ? "none" : fillStyle} 
                                    stroke={isOpenNote ? fillStyle : "none"}
                                    strokeWidth={isOpenNote ? "3" : "0"}
                                  />

                                  {/* Dotted note dot */}
                                  {isDotted && (
                                    <circle cx={noteX + 16} cy={noteY} r="2.5" fill={fillStyle} />
                                  )}

                                  {/* Stem */}
                                  {baseDuration !== '1/1' && (
                                    stemUp ? (
                                      <line x1={noteX + 9} y1={noteY} x2={noteX + 9} y2={noteY - 48} stroke={fillStyle} strokeWidth="2" />
                                    ) : (
                                      <line x1={noteX - 9} y1={noteY} x2={noteX - 9} y2={noteY + 48} stroke={fillStyle} strokeWidth="2" />
                                    )
                                  )}

                                  {/* Eighth Note Flag */}
                                  {baseDuration === '1/8' && (
                                    stemUp ? (
                                      <path d={`M ${noteX + 9} ${noteY - 48} Q ${noteX + 21} ${noteY - 34}, ${noteX + 19} ${noteY - 18} Q ${noteX + 15} ${noteY - 28}, ${noteX + 9} ${noteY - 38}`} fill={fillStyle} />
                                    ) : (
                                      <path d={`M ${noteX - 9} ${noteY + 48} Q ${noteX + 3} ${noteY + 34}, ${noteX + 1} ${noteY + 18} Q ${noteX - 3} ${noteY + 28}, ${noteX - 9} ${noteY + 38}`} fill={fillStyle} />
                                    )
                                  )}

                                  {/* Sixteenth Note Flags */}
                                  {baseDuration === '1/16' && (
                                    stemUp ? (
                                      <g>
                                        <path d={`M ${noteX + 9} ${noteY - 48} Q ${noteX + 21} ${noteY - 34}, ${noteX + 19} ${noteY - 18} Q ${noteX + 15} ${noteY - 28}, ${noteX + 9} ${noteY - 38}`} fill={fillStyle} />
                                        <path d={`M ${noteX + 9} ${noteY - 40} Q ${noteX + 21} ${noteY - 26}, ${noteX + 19} ${noteY - 10} Q ${noteX + 15} ${noteY - 20}, ${noteX + 9} ${noteY - 30}`} fill={fillStyle} />
                                      </g>
                                    ) : (
                                      <g>
                                        <path d={`M ${noteX - 9} ${noteY + 48} Q ${noteX + 3} ${noteY + 34}, ${noteX + 1} ${noteY + 18} Q ${noteX - 3} ${noteY + 28}, ${noteX - 9} ${noteY + 38}`} fill={fillStyle} />
                                        <path d={`M ${noteX - 9} ${noteY + 40} Q ${noteX + 3} ${noteY + 26}, ${noteX + 1} ${noteY + 10} Q ${noteX - 3} ${noteY + 20}, ${noteX - 9} ${noteY + 30}`} fill={fillStyle} />
                                      </g>
                                    )
                                  )}

                                  {/* Accidental */}
                                  {(() => {
                                    const displayAcc = getNoteDisplayAccidental(noteInfo.id, KEY_SIGNATURES[selectedKeySignature]);
                                    return displayAcc === 'flat' ? (
                                      <text x={noteX - 22} y={noteY + 6} fill={fillStyle} fontSize="21" fontWeight="bold" className="font-sans">♭</text>
                                    ) : displayAcc === 'sharp' ? (
                                      <text x={noteX - 22} y={noteY + 7} fill={fillStyle} fontSize="19" fontWeight="bold" className="font-sans">♯</text>
                                    ) : displayAcc === 'natural' ? (
                                      <text x={noteX - 22} y={noteY + 7} fill={fillStyle} fontSize="21" fontWeight="bold" className="font-sans">♮</text>
                                    ) : null;
                                  })()}
                                </>
                              )}

                              {/* Tie curve */}
                              {item.tie && idx < compositionNotes.length - 1 && (
                                <path 
                                  d={`M ${noteX + 10} ${noteY + 4} Q ${noteX + 27.5} ${noteY + 15}, ${noteX + 45} ${noteY + 4}`} 
                                  fill="none" 
                                  stroke={isCurrentlyPlaying ? "#c5a059" : "#1a1a1a"} 
                                  strokeWidth="2.5" 
                                  strokeLinecap="round"
                                  strokeOpacity="0.75"
                                />
                              )}

                              {/* Step text */}
                              <text 
                                x={noteX} 
                                y={185} 
                                fill={isCurrentlyPlaying ? "#c5a059" : isSelected ? "#1a1a1a" : "#1a1a1a"} 
                                fillOpacity={isCurrentlyPlaying || isSelected ? "1" : "0.4"}
                                fontSize="9" 
                                fontFamily="monospace"
                                textAnchor="middle"
                                fontWeight={isCurrentlyPlaying || isSelected ? "bold" : "normal"}
                              >
                                {idx + 1}
                              </text>
                            </g>
                          );
                        })}

                        {/* Ghost Note Preview for Composition Mode */}
                        {hoveredStaffNote !== null && hoveredCompositionColumn !== null && (
                          <g className="opacity-40">
                            <ellipse 
                              cx={140 + hoveredCompositionColumn * 55} 
                              cy={calculateStaffY(notesList[hoveredStaffNote].staffOffset)} 
                              rx="10.5" 
                              ry="7" 
                              transform={`rotate(-18 ${140 + hoveredCompositionColumn * 55} ${calculateStaffY(notesList[hoveredStaffNote].staffOffset)})`}
                              fill="#c5a059" 
                            />
                            {(() => {
                              const displayAcc = getNoteDisplayAccidental(notesList[hoveredStaffNote].id, KEY_SIGNATURES[selectedKeySignature]);
                              return displayAcc === 'flat' ? (
                                <text x={140 + hoveredCompositionColumn * 55 - 22} y={calculateStaffY(notesList[hoveredStaffNote].staffOffset) + 6} fill="#c5a059" fontSize="21" fontWeight="bold">♭</text>
                              ) : displayAcc === 'sharp' ? (
                                <text x={140 + hoveredCompositionColumn * 55 - 22} y={calculateStaffY(notesList[hoveredStaffNote].staffOffset) + 7} fill="#c5a059" fontSize="19" fontWeight="bold">♯</text>
                              ) : displayAcc === 'natural' ? (
                                <text x={140 + hoveredCompositionColumn * 55 - 22} y={calculateStaffY(notesList[hoveredStaffNote].staffOffset) + 7} fill="#c5a059" fontSize="21" fontWeight="bold">♮</text>
                              ) : null;
                            })()}
                            <text 
                              x={140 + hoveredCompositionColumn * 55} 
                              y="30" 
                              fill="#c5a059" 
                              fontSize="9" 
                              fontFamily="sans-serif" 
                              fontWeight="bold"
                              textAnchor="middle"
                            >
                              {hoveredCompositionColumn === compositionNotes.length ? "+ Append" : `Set ${hoveredCompositionColumn + 1}`}
                            </text>
                          </g>
                        )}
                      </>
                    ) : (
                      <>
                        {/* Standard Single Note rendering (Original code) */}
                        {hoveredStaffNote !== null && hoveredStaffNote !== currentNoteIndex && (
                          <g className="opacity-40">
                            {/* Note Head */}
                            <ellipse 
                              cx="300" 
                              cy={calculateStaffY(notesList[hoveredStaffNote].staffOffset)} 
                              rx="11" 
                              ry="7.5" 
                              transform={`rotate(-18 300 ${calculateStaffY(notesList[hoveredStaffNote].staffOffset)})`}
                              fill="#c5a059" 
                            />
                            {/* Accidental if flat or sharp or natural */}
                            {(() => {
                              const displayAcc = getNoteDisplayAccidental(notesList[hoveredStaffNote].id, KEY_SIGNATURES[selectedKeySignature]);
                              return displayAcc === 'flat' ? (
                                <text x="272" y={calculateStaffY(notesList[hoveredStaffNote].staffOffset) + 6} fill="#c5a059" fontSize="26" fontWeight="bold">♭</text>
                              ) : displayAcc === 'sharp' ? (
                                <text x="272" y={calculateStaffY(notesList[hoveredStaffNote].staffOffset) + 7} fill="#c5a059" fontSize="24" fontWeight="bold">♯</text>
                              ) : displayAcc === 'natural' ? (
                                <text x="272" y={calculateStaffY(notesList[hoveredStaffNote].staffOffset) + 7} fill="#c5a059" fontSize="26" fontWeight="bold">♮</text>
                              ) : null;
                            })()}
                            {/* Ghost Label */}
                            <text x="325" y={calculateStaffY(notesList[hoveredStaffNote].staffOffset) + 5} fill="#c5a059" fontSize="11" fontFamily="serif" fontWeight="bold">
                              {notesList[hoveredStaffNote].writtenName}
                            </text>
                            
                            {/* Helper Ledger Lines for Ghost Note */}
                            {notesList[hoveredStaffNote].staffOffset <= -6 && (
                              <line x1="284" y1="148" x2="316" y2="148" stroke="#c5a059" strokeWidth="2" strokeDasharray="1 1" />
                            )}
                            {notesList[hoveredStaffNote].staffOffset <= -7 && (
                              <line x1="284" y1="164" x2="316" y2="164" stroke="#c5a059" strokeWidth="2" strokeDasharray="1 1" />
                            )}
                            {notesList[hoveredStaffNote].staffOffset >= 6 && (
                              <line x1="284" y1="52" x2="316" y2="52" stroke="#c5a059" strokeWidth="2" strokeDasharray="1 1" />
                            )}
                            {notesList[hoveredStaffNote].staffOffset >= 8 && (
                              <line x1="284" y1="36" x2="316" y2="36" stroke="#c5a059" strokeWidth="2" strokeDasharray="1 1" />
                            )}
                            {notesList[hoveredStaffNote].staffOffset >= 10 && (
                              <line x1="284" y1="20" x2="316" y2="20" stroke="#c5a059" strokeWidth="2" strokeDasharray="1 1" />
                            )}
                            {notesList[hoveredStaffNote].staffOffset >= 12 && (
                              <line x1="284" y1="4" x2="316" y2="4" stroke="#c5a059" strokeWidth="2" strokeDasharray="1 1" />
                            )}
                          </g>
                        )}

                        {/* SELECTED PITCH NOTE */}
                        <g className="transition-all duration-300">
                          {/* Active Ledger Lines */}
                          {currentNote.staffOffset <= -6 && (
                            <line x1="282" y1="148" x2="318" y2="148" stroke="#1a1a1a" strokeWidth="2.5" />
                          )}
                          {currentNote.staffOffset <= -7 && (
                            <line x1="282" y1="164" x2="318" y2="164" stroke="#1a1a1a" strokeWidth="2.5" />
                          )}
                          {currentNote.staffOffset >= 6 && (
                            <line x1="282" y1="52" x2="318" y2="52" stroke="#1a1a1a" strokeWidth="2.5" />
                          )}
                          {currentNote.staffOffset >= 8 && (
                            <line x1="282" y1="36" x2="318" y2="36" stroke="#1a1a1a" strokeWidth="2.5" />
                          )}
                          {currentNote.staffOffset >= 10 && (
                            <line x1="282" y1="20" x2="318" y2="20" stroke="#1a1a1a" strokeWidth="2.5" />
                          )}
                          {currentNote.staffOffset >= 12 && (
                            <line x1="282" y1="4" x2="318" y2="4" stroke="#1a1a1a" strokeWidth="2.5" />
                          )}

                          {/* Note Head Ellipse */}
                          <ellipse 
                            cx="300" 
                            cy={calculateStaffY(currentNote.staffOffset)} 
                            rx="11.5" 
                            ry="8" 
                            transform={`rotate(-18 300 ${calculateStaffY(currentNote.staffOffset)})`}
                            fill="#1a1a1a" 
                          />

                          {/* Stem */}
                          {currentNote.staffOffset >= 0 ? (
                            <line 
                              x1="289" 
                              y1={calculateStaffY(currentNote.staffOffset)} 
                              x2="289" 
                              y2={calculateStaffY(currentNote.staffOffset) + 52} 
                              stroke="#1a1a1a" 
                              strokeWidth="2.5" 
                            />
                          ) : (
                            <line 
                              x1="311" 
                              y1={calculateStaffY(currentNote.staffOffset)} 
                              x2="311" 
                              y2={calculateStaffY(currentNote.staffOffset) - 52} 
                              stroke="#1a1a1a" 
                              strokeWidth="2.5" 
                            />
                          )}

                          {/* Accidental */}
                          {(() => {
                            const displayAcc = getNoteDisplayAccidental(currentNote.id, KEY_SIGNATURES[selectedKeySignature]);
                            return displayAcc === 'flat' ? (
                              <text x="270" y={calculateStaffY(currentNote.staffOffset) + 6} fill="#1a1a1a" fontSize="30" fontWeight="bold" className="font-sans">♭</text>
                            ) : displayAcc === 'sharp' ? (
                              <text x="270" y={calculateStaffY(currentNote.staffOffset) + 7} fill="#1a1a1a" fontSize="26" fontWeight="bold" className="font-sans">♯</text>
                            ) : displayAcc === 'natural' ? (
                              <text x="270" y={calculateStaffY(currentNote.staffOffset) + 7} fill="#1a1a1a" fontSize="30" fontWeight="bold" className="font-sans">♮</text>
                            ) : null;
                          })()}
                        </g>
                      </>
                    )}
                  </svg>

                  {/* Range indicators on staff */}
                  <div className="absolute right-3 bottom-2 text-[10px] font-mono text-[#1a1a1a]/50 bg-[#fdfcfb] border border-[#1a1a1a]/10 px-2 py-0.5 rounded-full">
                    {isCompositionMode ? "Scrollable Sequencer" : "Treble Clef Staff"}
                  </div>
                </div>

                {/* Conditionally render details vs composition controls */}
                {!isCompositionMode ? (
                  <>
                    {/* Selected note metadata and transposition display */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#f4f2ee] p-4 rounded-2xl border border-[#1a1a1a]/10">
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase font-mono tracking-wider text-[#1a1a1a]/60">Written Note</span>
                        <span className="text-xl font-serif font-extrabold text-[#1a1a1a] mt-0.5 flex items-baseline gap-1">
                          {currentNote.writtenName}
                          <span className="text-xs font-normal text-[#1a1a1a]/60">({currentNote.register.substring(0, 3)})</span>
                        </span>
                      </div>

                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase font-mono tracking-wider text-[#1a1a1a]/60">Concert Pitch</span>
                        <span className="text-xl font-serif font-extrabold text-[#c5a059] mt-0.5">
                          {currentNote.concertPitch}
                        </span>
                      </div>

                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase font-mono tracking-wider text-[#1a1a1a]/60">Written Freq</span>
                        <span className="text-lg font-mono font-semibold text-[#1a1a1a]/80 mt-0.5">
                          {currentNote.frequency} Hz
                        </span>
                      </div>

                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase font-mono tracking-wider text-[#1a1a1a]/60">Concert Freq</span>
                        <span className="text-lg font-mono font-semibold text-[#c5a059]/90 mt-0.5">
                          {(currentNote.frequency * Math.pow(2, -9 / 12)).toFixed(2)} Hz
                        </span>
                      </div>
                    </div>

                    {/* Synth audio trigger */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-1">
                      <div className="flex items-center gap-2 text-xs text-[#1a1a1a]/70">
                        <Volume2 className="w-4 h-4 text-[#c5a059]" />
                        <span>Experience real reed synthesis with vibrato</span>
                      </div>

                      <div className="flex gap-2 w-full sm:w-auto">
                        {isPlaying ? (
                          <button
                            onClick={handleStopNote}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs px-5 py-2.5 rounded-full transition shadow-sm"
                          >
                            <Square className="w-3.5 h-3.5 fill-current" />
                            <span>Stop Sound</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => handlePlayNote(currentNote)}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#1a1a1a] hover:bg-[#333333] text-white font-semibold text-xs px-6 py-2.5 rounded-full transition shadow-sm"
                          >
                            <Play className="w-3.5 h-3.5 fill-current" />
                            <span>Play Note</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col gap-4 font-sans text-[#1a1a1a]">
                    
                    {/* Editor Row */}
                    <div className="flex flex-col md:flex-row items-stretch gap-4">
                      
                      {/* Left Side: Selected Note Details or instructions */}
                      <div className="flex-1 bg-[#f4f2ee] p-4 rounded-2xl border border-[#1a1a1a]/10 flex flex-col justify-between gap-3">
                        {selectedCompositionIndex !== null && compositionNotes[selectedCompositionIndex] ? (
                          <>
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] uppercase font-mono font-bold text-[#c5a059] tracking-wider">
                                Editing Note #{selectedCompositionIndex + 1}
                              </span>
                              <div className="flex items-center gap-1">
                                <button 
                                  onClick={() => handleSelectCompositionIndex(selectedCompositionIndex - 1)}
                                  disabled={selectedCompositionIndex === 0}
                                  className="p-1 border border-[#1a1a1a]/10 hover:bg-[#1a1a1a]/5 rounded disabled:opacity-20 transition"
                                  title="Select Previous Note"
                                >
                                  <ChevronLeft className="w-3.5 h-3.5" />
                                </button>
                                <button 
                                  onClick={() => handleSelectCompositionIndex(selectedCompositionIndex + 1)}
                                  disabled={selectedCompositionIndex === compositionNotes.length - 1}
                                  className="p-1 border border-[#1a1a1a]/10 hover:bg-[#1a1a1a]/5 rounded disabled:opacity-20 transition"
                                  title="Select Next Note"
                                >
                                  <ChevronRight className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between mt-1 bg-white/50 p-3 rounded-xl border border-[#1a1a1a]/5">
                              <div className="flex items-center gap-3">
                                {/* Vertical stack of Up/Down buttons above and below */}
                                <div className="flex flex-col items-center gap-1 bg-[#f4f2ee] p-1.5 rounded-lg border border-[#1a1a1a]/5">
                                  <button
                                    onClick={() => handleMoveNoteSemitone('up')}
                                    disabled={compositionNotes[selectedCompositionIndex].noteId === "REST"}
                                    className="p-1 hover:bg-[#1a1a1a]/10 hover:text-[#c5a059] rounded transition disabled:opacity-20 flex items-center justify-center bg-white border border-[#1a1a1a]/10 shadow-sm"
                                    title="Move Up a Semitone"
                                  >
                                    <ChevronUp className="w-3.5 h-3.5 text-[#1a1a1a]" />
                                  </button>
                                  <button
                                    onClick={() => handleMoveNoteSemitone('down')}
                                    disabled={compositionNotes[selectedCompositionIndex].noteId === "REST"}
                                    className="p-1 hover:bg-[#1a1a1a]/10 hover:text-[#c5a059] rounded transition disabled:opacity-20 flex items-center justify-center bg-white border border-[#1a1a1a]/10 shadow-sm"
                                    title="Move Down a Semitone"
                                  >
                                    <ChevronDown className="w-3.5 h-3.5 text-[#1a1a1a]" />
                                  </button>
                                </div>

                                <div className="flex flex-col justify-center">
                                  <span className="text-[10px] font-mono text-[#1a1a1a]/40 uppercase">Pitch</span>
                                  <span className="text-2xl font-serif font-black text-[#1a1a1a] leading-none mt-1">
                                    {compositionNotes[selectedCompositionIndex].noteId === "REST" 
                                      ? "Rest" 
                                      : notesList.find(n => n.id === compositionNotes[selectedCompositionIndex].noteId)?.writtenName}
                                  </span>
                                </div>
                              </div>

                              <div className="flex flex-col text-right justify-center">
                                <span className="text-[10px] font-mono text-[#1a1a1a]/40 uppercase">Concert Pitch</span>
                                <span className="text-xl font-serif font-bold text-[#c5a059]">
                                  {compositionNotes[selectedCompositionIndex].noteId === "REST" 
                                    ? "Rest" 
                                    : notesList.find(n => n.id === compositionNotes[selectedCompositionIndex].noteId)?.concertPitch}
                                </span>
                              </div>
                            </div>

                            <div className="text-[10px] text-[#1a1a1a]/60 leading-relaxed font-sans mt-1">
                              Use the <span className="font-semibold text-[#1a1a1a]">staff</span> or <span className="font-semibold text-[#1a1a1a]">Quick Note Selector</span> below to change the pitch of this note.
                            </div>

                            {/* Selected Note Modifiers */}
                            <div className="flex gap-2 mt-2 pt-2 border-t border-[#1a1a1a]/5">
                              <button
                                onClick={handleToggleRest}
                                className={`flex-1 py-1.5 px-2.5 border rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 ${
                                  compositionNotes[selectedCompositionIndex].noteId === "REST"
                                    ? 'border-amber-500 bg-amber-500/10 text-amber-700'
                                    : 'border-[#1a1a1a]/15 hover:bg-[#1a1a1a]/5 text-[#1a1a1a]/70'
                                }`}
                                title="Toggle rest state of the selected note"
                              >
                                <span className="text-sm font-sans">𝄾</span>
                                <span>Rest</span>
                              </button>
                              <button
                                onClick={handleToggleTie}
                                className={`flex-1 py-1.5 px-2.5 border rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 ${
                                  compositionNotes[selectedCompositionIndex].tie
                                    ? 'border-[#c5a059] bg-[#c5a059]/15 text-[#c5a059]'
                                    : 'border-[#1a1a1a]/15 hover:bg-[#1a1a1a]/5 text-[#1a1a1a]/70'
                                }`}
                                title="Toggle tie curve connecting to the next note"
                              >
                                <span className="text-sm font-sans">⁀</span>
                                <span>Tie</span>
                              </button>
                            </div>

                            {/* Reorder Note Position */}
                            <div className="flex flex-col gap-1.5 mt-2 pt-2 border-t border-[#1a1a1a]/5">
                              <span className="text-[10px] font-mono text-[#1a1a1a]/40 uppercase font-bold tracking-wider">Reorder Position</span>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleMoveNote(selectedCompositionIndex, 'left')}
                                  disabled={selectedCompositionIndex === 0}
                                  className="flex-1 py-1.5 px-2.5 border border-[#1a1a1a]/15 hover:bg-[#1a1a1a]/5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 disabled:opacity-20 shadow-sm"
                                  title="Shift Left (Swap with previous note)"
                                >
                                  <span>← Move Left</span>
                                </button>
                                <button
                                  onClick={() => handleMoveNote(selectedCompositionIndex, 'right')}
                                  disabled={selectedCompositionIndex === compositionNotes.length - 1}
                                  className="flex-1 py-1.5 px-2.5 border border-[#1a1a1a]/15 hover:bg-[#1a1a1a]/5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 disabled:opacity-20 shadow-sm"
                                  title="Shift Right (Swap with next note)"
                                >
                                  <span>Move Right →</span>
                                </button>
                              </div>
                            </div>
                          </>
                        ) : (
                          <div className="h-full flex flex-col justify-center items-center text-center p-2">
                            <Music className="w-8 h-8 text-[#1a1a1a]/15 mb-2" />
                            <span className="text-xs font-bold text-[#1a1a1a]/70">No Note Selected</span>
                            <span className="text-[11px] text-[#1a1a1a]/50 max-w-[200px] mt-1">
                              Click any note on the staff or append a note to edit.
                            </span>
                          </div>
                        )}
                      </div>

                       {/* Right Side: Quick Duration Selection & Action Buttons */}
                      <div className="flex-[1.5] flex flex-col gap-3">
                        {/* Note Duration toggles */}
                        <div className="flex flex-col gap-1.5">
                          <span className="text-[10px] font-bold uppercase font-mono text-[#1a1a1a]/50">
                            {selectedCompositionIndex !== null ? "Change Duration:" : "Next Note Duration:"}
                          </span>
                          <div className="grid grid-cols-5 gap-1.5">
                            {(['1/1', '1/2', '1/4', '1/8', '1/16'] as const).map((type) => {
                              const labels = { '1/1': 'Whole', '1/2': 'Half', '1/4': 'Quarter', '1/8': 'Eighth', '1/16': '16th' };
                              const symbols = { '1/1': '𝅝', '1/2': '𝅗𝅥', '1/4': '𝅘𝅥', '1/8': '𝅘𝅥𝅮', '1/16': '𝅘𝅥𝅯' };
                              const isActive = currentDurationType === type || currentDurationType === (type + '.');
                              return (
                                <button
                                  key={type}
                                  onClick={() => handleDurationChange(currentDurationType.endsWith('.') ? (type + '.') as NoteDurationType : type)}
                                  className={`py-2 px-1 border rounded-xl flex flex-col items-center justify-center transition shadow-sm ${
                                    isActive 
                                      ? 'border-[#c5a059] bg-[#c5a059]/15 text-[#1a1a1a] font-black' 
                                      : 'border-[#1a1a1a]/10 bg-white hover:bg-[#f4f2ee] text-[#1a1a1a]/70 font-semibold'
                                  }`}
                                >
                                  <span className="text-xl leading-none -mt-1 mb-0.5">{symbols[type]}</span>
                                  <span className="text-[9px] font-sans uppercase tracking-tight">{labels[type]}</span>
                                </button>
                              );
                            })}
                          </div>

                          {/* Dotted modifier toggle */}
                          <button
                            onClick={() => {
                              const isCurrentlyDotted = currentDurationType.endsWith('.');
                              const baseType = isCurrentlyDotted ? currentDurationType.slice(0, -1) : currentDurationType;
                              const newType = isCurrentlyDotted ? baseType : (baseType + '.');
                              handleDurationChange(newType as NoteDurationType);
                            }}
                            className={`mt-1 py-1.5 px-3 border rounded-xl flex items-center justify-center gap-2 transition shadow-sm ${
                              currentDurationType.endsWith('.')
                                ? 'border-[#c5a059] bg-[#c5a059]/15 text-[#1a1a1a] font-bold' 
                                : 'border-[#1a1a1a]/10 bg-white hover:bg-[#f4f2ee] text-[#1a1a1a]/70 font-semibold'
                            }`}
                          >
                            <span className="text-sm font-mono">•</span>
                            <span className="text-xs uppercase tracking-wider">Dotted Duration</span>
                          </button>
                        </div>

                        {/* Note actions: Add, Delete, Clear */}
                        <div className="flex flex-col gap-2 mt-auto pt-2">
                          {selectedCompositionIndex !== null && (
                            <div className="flex flex-col gap-1.5 p-2 bg-amber-500/5 rounded-xl border border-amber-500/10">
                              <span className="text-[10px] font-bold uppercase font-mono text-amber-700/70">
                                Insert at Position #{selectedCompositionIndex + 1}:
                              </span>
                              <div className="flex gap-2">
                                <button
                                  onClick={handleInsertNoteToMelody}
                                  className="flex-[2] flex items-center justify-center gap-1.5 bg-[#c5a059] hover:bg-[#b08e4b] text-white font-bold text-xs py-2 px-3 rounded-lg transition shadow-sm"
                                  title={`Insert ${currentNote.writtenName} at selected position`}
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                  <span>Insert {currentNote.writtenName}</span>
                                </button>
                                <button
                                  onClick={handleInsertRestToMelody}
                                  className="flex-1 flex items-center justify-center gap-1 bg-[#c5a059]/10 hover:bg-[#c5a059]/20 border border-[#c5a059]/30 text-[#8c6f37] font-bold text-xs py-2 px-2 rounded-lg transition shadow-sm"
                                  title="Insert a rest note at selected position"
                                >
                                  <span>+ Rest</span>
                                </button>
                              </div>
                            </div>
                          )}

                          <div className="flex gap-2">
                            <button
                              onClick={handleAddNoteToMelody}
                              className="flex-[2] flex items-center justify-center gap-1.5 bg-[#1a1a1a] hover:bg-[#333333] text-white font-bold text-xs py-2.5 px-3 rounded-xl transition shadow-sm"
                              title="Append to the end of the melody"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>Append {currentNote.writtenName}</span>
                            </button>

                            <button
                              onClick={handleAddRestToMelody}
                              className="flex-1 flex items-center justify-center gap-1 bg-[#f4f2ee] hover:bg-[#e8e6e2] border border-[#1a1a1a]/10 text-[#1a1a1a] font-bold text-xs py-2.5 px-2 rounded-xl transition shadow-sm"
                              title="Append a rest note to the end of the melody"
                            >
                              <span>+ Rest</span>
                            </button>

                            {selectedCompositionIndex !== null && (
                              <button
                                onClick={() => handleDeleteNoteFromMelody(selectedCompositionIndex)}
                                className="flex items-center justify-center gap-1 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 font-bold text-xs py-2.5 px-3 rounded-xl transition shadow-sm"
                                title="Delete Selected Note"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}

                            <button
                              onClick={() => {
                                handleStopNote();
                                setCompositionNotes([]);
                                setSelectedCompositionIndex(null);
                              }}
                              className="px-3 border border-[#1a1a1a]/10 hover:bg-[#1a1a1a]/5 text-[#1a1a1a]/70 font-bold text-xs rounded-xl transition"
                              title="Clear All Notes"
                            >
                              Clear
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Playback Settings & Presets Row */}
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-[#fdfcfb] border border-[#1a1a1a]/10 p-4 rounded-2xl">
                      
                      {/* Left: Playback controls */}
                      <div className="flex flex-wrap items-center gap-3">
                        {isMelodyPlaying ? (
                          <button
                            onClick={handleStopNote}
                            className="flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-4 py-2 rounded-full transition shadow-sm"
                          >
                            <Square className="w-3 h-3 fill-current" />
                            <span>Stop Melody</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              handleStopNote();
                              handleSelectCompositionIndex(0);
                              setActiveMelodyIndex(0);
                              setIsMelodyPlaying(true);
                            }}
                            className="flex items-center justify-center gap-2 bg-[#1a1a1a] hover:bg-[#333333] text-white font-bold text-xs px-4.5 py-2 rounded-full transition shadow-sm"
                          >
                            <Play className="w-3 h-3 fill-current" />
                            <span>Play Melody</span>
                          </button>
                        )}

                        <button
                          onClick={() => setIsLooping(!isLooping)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-full text-xs font-semibold transition ${
                            isLooping 
                              ? 'border-[#c5a059] bg-[#c5a059]/10 text-[#c5a059]' 
                              : 'border-[#1a1a1a]/10 text-[#1a1a1a]/60 hover:text-[#1a1a1a]/80'
                          }`}
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Loop</span>
                        </button>

                        <div className="flex items-center gap-2 border border-[#1a1a1a]/10 px-3 py-1.5 rounded-full bg-[#fdfcfb]">
                          <span className="text-[10px] font-bold uppercase font-mono text-[#1a1a1a]/40">Tempo:</span>
                          <input 
                            type="range" 
                            min="60" 
                            max="185" 
                            value={tempo} 
                            onChange={(e) => setTempo(parseInt(e.target.value))}
                            className="w-20 accent-[#c5a059]"
                          />
                          <span className="text-xs font-mono font-bold text-[#1a1a1a]">{tempo} BPM</span>
                        </div>
                      </div>

                      {/* Right: Presets */}
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="text-[10px] font-bold uppercase font-mono text-[#1a1a1a]/50">Presets:</span>
                        <div className="flex flex-wrap gap-1.5">
                          <button 
                            onClick={() => loadPreset('mary')}
                            className="px-2.5 py-1 text-[11px] font-bold border border-[#1a1a1a]/10 bg-[#f4f2ee] rounded-md hover:bg-[#c5a059]/10 hover:border-[#c5a059]/40 hover:text-[#c5a059] transition"
                          >
                            Mary's Lamb
                          </button>
                          <button 
                            onClick={() => loadPreset('scale')}
                            className="px-2.5 py-1 text-[11px] font-bold border border-[#1a1a1a]/10 bg-[#f4f2ee] rounded-md hover:bg-[#c5a059]/10 hover:border-[#c5a059]/40 hover:text-[#c5a059] transition"
                          >
                            C Scale
                          </button>
                          <button 
                            onClick={() => loadPreset('joy')}
                            className="px-2.5 py-1 text-[11px] font-bold border border-[#1a1a1a]/10 bg-[#f4f2ee] rounded-md hover:bg-[#c5a059]/10 hover:border-[#c5a059]/40 hover:text-[#c5a059] transition"
                          >
                            Ode to Joy
                          </button>
                          <button 
                            onClick={() => loadPreset('baker')}
                            className="px-2.5 py-1 text-[11px] font-bold border border-[#1a1a1a]/10 bg-[#f4f2ee] rounded-md hover:bg-[#c5a059]/10 hover:border-[#c5a059]/40 hover:text-[#c5a059] transition flex items-center gap-1"
                            title="Baker Street Solo Riff"
                          >
                            <span>🎷 Baker Street</span>
                          </button>
                          <button 
                            onClick={() => loadPreset('careless')}
                            className="px-2.5 py-1 text-[11px] font-bold border border-[#1a1a1a]/10 bg-[#f4f2ee] rounded-md hover:bg-[#c5a059]/10 hover:border-[#c5a059]/40 hover:text-[#c5a059] transition flex items-center gap-1"
                            title="Careless Whisper Solo Riff"
                          >
                            <span>🎷 Careless Whisper</span>
                          </button>
                        </div>

                        {/* Import MIDI Button */}
                        <div className="flex items-center pl-2.5 border-l border-[#1a1a1a]/10 ml-1">
                          <label className="flex items-center gap-1.5 bg-[#c5a059] hover:bg-[#a18141] text-white font-bold text-xs px-3.5 py-1.5 rounded-lg cursor-pointer transition shadow-sm hover:shadow-md">
                            <Upload className="w-3.5 h-3.5" />
                            <span>Import MIDI</span>
                            <input
                              type="file"
                              accept=".mid,.midi"
                              onChange={handleMidiImport}
                              className="hidden"
                            />
                          </label>
                        </div>

                        {/* XML Import/Export Buttons */}
                        <div className="flex items-center gap-2 pl-2.5 border-l border-[#1a1a1a]/10 ml-1">
                          <button
                            onClick={exportMelodyToXML}
                            disabled={compositionNotes.length === 0}
                            className="flex items-center gap-1.5 bg-white hover:bg-[#1a1a1a]/5 text-[#1a1a1a] border border-[#1a1a1a]/10 disabled:opacity-30 font-bold text-xs px-3.5 py-1.5 rounded-lg transition shadow-sm cursor-pointer disabled:cursor-not-allowed"
                            title="Export the current melody to an XML file"
                          >
                            <Download className="w-3.5 h-3.5 text-[#c5a059]" />
                            <span>Export XML</span>
                          </button>

                          <label className="flex items-center gap-1.5 bg-white hover:bg-[#1a1a1a]/5 text-[#1a1a1a] border border-[#1a1a1a]/10 font-bold text-xs px-3.5 py-1.5 rounded-lg cursor-pointer transition shadow-sm">
                            <Upload className="w-3.5 h-3.5 text-[#c5a059]" />
                            <span>Import XML</span>
                            <input
                              type="file"
                              accept=".xml"
                              onChange={handleXmlImport}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Transpose Entire Melody Bar */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#fdfcfb] border border-[#1a1a1a]/10 p-4 rounded-2xl -mt-1.5">
                      {/* Left: Quick Chromatic shifts */}
                      <div className="flex flex-wrap items-center gap-2.5">
                        <div className="flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-[#c5a059]" />
                          <span className="text-[10px] font-bold uppercase font-mono text-[#1a1a1a]/60">Chromatic Shift:</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleTransposeMelodyInterval(1)}
                            disabled={compositionNotes.length === 0}
                            className="flex items-center gap-1 bg-white hover:bg-[#1a1a1a]/5 text-[#1a1a1a] border border-[#1a1a1a]/10 disabled:opacity-30 font-bold text-xs px-3 py-1.5 rounded-lg transition shadow-sm cursor-pointer disabled:cursor-not-allowed"
                            title="Shift entire melody up by 1 semitone"
                          >
                            <ChevronUp className="w-3.5 h-3.5 text-[#1a1a1a]" />
                            <span>Shift +1 Semitone</span>
                          </button>
                          <button
                            onClick={() => handleTransposeMelodyInterval(-1)}
                            disabled={compositionNotes.length === 0}
                            className="flex items-center gap-1 bg-white hover:bg-[#1a1a1a]/5 text-[#1a1a1a] border border-[#1a1a1a]/10 disabled:opacity-30 font-bold text-xs px-3 py-1.5 rounded-lg transition shadow-sm cursor-pointer disabled:cursor-not-allowed"
                            title="Shift entire melody down by 1 semitone"
                          >
                            <ChevronDown className="w-3.5 h-3.5 text-[#1a1a1a]" />
                            <span>Shift -1 Semitone</span>
                          </button>
                        </div>
                      </div>

                      {/* Right: Specific Key Signature Transposition */}
                      <div className="flex flex-wrap items-center gap-2.5 flex-1 justify-start md:justify-end">
                        <div className="flex items-center gap-1.5">
                          <Music className="w-3.5 h-3.5 text-[#c5a059]" />
                          <span className="text-[10px] font-bold uppercase font-mono text-[#1a1a1a]/60">Transpose to Key:</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <select
                            value={targetTransposeKey}
                            onChange={(e) => setTargetTransposeKey(Number(e.target.value))}
                            className="bg-[#f4f2ee] border border-[#1a1a1a]/10 rounded-lg px-2.5 py-1.5 text-xs text-[#1a1a1a] font-bold focus:outline-none focus:border-[#c5a059] transition"
                          >
                            {KEY_SIGNATURES.map((ks, i) => (
                              <option key={`trans-key-${ks.name}`} value={i}>
                                {ks.name.split(' / ')[0]} {ks.type === 'sharp' ? `(${ks.count}♯)` : ks.type === 'flat' ? `(${ks.count}♭)` : ""}
                              </option>
                            ))}
                          </select>
                          <button
                            onClick={() => handleTransposeMelodyToKeySignature(targetTransposeKey)}
                            disabled={compositionNotes.length === 0}
                            className="bg-[#1a1a1a] hover:bg-[#333333] text-white disabled:opacity-30 font-bold text-xs px-3.5 py-1.5 rounded-lg transition shadow-sm cursor-pointer disabled:cursor-not-allowed"
                            title="Transpose the entire melody to the selected key signature"
                          >
                            Transpose
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Saved Melonies Persistence Bar */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#fdfcfb] border border-[#1a1a1a]/10 p-4 rounded-2xl -mt-1.5">
                      {/* Left: Save melody Form */}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 flex-1 max-w-lg">
                        <div className="flex items-center gap-1.5">
                          <Save className="w-3.5 h-3.5 text-[#c5a059]" />
                          <span className="text-[10px] font-bold uppercase font-mono text-[#1a1a1a]/60">Save Current Melody:</span>
                        </div>
                        <div className="flex items-center gap-1.5 flex-1 w-full">
                          <input 
                            type="text" 
                            placeholder="Melody name (e.g. My Solo)..." 
                            value={newMelodyName}
                            onChange={(e) => setNewMelodyName(e.target.value)}
                            className="bg-[#f4f2ee] text-xs px-3 py-1.5 rounded-lg border border-[#1a1a1a]/10 focus:outline-none focus:ring-1 focus:ring-[#c5a059] flex-1 font-sans"
                          />
                          <button
                            onClick={() => handleSaveMelody(newMelodyName)}
                            disabled={!newMelodyName.trim() || compositionNotes.length === 0}
                            className="flex items-center gap-1 bg-[#1a1a1a] hover:bg-[#333333] text-white disabled:opacity-20 font-bold text-xs px-3.5 py-1.5 rounded-lg transition shadow-sm cursor-pointer disabled:cursor-not-allowed"
                          >
                            <span>Save</span>
                          </button>
                        </div>
                      </div>

                      {/* Right: Saved Custom Melodies List */}
                      <div className="flex items-center gap-2 flex-wrap flex-1 justify-start md:justify-end">
                        {savedMelodies.length > 0 ? (
                          <>
                            <span className="text-[10px] font-bold uppercase font-mono text-[#1a1a1a]/50">Saved:</span>
                            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                              {savedMelodies.map((melody) => (
                                <div 
                                  key={melody.id} 
                                  onClick={() => loadSavedMelody(melody)}
                                  className="group flex items-center gap-1.5 bg-[#c5a059]/10 border border-[#c5a059]/30 hover:border-[#c5a059]/60 rounded-md pl-2 pr-1 py-0.5 text-[11px] font-bold text-[#c5a059] transition cursor-pointer"
                                  title={`Load "${melody.name}" (${melody.notes.length} notes, ${melody.tempo} BPM, Key: ${melody.keySignature !== undefined ? KEY_SIGNATURES[melody.keySignature].name : 'C Major'}, Instrument: ${melody.instrumentKey || 'Eb Alto'})`}
                                >
                                  <span>
                                    {melody.name}
                                    <span className="opacity-60 text-[9px] font-normal ml-1 font-sans">
                                      ({melody.keySignature !== undefined ? KEY_SIGNATURES[melody.keySignature].name.split(' / ')[0] : 'C'})
                                    </span>
                                  </span>
                                  <button
                                    onClick={(e) => handleDeleteMelody(melody.id, e)}
                                    className="text-rose-600 hover:text-rose-700 p-0.5 rounded hover:bg-rose-100/60 transition"
                                    title="Delete"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </>
                        ) : (
                          <span className="text-[10px] font-medium italic text-[#1a1a1a]/40">No saved melodies in local storage yet.</span>
                        )}
                      </div>
                    </div>

                    {/* Small helpful spacer or instructions info */}
                    <div className="flex items-center justify-between text-[10px] text-[#1a1a1a]/50 font-mono pt-1 border-t border-[#1a1a1a]/5">
                      <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-[#c5a059] rounded-full animate-ping"></span>
                        Press Spacebar to Play/Stop melody
                      </span>
                      <span>{compositionNotes.length} notes in melody</span>
                    </div>

                  </div>
                )}
              </div>

              {/* QUICK SCROLL PICKER CAROUSEL */}
              <div className="bg-white border border-[#1a1a1a]/10 rounded-3xl p-5 shadow-sm flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase font-mono tracking-wider text-[#1a1a1a]/60">
                    Quick Note Selector ({filteredNotes.length} matched)
                  </span>
                  {searchQuery && (
                    <span className="text-[10px] bg-[#c5a059]/15 text-[#c5a059] px-2 py-0.5 rounded-full font-mono font-bold">
                      Filtered
                    </span>
                  )}
                </div>

                <div className="flex gap-2 overflow-x-auto pb-3 pt-1 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent snap-x">
                  {filteredNotes.map((note) => {
                    const isSelected = note.id === currentNote.id;
                    let registerColor = "border-[#c5a059]/20 hover:border-[#c5a059]/40 text-[#c5a059] bg-[#c5a059]/5";
                    if (note.register === 'middle') registerColor = "border-teal-600/20 hover:border-teal-600/40 text-teal-700 bg-teal-500/5";
                    if (note.register === 'high') registerColor = "border-blue-600/20 hover:border-blue-600/40 text-blue-700 bg-blue-500/5";
                    if (note.register === 'altissimo') registerColor = "border-purple-600/20 hover:border-purple-600/40 text-purple-700 bg-purple-500/5";

                    return (
                      <button
                        key={note.id}
                        onClick={() => {
                          const mainIndex = notesList.findIndex(n => n.id === note.id);
                          if (mainIndex !== -1) changeNoteIndex(mainIndex);
                        }}
                        className={`snap-center flex-shrink-0 w-12 h-12 rounded-xl flex flex-col items-center justify-center border text-xs font-extrabold transition-all duration-300 ${
                          isSelected
                            ? 'bg-[#1a1a1a] border-[#1a1a1a] text-white shadow-md scale-105'
                            : registerColor
                        }`}
                      >
                        <span>{note.writtenName.replace(/\d/, "")}</span>
                        <span className={`text-[9px] font-mono ${isSelected ? 'text-white/80' : 'text-[#1a1a1a]/40'}`}>
                          {note.octave}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Color Legend */}
                <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-[10px] font-mono text-[#1a1a1a]/50 border-t border-[#1a1a1a]/10 pt-3">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#c5a059]/20 border border-[#c5a059]/40" />
                    <span>Low Register (B♭3 - G♯4)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-teal-600/20 border border-teal-600/40" />
                    <span>Middle Register (A4 - B5)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600/20 border border-blue-600/40" />
                    <span>High Register (C6 - F♯6)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-600/20 border border-purple-600/40" />
                    <span>Altissimo (G6 - A6)</span>
                  </div>
                </div>
              </div>

              {/* DETAILED FINGERING EXPLANATION & CHEAT SHEET */}
              <div className="bg-white border border-[#1a1a1a]/10 rounded-3xl p-6 shadow-sm flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-[#c5a059]" />
                  <span className="text-xs font-bold uppercase font-sans tracking-wider text-[#1a1a1a]/60">
                    Fingering Insights & Guides
                  </span>
                </div>

                {/* Fingering Selectors for Notes with Alternates */}
                {currentNote.fingerings.length > 1 ? (
                  <div className="flex flex-col gap-3">
                    <span className="text-xs text-[#1a1a1a]/70">
                      This note has <strong className="text-[#c5a059]">{currentNote.fingerings.length} alternate fingerings</strong>. Choose one below:
                    </span>
                    <div className="flex gap-2">
                      {currentNote.fingerings.map((f, idx) => (
                        <button
                          key={f.name}
                          onClick={() => setSelectedFingeringIndex(idx)}
                          className={`px-3 py-2 rounded-xl text-xs font-bold border transition ${
                            selectedFingeringIndex === idx
                              ? 'bg-[#c5a059]/10 border-[#c5a059] text-[#9a7532]'
                              : 'bg-[#fdfcfb] border-[#1a1a1a]/10 text-[#1a1a1a]/60 hover:text-[#1a1a1a] hover:bg-[#f4f2ee]'
                          }`}
                        >
                          {f.name}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-[#1a1a1a]/50 font-sans">
                    This note has one standard fingering. Most saxophones share this configuration across soprano, alto, tenor, and baritone registers.
                  </p>
                )}

                {/* Active Fingering Instructions */}
                <div className="bg-[#f4f2ee] rounded-2xl border border-[#1a1a1a]/10 p-4 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#1a1a1a] font-serif">
                      Fingering: {activeFingering.name}
                    </span>
                    <span className="text-[10px] bg-white px-2 py-0.5 rounded border border-[#1a1a1a]/10 font-mono text-[#1a1a1a]/70">
                      {activeFingering.keys.length} Keys Closed
                    </span>
                  </div>

                  <p className="text-xs text-[#1a1a1a]/70 leading-relaxed font-sans">
                    {activeFingering.description || "Press the indicated highlighted keys. Blow steady warm air to sustain tone."}
                  </p>

                  <div className="border-t border-[#1a1a1a]/10 pt-3 flex flex-wrap gap-2">
                    {activeFingering.keys.map((k) => {
                      const keyDetail = saxKeysConfig.find(sc => sc.id === k);
                      return (
                        <span key={k} className="text-[10px] bg-white hover:bg-gray-100 transition text-[#1a1a1a]/80 border border-[#1a1a1a]/10 px-2.5 py-1 rounded-md font-mono">
                          {keyDetail?.name || k}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* VIEW 2: QUIZ & SIGHT READING PRACTICE GAME */}
          {appMode === 'quiz' && (
            <div className="bg-white border border-[#1a1a1a]/10 rounded-3xl p-6 shadow-sm flex flex-col gap-5">
              {/* Quiz Header & Scoreboard */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-[#1a1a1a]/10 pb-5">
                <div className="flex flex-col">
                  <span className="text-xs font-bold font-sans text-[#c5a059] uppercase tracking-wider">
                    Saxophone Fingering Quiz
                  </span>
                  <div className="flex bg-[#f4f2ee] p-1 rounded-full border border-[#1a1a1a]/10 mt-2">
                    <button
                      onClick={() => { setQuizType('sight-reading'); }}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                        quizType === 'sight-reading'
                          ? 'bg-white text-[#1a1a1a] shadow-xs'
                          : 'text-[#1a1a1a]/60 hover:text-[#1a1a1a]'
                      }`}
                    >
                      Sight Reading
                    </button>
                    <button
                      onClick={() => { setQuizType('fingering'); }}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                        quizType === 'fingering'
                          ? 'bg-white text-[#1a1a1a] shadow-xs'
                          : 'text-[#1a1a1a]/60 hover:text-[#1a1a1a]'
                      }`}
                    >
                      Identify Fingering
                    </button>
                  </div>
                </div>

                {/* Score panel */}
                <div className="flex items-center gap-4 bg-[#fdfcfb] border border-[#1a1a1a]/10 px-4 py-3 rounded-2xl">
                  <div className="text-center">
                    <div className="text-[10px] uppercase font-mono text-[#1a1a1a]/50">Correct</div>
                    <div className="text-lg font-extrabold text-emerald-600">{score}/{totalQuestions}</div>
                  </div>
                  <div className="w-px h-8 bg-[#1a1a1a]/10" />
                  <div className="text-center">
                    <div className="text-[10px] uppercase font-mono text-[#1a1a1a]/50">Streak</div>
                    <div className="text-lg font-extrabold text-[#c5a059]">{streak} 🔥</div>
                  </div>
                  <div className="w-px h-8 bg-[#1a1a1a]/10" />
                  <div className="text-center">
                    <div className="text-[10px] uppercase font-mono text-[#1a1a1a]/50">High Streak</div>
                    <div className="text-lg font-extrabold text-purple-700">{highScore} 🏆</div>
                  </div>
                </div>
              </div>

              {/* QUIZ TYPE 1: SIGHT READING */}
              {quizType === 'sight-reading' && (
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <h3 className="text-xs font-bold uppercase font-sans text-[#1a1a1a]/60">
                      Step 1: Read Note on Staff
                    </h3>
                    <span className="text-[10px] text-[#c5a059] font-sans bg-[#c5a059]/10 px-2.5 py-1 rounded-full border border-[#c5a059]/20 self-start sm:self-auto">
                      Click the keys on the Saxophone model to finger this note!
                    </span>
                  </div>

                  {/* Static Staff with current Quiz Note */}
                  <div className="bg-[#fdfcfb]/60 border border-[#1a1a1a]/10 rounded-2xl p-4">
                    <svg viewBox="0 0 600 160" className="w-full h-36">
                      {/* Lines */}
                      {[0, 1, 2, 3, 4].map((i) => {
                        const y = 48 + i * 16;
                        return (
                          <line key={i} x1="20" y1={y} x2="580" y2={y} stroke="#1a1a1a" strokeOpacity="0.25" strokeWidth="2" />
                        );
                      })}
                      {/* Clef */}
                      <g transform="translate(30, 28) scale(0.6)" fill="#1a1a1a" fillOpacity="0.8">
                        <path d="M21.5,123.6c-1.5,0.1-3.1-0.2-4.5-0.9c-2.4-1.2-3.8-3.7-3.7-6.5c0.1-4.7,4.3-8.5,9.4-8.5c5,0,9,3.5,9.1,8.1C31.9,120.4,27,123.5,21.5,123.6z M18.4,115.1c0,1.9,1.4,3.5,3.2,3.5c1.8,0,3.1-1.6,3.1-3.5c0-2-1.3-3.6-3.1-3.6C19.7,111.5,18.4,113.1,18.4,115.1z" />
                        <path d="M29.5,108.3c-2.7,2.2-6.1,3.4-9.6,3.3c-5.7-0.1-10.4-4-10.4-9.3c0-3.3,1.8-6.3,4.9-7.9c1.9-1,4.1-1.4,6.3-1.2c0.7,0.1,1.1,0.7,1,1.4c-0.1,0.7-0.7,1.1-1.4,1c-1.7-0.1-3.5,0.1-5,0.9c-2.3,1.2-3.6,3.3-3.6,5.8c0,4,3.7,7.1,8.2,7.2c2.9,0,5.8-1,8-2.8c0.5-0.4,1.3-0.4,1.7,0.1C30,107.3,30,108,29.5,108.3z" />
                        <path d="M43.7,85.1c-0.2,4.8-1.5,9.6-3.8,13.9c-3,5.6-7.7,10-13.6,12.5c-0.6,0.3-1.3,0-1.6-0.6c-0.3-0.6,0-1.3,0.6-1.6c5.3-2.3,9.5-6.2,12.2-11.3c2.1-3.9,3.3-8.3,3.5-12.8c0-5-3.3-9.5-8.1-11.4c-0.6-0.2-1-0.9-0.7-1.5c0.2-0.6,0.9-1,1.5-0.7C40,75.9,43.7,80.3,43.7,85.1z" />
                        <path d="M28.4,56.3c-5.6,0-10.6,3.2-12.8,8.1c-2,4.4-1.6,9.6,1,13.4c2.8,4,7.8,6.3,12.7,5.9c0.7-0.1,1.3,0.4,1.3,1c0.1,0.7-0.4,1.3-1,1.3c-5.8,0.5-11.6-2-14.8-6.7c-3.1-4.5-3.5-10.8-1.1-15.9c2.6-5.7,8.4-9.4,14.8-9.4c0.7,0,1.2,0.5,1.2,1.2C29.6,55.7,29,56.3,28.4,56.3z" />
                        <path d="M30.4,7.1c-0.4-0.1-0.8,0-1.1,0.3c-0.3,0.3-0.4,0.7-0.3,1.1l11.4,115.8c0.1,0.6,0.6,1,1.2,1c0,0,0.1,0,0.1,0c0.7-0.1,1.1-0.7,1-1.4L31.3,8.1C31.2,7.5,30.8,7.1,30.4,7.1z" />
                        <path d="M41.7,113.6c-3.5,0-6.4,2.9-6.4,6.4c0,3.5,2.9,6.4,6.4,6.4s6.4-2.9,6.4-6.4C48.1,116.5,45.2,113.6,41.7,113.6z" />
                        <path d="M30.3,11.2c2.1,3.4,4,7,5.6,10.7c3,7.1,4.7,14.7,5,22.4c0.1,1.9-0.1,3.8-0.5,5.7c-0.1,0.7-0.8,1.1-1.4,1c-0.7-0.1-1.1-0.8-1-1.4c0.3-1.6,0.5-3.3,0.4-4.9c-0.3-7.1-1.9-14-4.6-20.6c-1.5-3.5-3.3-6.9-5.3-10.1c-0.4-0.6-0.2-1.3,0.4-1.7C39.4,10.9,40.1,11,40.3,11.2z" />
                      </g>

                      {/* Active Quiz Ledger Lines */}
                      {quizNote.staffOffset <= -6 && <line x1="282" y1="128" x2="318" y2="128" stroke="#1a1a1a" strokeWidth="2.5" />}
                      {quizNote.staffOffset <= -7 && <line x1="282" y1="144" x2="318" y2="144" stroke="#1a1a1a" strokeWidth="2.5" />}
                      {quizNote.staffOffset >= 6 && <line x1="282" y1="32" x2="318" y2="32" stroke="#1a1a1a" strokeWidth="2.5" />}
                      {quizNote.staffOffset >= 8 && <line x1="282" y1="16" x2="318" y2="16" stroke="#1a1a1a" strokeWidth="2.5" />}

                      {/* Note head */}
                      <ellipse 
                        cx="300" 
                        cy={80 - quizNote.staffOffset * 8} 
                        rx="11.5" 
                        ry="8" 
                        transform={`rotate(-18 300 ${80 - quizNote.staffOffset * 8})`}
                        fill="#1a1a1a" 
                      />

                      {/* Stem */}
                      {quizNote.staffOffset >= 0 ? (
                        <line x1="289" y1={80 - quizNote.staffOffset * 8} x2="289" y2={80 - quizNote.staffOffset * 8 + 52} stroke="#1a1a1a" strokeWidth="2.5" />
                      ) : (
                        <line x1="311" y1={80 - quizNote.staffOffset * 8} x2="311" y2={80 - quizNote.staffOffset * 8 - 52} stroke="#1a1a1a" strokeWidth="2.5" />
                      )}

                      {/* Accidentals */}
                      {quizNote.accidentals === 'flat' && (
                        <text x="270" y={80 - quizNote.staffOffset * 8 + 6} fill="#1a1a1a" fontSize="30" fontWeight="bold" className="font-sans">♭</text>
                      )}
                      {quizNote.accidentals === 'sharp' && (
                        <text x="270" y={80 - quizNote.staffOffset * 8 + 7} fill="#1a1a1a" fontSize="26" fontWeight="bold" className="font-sans">♯</text>
                      )}
                    </svg>
                  </div>

                  {/* Submit / Reset Actions */}
                  {!quizAnswerChecked ? (
                    <div className="flex gap-3">
                      <button
                        onClick={() => setUserQuizKeys([])}
                        className="flex-1 bg-[#f4f2ee] hover:bg-[#e1dfda] border border-[#1a1a1a]/10 text-[#1a1a1a]/80 font-bold py-3 rounded-full text-xs transition"
                      >
                        Reset Keys
                      </button>
                      <button
                        onClick={submitSightReadingQuiz}
                        className="flex-1 bg-[#1a1a1a] hover:bg-[#333333] text-white font-bold py-3 rounded-full text-xs transition shadow-sm"
                      >
                        Submit Fingering
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4">
                      {/* Correct / Incorrect Banner */}
                      <div className={`p-4 rounded-2xl flex items-start gap-3 border ${
                        quizIsCorrect 
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                          : 'bg-rose-50 border-rose-200 text-rose-800'
                      }`}>
                        {quizIsCorrect ? (
                          <CheckCircle className="w-5 h-5 flex-shrink-0 text-emerald-600" />
                        ) : (
                          <XCircle className="w-5 h-5 flex-shrink-0 text-rose-600" />
                        )}
                        <div className="flex-1 text-xs">
                          <h4 className="font-bold text-sm mb-1">{quizIsCorrect ? "Correct!" : "Nice try!"}</h4>
                          <p className="font-sans opacity-90">{quizFeedback}</p>
                        </div>
                      </div>

                      <button
                        onClick={generateQuizQuestion}
                        className="bg-[#1a1a1a] hover:bg-[#333333] text-white font-extrabold py-3 rounded-full text-xs transition shadow-sm flex items-center justify-center gap-1.5"
                      >
                        <span>Next Question</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* QUIZ TYPE 2: IDENTIFY FINGERING */}
              {quizType === 'fingering' && (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase font-sans text-[#1a1a1a]/60">
                      Step 1: Inspect highlighted fingering on Saxophone
                    </h3>
                  </div>

                  <p className="text-xs text-[#1a1a1a]/70 leading-relaxed bg-[#fdfcfb] p-4 rounded-xl border border-[#1a1a1a]/10 font-sans">
                    Look at the Saxophone diagram on the right side. The active keys are highlighted. Which note does this fingering play?
                  </p>

                  {/* Multiple Choice Answers */}
                  {!quizAnswerChecked ? (
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      {quizOptions.map((option) => (
                        <button
                          key={option.id}
                          onClick={() => submitFingeringQuiz(option)}
                          className="bg-[#fdfcfb] hover:bg-[#f4f2ee] hover:border-[#c5a059]/50 border border-[#1a1a1a]/10 text-[#1a1a1a] font-bold py-4 rounded-2xl text-sm transition-all text-center flex flex-col items-center justify-center"
                        >
                          <span className="text-lg font-serif">{option.writtenName}</span>
                          <span className="text-[10px] font-sans text-[#1a1a1a]/50 uppercase tracking-wider">{option.register} register</span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4">
                      {/* Correct / Incorrect Banner */}
                      <div className={`p-4 rounded-2xl flex items-start gap-3 border ${
                        quizIsCorrect 
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                          : 'bg-rose-50 border-rose-200 text-rose-800'
                      }`}>
                        {quizIsCorrect ? (
                          <CheckCircle className="w-5 h-5 flex-shrink-0 text-emerald-600" />
                        ) : (
                          <XCircle className="w-5 h-5 flex-shrink-0 text-rose-600" />
                        )}
                        <div className="flex-1 text-xs">
                          <h4 className="font-bold text-sm mb-1">{quizIsCorrect ? "Correct!" : "Not quite!"}</h4>
                          <p className="font-sans opacity-90">{quizFeedback}</p>
                        </div>
                      </div>

                      <button
                        onClick={generateQuizQuestion}
                        className="bg-[#1a1a1a] hover:bg-[#333333] text-white font-extrabold py-3 rounded-full text-xs transition shadow-sm flex items-center justify-center gap-1.5"
                      >
                        <span>Next Question</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* VIEW 3: KEY SANDBOX / CONSTRUCT CUSTOM PITCHES */}
          {appMode === 'sandbox' && (
            <div className="bg-white border border-[#1a1a1a]/10 rounded-3xl p-6 shadow-sm flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <Dices className="w-4 h-4 text-[#c5a059]" />
                <span className="text-xs font-bold uppercase font-sans tracking-wider text-[#1a1a1a]/60">
                  Interactive Saxophone Sandbox
                </span>
              </div>

              <p className="text-xs text-[#1a1a1a]/70 leading-relaxed bg-[#fdfcfb] p-4 rounded-xl border border-[#1a1a1a]/10 font-sans">
                In this Sandbox mode, you can click on individual keys directly on the Saxophone diagram to turn them on or off. The system will live-calculate if your pressed combination matches a real saxophone note!
              </p>

              <div className="bg-[#f4f2ee] rounded-2xl border border-[#1a1a1a]/10 p-5 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-sans uppercase text-[#1a1a1a]/50 tracking-wider">Live Analyzer Status</span>
                  <button
                    onClick={() => { setSandboxKeys([]); }}
                    className="text-[10px] text-rose-600 hover:text-rose-700 font-sans font-bold flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Clear All Keys</span>
                  </button>
                </div>

                {/* Match Result Display */}
                {sandboxMatch ? (
                  <div className="flex items-center justify-between gap-4 bg-[#c5a059]/10 border border-[#c5a059]/20 p-4 rounded-xl">
                    <div>
                      <div className="text-[10px] uppercase font-mono text-[#1a1a1a]/50">Matches Note</div>
                      <div className="text-2xl font-serif font-extrabold text-[#c5a059] mt-1">{sandboxMatch.writtenName}</div>
                      <div className="text-xs text-[#1a1a1a]/70 mt-1 font-sans">Fingering type: <strong className="text-[#1a1a1a]/80 font-bold">{sandboxFingeringName}</strong></div>
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                      <button
                        onClick={() => handlePlayNote(sandboxMatch)}
                        className="bg-[#1a1a1a] hover:bg-[#333333] text-white font-extrabold text-xs px-5 py-2.5 rounded-full transition"
                      >
                        Play Note
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-4 bg-[#fdfcfb] border border-[#1a1a1a]/10 p-4 rounded-xl">
                    <div>
                      <div className="text-[10px] uppercase font-mono text-[#1a1a1a]/50 font-medium">Analyzer Output</div>
                      <div className="text-base font-bold text-[#1a1a1a]/70 mt-1 font-sans">No Standard Match</div>
                      <div className="text-xs text-[#1a1a1a]/50 mt-1 font-sans">
                        {sandboxKeys.length === 0 ? "All keys open (Sounds written C♯5)" : "Unknown / Multi-phonics combination"}
                      </div>
                    </div>
                    {sandboxKeys.length === 0 && (
                      <button
                        onClick={() => {
                          const openNote = notesList.find(n => n.id === "C#5");
                          if (openNote) handlePlayNote(openNote);
                        }}
                        className="bg-[#1a1a1a] hover:bg-[#333333] text-white font-extrabold text-xs px-4 py-2 rounded-full transition font-sans"
                      >
                        Play Open C♯
                      </button>
                    )}
                  </div>
                )}

                {/* Active pressed keys tags */}
                <div>
                  <span className="text-[10px] uppercase font-mono text-[#1a1a1a]/50">Currently Pressed ({sandboxKeys.length})</span>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {sandboxKeys.length === 0 ? (
                      <span className="text-xs text-[#1a1a1a]/40 italic font-sans">None. All toneholes open.</span>
                    ) : (
                      sandboxKeys.map(k => {
                        const keyDetail = saxKeysConfig.find(sc => sc.id === k);
                        return (
                          <button
                            key={k}
                            onClick={() => handleKeyToggle(k)}
                            className="bg-[#1a1a1a]/10 hover:bg-[#1a1a1a]/20 border border-[#1a1a1a]/10 text-[#1a1a1a] hover:text-rose-700 px-3 py-1 rounded-full text-[10px] font-sans font-bold transition flex items-center gap-1.5"
                          >
                            <span>{keyDetail?.name || k}</span>
                            <span>×</span>
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Right Column (Detailed Saxophone Visual Key Chart SVG) */}
        <div className="lg:col-span-5 bg-white border border-[#1a1a1a]/10 rounded-3xl p-6 shadow-sm flex flex-col items-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-[#c5a059]/5 via-transparent to-transparent opacity-50 pointer-events-none" />

          {/* Heading */}
          <div className="w-full border-b border-[#1a1a1a]/10 pb-4 mb-4 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs font-bold font-sans text-[#1a1a1a]/60 uppercase tracking-wider">
                Saxophone Key Visualizer
              </span>
              <span className="text-[10px] text-[#1a1a1a]/40 mt-0.5 font-sans">
                {appMode === 'learn' && "Displaying standard key chart"}
                {appMode === 'quiz' && quizType === 'sight-reading' && "Click keys to enter fingering"}
                {appMode === 'quiz' && quizType === 'fingering' && "Guess this note"}
                {appMode === 'sandbox' && "Click keys to build fingering"}
              </span>
            </div>

            {/* Status light */}
            <div className="flex items-center gap-1.5 bg-[#f4f2ee] border border-[#1a1a1a]/10 px-2.5 py-1 rounded-full text-[10px] font-mono text-[#1a1a1a]/60">
              <span className={`w-2 h-2 rounded-full ${appMode === 'sandbox' ? 'bg-[#c5a059] animate-pulse' : 'bg-[#c5a059]'}`} />
              <span className="uppercase">{appMode}</span>
            </div>
          </div>

          {/* Key Tooltip Indicator */}
          <div className="w-full bg-[#f4f2ee] p-3 rounded-2xl border border-[#1a1a1a]/10 text-center min-h-[48px] mb-4 flex flex-col justify-center transition-all">
            {hoveredKey ? (
              <>
                <span className="text-xs font-bold text-[#c5a059]">{hoveredKey.name}</span>
                <span className="text-[9px] font-sans text-[#1a1a1a]/50 uppercase mt-0.5">{hoveredKey.tooltip}</span>
              </>
            ) : (
              <span className="text-xs text-[#1a1a1a]/40 font-sans italic">Hover over any key on the sax to inspect</span>
            )}
          </div>

          {/* DETAILED HIGH-FIDELITY VECTOR SAXOPHONE SVG */}
          <div className="relative bg-[#fdfcfb] border border-[#1a1a1a]/10 p-5 rounded-2xl w-full max-w-[280px] flex justify-center shadow-inner">
            <svg 
              viewBox="0 0 180 500" 
              className="w-full max-h-[580px]"
            >
              <defs>
                {/* Metallic Gold Gradient for Body */}
                <linearGradient id="saxBody" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#e3c084" />
                  <stop offset="50%" stopColor="#c5a059" />
                  <stop offset="100%" stopColor="#8c6c30" />
                </linearGradient>

                {/* Mother of pearl button keys gradient */}
                <radialGradient id="pearl" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="60%" stopColor="#fbfaf8" />
                  <stop offset="100%" stopColor="#e6e2da" />
                </radialGradient>

                {/* Pressed active glowing keys gradient */}
                <radialGradient id="activeKey" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#ffd700" />
                  <stop offset="60%" stopColor="#c5a059" />
                  <stop offset="100%" stopColor="#7c5f24" />
                </radialGradient>
                
                {/* Active glow filter */}
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* STYLIZED BRASS BODY TUBE */}
              <rect x="90" y="50" width="20" height="400" rx="4" fill="url(#saxBody)" stroke="#8c6c30" strokeWidth="1.5" />
              <rect x="86" y="45" width="28" height="12" rx="2" fill="#8c6c30" opacity="0.3" />
              <rect x="88" y="225" width="24" height="6" rx="1" fill="#8c6c30" opacity="0.3" />
              
              {/* SAX BELL (At bottom) */}
              <path d="M 90 400 Q 90 470, 150 460 Q 170 410, 120 380 Z" fill="url(#saxBody)" stroke="#8c6c30" strokeWidth="2" />
              <circle cx="132" cy="425" r="14" fill="#8c6c30" stroke="#c5a059" strokeWidth="2" />

              {/* RENDER DYNAMIC KEYS */}
              {saxKeysConfig.map((key) => {
                // Determine if key is active/pressed
                let isActive = false;
                if (appMode === "learn") {
                  isActive = activeFingering.keys.includes(key.id);
                } else if (appMode === "quiz" && quizType === "sight-reading") {
                  isActive = userQuizKeys.includes(key.id);
                } else if (appMode === "quiz" && quizType === "fingering") {
                  isActive = quizFingering.keys.includes(key.id);
                } else if (appMode === "sandbox") {
                  isActive = sandboxKeys.includes(key.id);
                }

                const isInteractive = appMode === "sandbox" || (appMode === "quiz" && quizType === "sight-reading" && !quizAnswerChecked);

                // Styling options
                const fillStyle = isActive 
                  ? "url(#activeKey)" 
                  : key.group === "lh" || key.group === "rh" ? "url(#pearl)" : "#e6e2da";
                
                const strokeStyle = isActive ? "#1a1a1a" : "#cbd5e1";
                const strokeWidth = isActive ? "2.5" : "1.5";
                const filterStyle = isActive ? "url(#glow)" : undefined;

                return (
                  <g 
                    key={key.id}
                    className={`${isInteractive ? 'cursor-pointer hover:brightness-105 transition' : ''}`}
                    onClick={() => handleKeyToggle(key.id)}
                    onMouseEnter={() => setHoveredKey(key)}
                    onMouseLeave={() => setHoveredKey(null)}
                  >
                    {/* Render circle key if properties exist, else custom path */}
                    {key.cx !== undefined && key.cy !== undefined && key.r !== undefined ? (
                      <circle 
                        cx={key.cx} 
                        cy={key.cy} 
                        r={key.r} 
                        fill={fillStyle} 
                        stroke={strokeStyle} 
                        strokeWidth={strokeWidth}
                        filter={filterStyle}
                      />
                    ) : (
                      <path 
                        d={key.d} 
                        fill={fillStyle} 
                        stroke={strokeStyle} 
                        strokeWidth={strokeWidth}
                        filter={filterStyle}
                      />
                    )}

                    {/* Label Overlay */}
                    <text 
                      x={key.cx ?? getPathCentroid(key.d).x} 
                      y={key.cy ?? getPathCentroid(key.d).y}
                      fill={isActive ? "#ffffff" : "#1a1a1a"} 
                      fontSize="9" 
                      fontWeight="bold" 
                      textAnchor="middle" 
                      alignmentBaseline="middle"
                      className="pointer-events-none select-none font-sans"
                    >
                      {key.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Quick Cheat Reference for physical side keys */}
          <div className="w-full mt-4 bg-[#fdfcfb] p-4 rounded-2xl border border-[#1a1a1a]/10 text-[10px] font-sans text-[#1a1a1a]/60 leading-relaxed">
            <h4 className="font-extrabold text-[#c5a059] mb-2 uppercase text-center tracking-wide">Key Reference Table</h4>
            <div className="grid grid-cols-2 gap-2">
              <div><strong className="text-[#1a1a1a]/80 font-bold">OK:</strong> Octave (Left Thumb)</div>
              <div><strong className="text-[#1a1a1a]/80 font-bold">1, 2, 3:</strong> Left Index, Mid, Ring</div>
              <div><strong className="text-[#1a1a1a]/80 font-bold">4, 5, 6:</strong> Right Index, Mid, Ring</div>
              <div><strong className="text-[#1a1a1a]/80 font-bold">D, E♭, F:</strong> High Register LH Palms</div>
              <div><strong className="text-[#1a1a1a]/80 font-bold">S1, S2, S3:</strong> Side keys (RH Index)</div>
              <div><strong className="text-[#1a1a1a]/80 font-bold">F-F:</strong> Front F key (Altissimo entry)</div>
            </div>
          </div>
        </div>

      </main>

      {/* Styled Footer */}
      <footer className="border-t border-[#1a1a1a]/10 bg-[#f4f2ee] py-8 text-center text-xs text-[#1a1a1a]/50 font-sans mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <span>Alto Saxophone Fingering Guide & Sight-Reading Academy</span>
          <span className="flex items-center gap-1.5 justify-center">
            <span>Powered by</span>
            <span className="text-[#c5a059] font-bold bg-[#c5a059]/10 px-2.5 py-0.5 rounded-full border border-[#c5a059]/20 font-sans">Google AI Studio</span>
          </span>
        </div>
      </footer>
    </div>
  );
}

// Utility to find coarse center of a simple path for text labels
function getPathCentroid(pathStr?: string): { x: number; y: number } {
  if (!pathStr) return { x: 100, y: 250 };
  
  // Custom lookup based on known coordinates
  if (pathStr.includes("ok")) return { x: 60, y: 110 };
  if (pathStr.includes("palm_d")) return { x: 58, y: 118 };
  if (pathStr.includes("palm_eb")) return { x: 58, y: 148 };
  if (pathStr.includes("palm_f")) return { x: 58, y: 178 };

  if (pathStr.includes("pinky_g_sharp")) return { x: 68, y: 221 };
  if (pathStr.includes("pinky_cs")) return { x: 50, y: 226 };
  if (pathStr.includes("pinky_b")) return { x: 68, y: 236 };
  if (pathStr.includes("pinky_bb")) return { x: 68, y: 251 };

  if (pathStr.includes("side_e")) return { x: 135, y: 268 };
  if (pathStr.includes("side_c")) return { x: 135, y: 298 };
  if (pathStr.includes("side_bb")) return { x: 135, y: 328 };
  if (pathStr.includes("side_f_sharp")) return { x: 135, y: 356 };

  if (pathStr.includes("pinky_eb")) return { x: 132, y: 388 };
  if (pathStr.includes("pinky_c")) return { x: 132, y: 413 };

  if (pathStr.includes("high_f_sharp")) return { x: 132, y: 441 };

  return { x: 100, y: 250 };
}
