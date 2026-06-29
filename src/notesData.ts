export interface Fingering {
  name: string; // "Standard", "Bis", "Side", "1-and-1", "Front"
  keys: string[]; // List of active keys
  description?: string; // Optional helpful description
}

export interface NoteInfo {
  id: string; // e.g. "Bb3"
  writtenName: string; // e.g. "B♭"
  writtenNameSharp: string; // e.g. "A♯"
  octave: number; // e.g. 3, 4, 5, 6
  semitonesFromC4: number; // C4 is 0, Bb3 is -2, B3 is -1, etc.
  frequency: number; // Written pitch frequency
  concertPitch: string; // e.g. "D♭3"
  register: 'low' | 'middle' | 'high' | 'altissimo';
  staffOffset: number; // Treble clef staff line offset. B4 is 0. C5 is 1, A4 is -1. Half steps on the staff.
  // Note: staffOffset is measured in staff steps.
  // G4 is -2 (second line), A4 is -1 (second space), B4 is 0 (third line), C5 is 1 (third space), D5 is 2 (fourth line) etc.
  // Since sharps and flats share staff lines with natural notes, we base staffOffset on the letter name.
  accidentals?: 'flat' | 'sharp' | 'none';
  fingerings: Fingering[];
}

// Map written semitones to standard names and frequencies
// Written C4 (Middle C) = semitones 0.
// Standard Sax range: Bb3 (semitone -2) to F#6 (semitone 30).
// Altissimo goes higher: G6 (31), G#6 (32), A6 (33).
export const notesList: NoteInfo[] = [
  {
    id: "Bb3",
    writtenName: "B♭3",
    writtenNameSharp: "A♯3",
    octave: 3,
    semitonesFromC4: -2,
    frequency: 233.08,
    concertPitch: "D♭3",
    register: "low",
    staffOffset: -7, // D4 is -5, C4 is -6, B3 is -7
    accidentals: "flat",
    fingerings: [
      {
        name: "Standard",
        keys: ["lh1", "lh2", "lh3", "rh4", "rh5", "rh6", "pinky_bb", "pinky_c"],
        description: "The lowest standard note on the alto saxophone. Requires good air support and a relaxed embouchure."
      }
    ]
  },
  {
    id: "B3",
    writtenName: "B3",
    writtenNameSharp: "B3",
    octave: 3,
    semitonesFromC4: -1,
    frequency: 246.94,
    concertPitch: "D3",
    register: "low",
    staffOffset: -7,
    accidentals: "none",
    fingerings: [
      {
        name: "Standard",
        keys: ["lh1", "lh2", "lh3", "rh4", "rh5", "rh6", "pinky_b", "pinky_c"],
        description: "Standard low B fingering. Uses the outer low B roller key on the left hand pinky table."
      }
    ]
  },
  {
    id: "C4",
    writtenName: "C4",
    writtenNameSharp: "C4",
    octave: 4,
    semitonesFromC4: 0,
    frequency: 261.63,
    concertPitch: "E♭3",
    register: "low",
    staffOffset: -6, // ledger line below staff
    accidentals: "none",
    fingerings: [
      {
        name: "Standard",
        keys: ["lh1", "lh2", "lh3", "rh4", "rh5", "rh6", "pinky_c"],
        description: "Standard low C. Uses the bottom key on the right-hand pinky table."
      }
    ]
  },
  {
    id: "C#4",
    writtenName: "D♭4",
    writtenNameSharp: "C♯4",
    octave: 4,
    semitonesFromC4: 1,
    frequency: 277.18,
    concertPitch: "E3",
    register: "low",
    staffOffset: -6,
    accidentals: "sharp",
    fingerings: [
      {
        name: "Standard",
        keys: ["lh1", "lh2", "lh3", "rh4", "rh5", "rh6", "pinky_cs"],
        description: "Standard low C#. Uses the inner-upper key on the left hand pinky table."
      }
    ]
  },
  {
    id: "D4",
    writtenName: "D4",
    writtenNameSharp: "D4",
    octave: 4,
    semitonesFromC4: 2,
    frequency: 293.66,
    concertPitch: "F3",
    register: "low",
    staffOffset: -5, // hangs just below staff
    accidentals: "none",
    fingerings: [
      {
        name: "Standard",
        keys: ["lh1", "lh2", "lh3", "rh4", "rh5", "rh6"],
        description: "Standard low D. All six main finger keys are closed."
      }
    ]
  },
  {
    id: "D#4",
    writtenName: "E♭4",
    writtenNameSharp: "D♯4",
    octave: 4,
    semitonesFromC4: 3,
    frequency: 311.13,
    concertPitch: "F♯3",
    register: "low",
    staffOffset: -4, // first line of staff (E) with flat, or D with sharp. Let's place it on line E (offset -4)
    accidentals: "flat",
    fingerings: [
      {
        name: "Standard",
        keys: ["lh1", "lh2", "lh3", "rh4", "rh5", "rh6", "pinky_eb"],
        description: "Standard low Eb. Press the top key of the right-hand pinky table."
      }
    ]
  },
  {
    id: "E4",
    writtenName: "E4",
    writtenNameSharp: "E4",
    octave: 4,
    semitonesFromC4: 4,
    frequency: 329.63,
    concertPitch: "G3",
    register: "low",
    staffOffset: -4, // first line
    accidentals: "none",
    fingerings: [
      {
        name: "Standard",
        keys: ["lh1", "lh2", "lh3", "rh4", "rh5"],
        description: "Standard E4. LH 1-2-3 and RH 4-5 are closed."
      }
    ]
  },
  {
    id: "F4",
    writtenName: "F4",
    writtenNameSharp: "F4",
    octave: 4,
    semitonesFromC4: 5,
    frequency: 349.23,
    concertPitch: "A♭3",
    register: "low",
    staffOffset: -3, // first space
    accidentals: "none",
    fingerings: [
      {
        name: "Standard",
        keys: ["lh1", "lh2", "lh3", "rh4"],
        description: "Standard F4. LH 1-2-3 and RH 4 are closed."
      }
    ]
  },
  {
    id: "F#4",
    writtenName: "G♭4",
    writtenNameSharp: "F♯4",
    octave: 4,
    semitonesFromC4: 6,
    frequency: 369.99,
    concertPitch: "A3",
    register: "low",
    staffOffset: -3,
    accidentals: "sharp",
    fingerings: [
      {
        name: "Standard",
        keys: ["lh1", "lh2", "lh3", "rh5"],
        description: "Standard F# fingering. LH 1-2-3 and RH 5 (middle finger) are closed. RH 4 remains open."
      },
      {
        name: "Alternate (Trill)",
        keys: ["lh1", "lh2", "lh3", "rh4", "side_f_sharp"],
        description: "Trill fingering. Play F4 and press the side high F# key with the side of your right index finger."
      }
    ]
  },
  {
    id: "G4",
    writtenName: "G4",
    writtenNameSharp: "G4",
    octave: 4,
    semitonesFromC4: 7,
    frequency: 392.00,
    concertPitch: "B♭3",
    register: "low",
    staffOffset: -2, // second line
    accidentals: "none",
    fingerings: [
      {
        name: "Standard",
        keys: ["lh1", "lh2", "lh3"],
        description: "Standard G4. LH 1-2-3 are closed."
      }
    ]
  },
  {
    id: "G#4",
    writtenName: "A♭4",
    writtenNameSharp: "G♯4",
    octave: 4,
    semitonesFromC4: 8,
    frequency: 415.30,
    concertPitch: "B3",
    register: "low",
    staffOffset: -2,
    accidentals: "sharp",
    fingerings: [
      {
        name: "Standard",
        keys: ["lh1", "lh2", "lh3", "pinky_g_sharp"],
        description: "Standard G#4. Add the G# pinky key to the standard G4 fingering."
      }
    ]
  },
  {
    id: "A4",
    writtenName: "A4",
    writtenNameSharp: "A4",
    octave: 4,
    semitonesFromC4: 9,
    frequency: 440.00,
    concertPitch: "C4",
    register: "low",
    staffOffset: -1, // second space
    accidentals: "none",
    fingerings: [
      {
        name: "Standard",
        keys: ["lh1", "lh2"],
        description: "Standard A4. LH 1 and 2 are closed."
      }
    ]
  },
  {
    id: "A#4",
    writtenName: "B♭4",
    writtenNameSharp: "A♯4",
    octave: 4,
    semitonesFromC4: 10,
    frequency: 466.16,
    concertPitch: "D♭4",
    register: "low",
    staffOffset: -1,
    accidentals: "flat",
    fingerings: [
      {
        name: "Bis",
        keys: ["lh1", "bis"],
        description: "Bis Bb fingering. The most common and fluid fingering for scale passages. Slide your index finger down to cover both LH1 and the tiny Bis key."
      },
      {
        name: "Side Key",
        keys: ["lh1", "lh2", "side_bb"],
        description: "Side Bb fingering. Excellent for chromatic passages. Play A4 and press the bottom side key (Side Bb) with the side of your right index finger."
      },
      {
        name: "1-and-1",
        keys: ["lh1", "rh4"],
        description: "1-and-1 Bb fingering. An alternative useful for trills or leaps. Play B4 with left hand, and press RH 4 (index finger)."
      }
    ]
  },
  {
    id: "B4",
    writtenName: "B4",
    writtenNameSharp: "B4",
    octave: 4,
    semitonesFromC4: 11,
    frequency: 493.88,
    concertPitch: "D4",
    register: "low",
    staffOffset: 0, // third (middle) line
    accidentals: "none",
    fingerings: [
      {
        name: "Standard",
        keys: ["lh1"],
        description: "Standard B4. Only LH 1 is closed."
      }
    ]
  },
  {
    id: "C5",
    writtenName: "C5",
    writtenNameSharp: "C5",
    octave: 5,
    semitonesFromC4: 12,
    frequency: 523.25,
    concertPitch: "E♭4",
    register: "middle",
    staffOffset: 1, // third space
    accidentals: "none",
    fingerings: [
      {
        name: "Standard",
        keys: ["lh2"],
        description: "Standard middle C. Only LH 2 is closed."
      }
    ]
  },
  {
    id: "C#5",
    writtenName: "D♭5",
    writtenNameSharp: "C♯5",
    octave: 5,
    semitonesFromC4: 13,
    frequency: 554.37,
    concertPitch: "E4",
    register: "middle",
    staffOffset: 1,
    accidentals: "sharp",
    fingerings: [
      {
        name: "Open (Standard)",
        keys: [],
        description: "All finger keys open. Let the air flow freely! This note can sound slightly stuffy; support with consistent air pressure."
      }
    ]
  },
  {
    id: "D5",
    writtenName: "D5",
    writtenNameSharp: "D5",
    octave: 5,
    semitonesFromC4: 14,
    frequency: 587.33,
    concertPitch: "F4",
    register: "middle",
    staffOffset: 2, // fourth line
    accidentals: "none",
    fingerings: [
      {
        name: "Standard",
        keys: ["ok", "lh1", "lh2", "lh3", "rh4", "rh5", "rh6"],
        description: "Middle D. Uses the octave key on the back with your left thumb. All six main finger keys closed."
      }
    ]
  },
  {
    id: "D#5",
    writtenName: "E♭5",
    writtenNameSharp: "D♯5",
    octave: 5,
    semitonesFromC4: 15,
    frequency: 622.25,
    concertPitch: "F♯4",
    register: "middle",
    staffOffset: 3, // fourth space
    accidentals: "flat",
    fingerings: [
      {
        name: "Standard",
        keys: ["ok", "lh1", "lh2", "lh3", "rh4", "rh5", "rh6", "pinky_eb"],
        description: "Middle Eb. Octave key + low Eb fingering."
      }
    ]
  },
  {
    id: "E5",
    writtenName: "E5",
    writtenNameSharp: "E5",
    octave: 5,
    semitonesFromC4: 16,
    frequency: 659.25,
    concertPitch: "G4",
    register: "middle",
    staffOffset: 3,
    accidentals: "none",
    fingerings: [
      {
        name: "Standard",
        keys: ["ok", "lh1", "lh2", "lh3", "rh4", "rh5"],
        description: "Middle E. Octave key + low E fingering."
      }
    ]
  },
  {
    id: "F5",
    writtenName: "F5",
    writtenNameSharp: "F5",
    octave: 5,
    semitonesFromC4: 17,
    frequency: 698.46,
    concertPitch: "A♭4",
    register: "middle",
    staffOffset: 4, // fifth line
    accidentals: "none",
    fingerings: [
      {
        name: "Standard",
        keys: ["ok", "lh1", "lh2", "lh3", "rh4"],
        description: "Middle F. Octave key + low F fingering."
      }
    ]
  },
  {
    id: "F#5",
    writtenName: "G♭5",
    writtenNameSharp: "F♯5",
    octave: 5,
    semitonesFromC4: 18,
    frequency: 739.99,
    concertPitch: "A4",
    register: "middle",
    staffOffset: 4,
    accidentals: "sharp",
    fingerings: [
      {
        name: "Standard",
        keys: ["ok", "lh1", "lh2", "lh3", "rh5"],
        description: "Middle F#. Octave key + low F# standard fingering."
      },
      {
        name: "Alternate (Trill)",
        keys: ["ok", "lh1", "lh2", "lh3", "rh4", "side_f_sharp"],
        description: "Middle F# trill. Octave key + low F# alternate trill fingering."
      }
    ]
  },
  {
    id: "G5",
    writtenName: "G5",
    writtenNameSharp: "G5",
    octave: 5,
    semitonesFromC4: 19,
    frequency: 783.99,
    concertPitch: "B♭4",
    register: "middle",
    staffOffset: 5, // space above staff
    accidentals: "none",
    fingerings: [
      {
        name: "Standard",
        keys: ["ok", "lh1", "lh2", "lh3"],
        description: "Middle G. Octave key + standard G fingering."
      }
    ]
  },
  {
    id: "G#5",
    writtenName: "A♭5",
    writtenNameSharp: "G♯5",
    octave: 5,
    semitonesFromC4: 20,
    frequency: 830.61,
    concertPitch: "B4",
    register: "middle",
    staffOffset: 5,
    accidentals: "sharp",
    fingerings: [
      {
        name: "Standard",
        keys: ["ok", "lh1", "lh2", "lh3", "pinky_g_sharp"],
        description: "Middle G#. Octave key + standard G# fingering."
      }
    ]
  },
  {
    id: "A5",
    writtenName: "A5",
    writtenNameSharp: "A5",
    octave: 5,
    semitonesFromC4: 21,
    frequency: 880.00,
    concertPitch: "C5",
    register: "middle",
    staffOffset: 6, // 1 ledger line above staff
    accidentals: "none",
    fingerings: [
      {
        name: "Standard",
        keys: ["ok", "lh1", "lh2"],
        description: "Middle A. Octave key + standard A fingering."
      }
    ]
  },
  {
    id: "A#5",
    writtenName: "B♭5",
    writtenNameSharp: "A♯5",
    octave: 5,
    semitonesFromC4: 22,
    frequency: 932.33,
    concertPitch: "D♭5",
    register: "middle",
    staffOffset: 6,
    accidentals: "flat",
    fingerings: [
      {
        name: "Bis",
        keys: ["ok", "lh1", "bis"],
        description: "Octave key + Bis Bb fingering. Excellent for rapid upper-register scales."
      },
      {
        name: "Side Key",
        keys: ["ok", "lh1", "lh2", "side_bb"],
        description: "Octave key + A5 with Side Bb key. The clearest, most resonant Bb in the upper register."
      },
      {
        name: "1-and-1",
        keys: ["ok", "lh1", "rh4"],
        description: "Octave key + 1-and-1 Bb alternate fingering."
      }
    ]
  },
  {
    id: "B5",
    writtenName: "B5",
    writtenNameSharp: "B5",
    octave: 5,
    semitonesFromC4: 23,
    frequency: 987.77,
    concertPitch: "D5",
    register: "middle",
    staffOffset: 7, // 1 ledger line above staff
    accidentals: "none",
    fingerings: [
      {
        name: "Standard",
        keys: ["ok", "lh1"],
        description: "Middle B. Octave key + standard B fingering."
      }
    ]
  },
  {
    id: "C6",
    writtenName: "C6",
    writtenNameSharp: "C6",
    octave: 6,
    semitonesFromC4: 24,
    frequency: 1046.50,
    concertPitch: "E♭5",
    register: "high",
    staffOffset: 8, // 2 ledger lines above
    accidentals: "none",
    fingerings: [
      {
        name: "Standard",
        keys: ["ok", "lh2"],
        description: "High C. Octave key + middle C fingering."
      }
    ]
  },
  {
    id: "C#6",
    writtenName: "D♭6",
    writtenNameSharp: "C♯6",
    octave: 6,
    semitonesFromC4: 25,
    frequency: 1109.73,
    concertPitch: "E5",
    register: "high",
    staffOffset: 8,
    accidentals: "sharp",
    fingerings: [
      {
        name: "Standard",
        keys: ["ok"],
        description: "High C#. Played with only the Octave key pressed. All main finger keys are open."
      }
    ]
  },
  {
    id: "D6",
    writtenName: "D6",
    writtenNameSharp: "D6",
    octave: 6,
    semitonesFromC4: 26,
    frequency: 1174.66,
    concertPitch: "F5",
    register: "high",
    staffOffset: 9, // 2 ledger lines above
    accidentals: "none",
    fingerings: [
      {
        name: "Standard",
        keys: ["ok", "palm_d"],
        description: "High D palm key fingering. Press the octave key and the High D palm key (topmost palm key) with your left index finger knuckle."
      }
    ]
  },
  {
    id: "D#6",
    writtenName: "E♭6",
    writtenNameSharp: "D♯6",
    octave: 6,
    semitonesFromC4: 27,
    frequency: 1244.51,
    concertPitch: "F♯5",
    register: "high",
    staffOffset: 10, // 3 ledger lines above
    accidentals: "flat",
    fingerings: [
      {
        name: "Standard",
        keys: ["ok", "palm_d", "palm_eb"],
        description: "High Eb palm fingering. Press octave key, High D palm key, and the middle High Eb palm key."
      }
    ]
  },
  {
    id: "E6",
    writtenName: "E6",
    writtenNameSharp: "E6",
    octave: 6,
    semitonesFromC4: 28,
    frequency: 1318.51,
    concertPitch: "G5",
    register: "high",
    staffOffset: 10,
    accidentals: "none",
    fingerings: [
      {
        name: "Standard",
        keys: ["ok", "palm_d", "palm_eb", "side_e"],
        description: "High E standard. Press octave key, High D, High Eb palm keys, and the top side key (Side E) with your right index finger side."
      },
      {
        name: "Front E (Alt)",
        keys: ["ok", "front_f", "lh1", "lh2", "rh5"],
        description: "Front E alternate. A highly useful alternative in lyrical passages to avoid clumsy palm-key jumps. Press octave key, the Front F key (above LH1), LH 1 & 2, and RH 5."
      }
    ]
  },
  {
    id: "F6",
    writtenName: "F6",
    writtenNameSharp: "F6",
    octave: 6,
    semitonesFromC4: 29,
    frequency: 1396.91,
    concertPitch: "A♭5",
    register: "high",
    staffOffset: 11, // 3 ledger lines above
    accidentals: "none",
    fingerings: [
      {
        name: "Standard (Palm)",
        keys: ["ok", "palm_d", "palm_eb", "palm_f", "side_e"],
        description: "High F standard palm fingering. Add the High F palm key (lower palm key operated by LH ring knuckle) to the High E fingering."
      },
      {
        name: "Front F (Alt)",
        keys: ["ok", "front_f", "lh1", "lh2", "lh3"],
        description: "Front F. Extremely fluid alternate for jumping to High F. Press octave key, Front F key, and LH 1, 2, and 3."
      }
    ]
  },
  {
    id: "F#6",
    writtenName: "G♭6",
    writtenNameSharp: "F♯6",
    octave: 6,
    semitonesFromC4: 30,
    frequency: 1479.98,
    concertPitch: "A5",
    register: "high",
    staffOffset: 11,
    accidentals: "sharp",
    fingerings: [
      {
        name: "High F# Key",
        keys: ["ok", "palm_d", "palm_eb", "side_e", "high_f_sharp"],
        description: "Standard High F# on modern saxophones equipped with a high F# key. Press octave key, High D & Eb palm keys, Side E key, and the side High F# key."
      },
      {
        name: "Front F# (Alt)",
        keys: ["ok", "front_f", "lh1", "lh2", "lh3", "side_bb", "side_f_sharp"],
        description: "Front F# alternate. Great for saxophones without a high F# key, or for scale flow. Octave + Front F + LH1-2-3 + Side Bb + Side trill F#."
      }
    ]
  },
  {
    id: "G6",
    writtenName: "G6",
    writtenNameSharp: "G6",
    octave: 6,
    semitonesFromC4: 31,
    frequency: 1567.98,
    concertPitch: "B♭5",
    register: "altissimo",
    staffOffset: 12, // 4 ledger lines above
    accidentals: "none",
    fingerings: [
      {
        name: "Front G",
        keys: ["ok", "front_f", "lh1", "lh3", "side_bb"],
        description: "Altissimo G. One of the easiest altissimo entries. Octave key + Front F + LH1 + LH3 + Side Bb key."
      },
      {
        name: "Standard Altissimo",
        keys: ["ok", "lh1", "lh3", "rh4", "pinky_eb"],
        description: "Standard Altissimo G fingering. LH 1 & 3, RH 4 & Eb pinky, plus octave key. Highly stable pitch."
      }
    ]
  },
  {
    id: "G#6",
    writtenName: "A♭6",
    writtenNameSharp: "G♯6",
    octave: 6,
    semitonesFromC4: 32,
    frequency: 1661.22,
    concertPitch: "B5",
    register: "altissimo",
    staffOffset: 12,
    accidentals: "sharp",
    fingerings: [
      {
        name: "Altissimo G#",
        keys: ["ok", "lh1", "lh3", "pinky_g_sharp"],
        description: "Altissimo G#. Octave key + LH 1 & 3, plus Left Pinky G# key. Requires centered air speed and flexible throat voicing."
      }
    ]
  },
  {
    id: "A6",
    writtenName: "A6",
    writtenNameSharp: "A6",
    octave: 6,
    semitonesFromC4: 33,
    frequency: 1760.00,
    concertPitch: "C6",
    register: "altissimo",
    staffOffset: 13, // 5 ledger lines above
    accidentals: "none",
    fingerings: [
      {
        name: "Standard Altissimo A",
        keys: ["ok", "lh2", "lh3", "rh4", "rh5"],
        description: "Altissimo A. Octave key + LH 2 & 3 (LH1 open!) + RH 4 & 5. Voicing requires high arched tongue."
      }
    ]
  }
];
