# Interactive Saxophone Fingering Chart & Melody Sequencer

An elegant, highly interactive full-stack React and Tailwind application that visualizes saxophone fingering patterns across all registers, supports sound synthesis, and features a step-by-step melody sequencer.

## Key Features

- **Saxophone Fingering Visualizer**: Interactive key layout for alto, tenor, soprano, and baritone saxophones. Select notes to see exactly which keys to press.
- **Classic Saxophone Synthesizer**: Reedy, rich audio synthesizer built with the Web Audio API, configured with classical vibrato (~5.6 Hz) to replicate authentic tone.
- **Melody Sequencer (Composition Mode)**:
  - Compose custom melodies by appending and modifying notes, **inserting notes and rests** directly at any selected index with custom offsets, and clicking any note to **play it back instantly as an audio preview**.
  - **Semitone Micro-Transposition**: Fine-tune individual pitches on-the-fly with precise **up and down semitone transposition buttons** right next to the selected note details display.
  - **Global Key Signature Transposition**: Instantly transpose your entire melody to any of the major/minor key signatures. The sequencer automatically calculates the shortest musical interval (e.g. perfect fourth or fifth), shifts all pitches chromatic-wise to fit the new key center, updates the staff representation, and keeps your fingerings aligned.
  - **Global Chromatic Shifter**: Fine-tune or change the register of the entire melody instantly with quick **Shift +1** and **Shift -1** semitone buttons.
  - **Intuitive Note Editor Layout**: The editing note panel is positioned immediately below the sequencer staff, placing all modifiers, pitch shifters, and duration triggers right at your fingertips.
  - **Dynamic Auto-Scrolling Playhead**: The sequencer automatically scrolls horizontally to keep the active playhead or selected note centered in view for seamless playback tracking.
  - Choose from legendary preloaded saxophone solos: **Baker Street** (D Major) and **Careless Whisper** (D Minor), alongside classic exercises.
  - **Durable Local Storage Persistence**: Save your custom-composed melodies with a custom name, along with their selected **key signature** and **instrument transposition**, and reload or delete them across browser sessions.
  - **XML Melody Import & Export**: Export your composed masterpieces to beautifully formatted, structured XML files and import them back with zero data loss. Rests, durations, ties, tempo, time signature, and key signature are fully preserved!
  - **Time Signatures & Measures**: Support for **4/4**, **3/4**, **2/4**, and **6/8** with automatic bar lines and measure number indicators (e.g. `m.1`, `m.2`) drawn dynamically on the staff.
  - **Comprehensive Note Durations**: Support for Whole (`1/1`), Half (`1/2`), Quarter (`1/4`), Eighth (`1/8`), and **Sixteenth (`1/16`)** notes with standard musical notation rendering.
  - **Rest Notes**: Support for inserting rest notes of any duration, rendered using traditional rest glyphs, which suppress synthesizer output automatically during playback.
  - **Ties & Legato**: Connect consecutive notes with tie curves to sustain sounds without retriggering the note attacks, allowing smooth phrasing.
  - **Start/Stop Controls**: Fully functional start and stop buttons with dynamic active playhead visual tracking.
  - Keyboard shortcuts (Spacebar) to easily start and stop melody playback.
- **Key Signatures & Transposition Support**: Concert pitch and written transposition modes configured for Eb and Bb saxophone keys.

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Open [http://localhost:3000](http://localhost:3000) to view the app in your browser.
