// Web Audio horror synthesizer for Death Note atmosphere
class HorrorAudioEngine {
  private ctx: AudioContext | null = null;
  public isMuted: boolean = false;
  private droneGain: GainNode | null = null;
  private isDroneRunning: boolean = false;

  private initCtx() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.isMuted && this.droneGain && this.ctx) {
      this.droneGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.1);
    } else if (!this.isMuted && this.droneGain && this.ctx) {
      this.droneGain.gain.setTargetAtTime(0.04, this.ctx.currentTime, 0.5);
    }
    return this.isMuted;
  }

  // Start very quiet ominous background drone
  public startAmbientDrone() {
    if (this.isDroneRunning) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      this.isDroneRunning = true;
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      this.droneGain = this.ctx.createGain();

      osc1.type = "sawtooth";
      osc1.frequency.setValueAtTime(55, this.ctx.currentTime); // A1 note

      osc2.type = "sine";
      osc2.frequency.setValueAtTime(53.8, this.ctx.currentTime); // dissonant beating

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(140, this.ctx.currentTime);

      this.droneGain.gain.setValueAtTime(this.isMuted ? 0 : 0.035, this.ctx.currentTime);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(this.droneGain);
      this.droneGain.connect(this.ctx.destination);

      osc1.start();
      osc2.start();
    } catch (e) {
      console.warn("Ambient audio unable to auto-start:", e);
    }
  }

  // Sound of quill pen rapidly scratching the Death Note paper
  public playPenScratch() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const bufferSize = this.ctx.sampleRate * 0.45;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);

      // Generate bursty scratch noise
      for (let i = 0; i < bufferSize; i++) {
        const env = Math.sin((i / bufferSize) * Math.PI);
        const scratchPulsing = Math.sin(i * 0.08) > 0.3 ? 1 : 0.1;
        data[i] = (Math.random() * 2 - 1) * env * scratchPulsing;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(2400, this.ctx.currentTime);
      filter.Q.setValueAtTime(3.5, this.ctx.currentTime);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.44);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start();
    } catch (e) {
      // ignore
    }
  }

  // Deep, physiological heartbeat thump-thump
  public playHeartbeat(intensity: number = 1) {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const playThump = (timeOffset: number, freq: number, gainVal: number) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + timeOffset);
        osc.frequency.exponentialRampToValueAtTime(32, now + timeOffset + 0.14);

        gain.gain.setValueAtTime(0.001, now + timeOffset);
        gain.gain.linearRampToValueAtTime(gainVal * Math.min(intensity, 1.8), now + timeOffset + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + timeOffset + 0.16);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + timeOffset);
        osc.stop(now + timeOffset + 0.18);
      };

      // Lub-Dub double thump
      playThump(0, 68, 0.28);
      playThump(0.12, 58, 0.22);
    } catch (e) {
      // ignore
    }
  }

  // Shinigami Death Gong / Flatline when countdown reaches zero
  public playGongOfDeath() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      // Low bell/chime
      const freqs = [110, 164.8, 220, 311.1]; // Dissonant Diminished Chord
      freqs.forEach((freq) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.2);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 3.2);
      });
    } catch (e) {
      // ignore
    }
  }

  // Horror screen glitch noise
  public playHorrorGlitch() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.linearRampToValueAtTime(900, now + 0.08);
      osc.frequency.setValueAtTime(80, now + 0.1);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.2);
    } catch (e) {
      // ignore
    }
  }

  // 1. TERRIFYING WITCH SHRIEK (Chudail ki bhayanak cheekh)
  // Plays on website opening / enter, piercing, multi-formant horrifying female scream
  public playWitchScream() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const duration = 2.8;

      // Master scream gain
      const screamMaster = this.ctx.createGain();
      screamMaster.gain.setValueAtTime(0.001, now);
      screamMaster.gain.linearRampToValueAtTime(0.44, now + 0.08); // Sharp sudden scream onset
      screamMaster.gain.setValueAtTime(0.40, now + 0.9);
      screamMaster.gain.exponentialRampToValueAtTime(0.001, now + duration);
      screamMaster.connect(this.ctx.destination);

      // Primary screaming vocal cords (descending pitch from 2400Hz down to 800Hz)
      const oscVocal1 = this.ctx.createOscillator();
      oscVocal1.type = "sawtooth";
      oscVocal1.frequency.setValueAtTime(1950, now);
      oscVocal1.frequency.exponentialRampToValueAtTime(2600, now + 0.25);
      oscVocal1.frequency.exponentialRampToValueAtTime(1400, now + 1.2);
      oscVocal1.frequency.exponentialRampToValueAtTime(650, now + duration);

      // Secondary dissonant shriek (tritone interval creating horror tension)
      const oscVocal2 = this.ctx.createOscillator();
      oscVocal2.type = "sawtooth";
      oscVocal2.frequency.setValueAtTime(2050, now);
      oscVocal2.frequency.exponentialRampToValueAtTime(2720, now + 0.3);
      oscVocal2.frequency.exponentialRampToValueAtTime(1480, now + 1.25);
      oscVocal2.frequency.exponentialRampToValueAtTime(680, now + duration);

      // Intense pitch vibrato (screaming vocal cord shudder at 22Hz)
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.frequency.setValueAtTime(22, now);
      lfoGain.gain.setValueAtTime(120, now);
      lfo.connect(lfoGain);
      lfoGain.connect(oscVocal1.frequency);
      lfoGain.connect(oscVocal2.frequency);
      lfo.start(now);
      lfo.stop(now + duration);

      // Vocal Tract Formant 1 (Screaming human throat resonance: 1050 Hz)
      const formant1 = this.ctx.createBiquadFilter();
      formant1.type = "bandpass";
      formant1.frequency.setValueAtTime(1050, now);
      formant1.Q.setValueAtTime(4.0, now);

      // Vocal Tract Formant 2 (High piercing nasal shriek: 2900 Hz)
      const formant2 = this.ctx.createBiquadFilter();
      formant2.type = "bandpass";
      formant2.frequency.setValueAtTime(2900, now);
      formant2.Q.setValueAtTime(5.5, now);

      // White noise breath / raspy screech component
      const bufferSize = Math.floor(this.ctx.sampleRate * duration);
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const noiseData = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        const env = Math.sin((i / bufferSize) * Math.PI);
        noiseData[i] = (Math.random() * 2 - 1) * env * (Math.random() > 0.6 ? 1.4 : 0.4);
      }
      const noiseSource = this.ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;

      const noiseFilter = this.ctx.createBiquadFilter();
      noiseFilter.type = "bandpass";
      noiseFilter.frequency.setValueAtTime(3200, now);
      noiseFilter.frequency.linearRampToValueAtTime(1800, now + duration);
      noiseFilter.Q.setValueAtTime(3.0, now);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.24, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      noiseSource.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(screamMaster);

      // Connect vocal oscillators through formant filters
      oscVocal1.connect(formant1);
      oscVocal2.connect(formant1);
      formant1.connect(screamMaster);

      oscVocal1.connect(formant2);
      oscVocal2.connect(formant2);
      formant2.connect(screamMaster);

      oscVocal1.start(now);
      oscVocal2.start(now);
      noiseSource.start(now);

      oscVocal1.stop(now + duration);
      oscVocal2.stop(now + duration);
      noiseSource.stop(now + duration);
    } catch (e) {
      console.warn("Witch scream audio error:", e);
    }
  }

  // 2. DEMONIC / GROTESQUE NAME INSCRIPTION SOUND (Badi gandi darawani aawaz)
  // Triggers when user enters/types someone's name into the bottom search bar
  public playDemonicNameInscription() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const duration = 1.6;

      const masterGain = this.ctx.createGain();
      masterGain.gain.setValueAtTime(0.001, now);
      masterGain.gain.linearRampToValueAtTime(0.38, now + 0.05);
      masterGain.gain.exponentialRampToValueAtTime(0.001, now + duration);
      masterGain.connect(this.ctx.destination);

      // Deep guttural demon growl (low frequency sawtooth)
      const demonGrowl = this.ctx.createOscillator();
      demonGrowl.type = "sawtooth";
      demonGrowl.frequency.setValueAtTime(68, now);
      demonGrowl.frequency.linearRampToValueAtTime(42, now + duration);

      // Ring modulation carrier for filthy, eerie demonic rasp
      const ringMod = this.ctx.createOscillator();
      ringMod.type = "sawtooth";
      ringMod.frequency.setValueAtTime(144, now);
      ringMod.frequency.linearRampToValueAtTime(88, now + duration);

      const ringModGain = this.ctx.createGain();
      ringModGain.gain.setValueAtTime(0.4, now);

      ringMod.connect(ringModGain.gain);
      demonGrowl.connect(ringModGain);

      // Dark lowpass filter for chest rumble
      const lowFilter = this.ctx.createBiquadFilter();
      lowFilter.type = "lowpass";
      lowFilter.frequency.setValueAtTime(480, now);
      lowFilter.frequency.exponentialRampToValueAtTime(120, now + duration);

      ringModGain.connect(lowFilter);
      lowFilter.connect(masterGain);

      // Horrifying reverse demonic whisper/scratch overlay
      const bufferSize = Math.floor(this.ctx.sampleRate * duration);
      const whisperBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const whisperData = whisperBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        const flutter = Math.sin(i * 0.035) * Math.cos(i * 0.009);
        whisperData[i] = (Math.random() * 2 - 1) * flutter * 0.7;
      }
      const whisperSource = this.ctx.createBufferSource();
      whisperSource.buffer = whisperBuffer;

      const whisperFilter = this.ctx.createBiquadFilter();
      whisperFilter.type = "bandpass";
      whisperFilter.frequency.setValueAtTime(1800, now);
      whisperFilter.frequency.linearRampToValueAtTime(850, now + duration);
      whisperFilter.Q.setValueAtTime(4.0, now);

      const whisperGain = this.ctx.createGain();
      whisperGain.gain.setValueAtTime(0.3, now);
      whisperGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      whisperSource.connect(whisperFilter);
      whisperFilter.connect(whisperGain);
      whisperGain.connect(masterGain);

      demonGrowl.start(now);
      ringMod.start(now);
      whisperSource.start(now);

      demonGrowl.stop(now + duration);
      ringMod.stop(now + duration);
      whisperSource.stop(now + duration);
    } catch (e) {
      console.warn("Demonic sound error:", e);
    }
  }

  // SUBTLE DISTORTED SHINIGAMI WHISPER (Shinigami ki sargoshi / Target Acknowledgement)
  // Simulates Ryuk / the Shinigami whispering right into the user's ear as the name is submitted
  public playShinigamiWhisperAcknowledgement(targetName?: string) {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const duration = 2.4;

      // Master subtle whisper gain
      const whisperMaster = this.ctx.createGain();
      whisperMaster.gain.setValueAtTime(0.001, now);
      whisperMaster.gain.linearRampToValueAtTime(0.24, now + 0.15); // Subtle, intimate, not deafening
      whisperMaster.gain.setValueAtTime(0.22, now + 1.2);
      whisperMaster.gain.exponentialRampToValueAtTime(0.001, now + duration);
      whisperMaster.connect(this.ctx.destination);

      // 1. Spectral White/Pink Distorted Breath Noise with syllabic modulation
      const bufferSize = Math.floor(this.ctx.sampleRate * duration);
      const breathBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const breathData = breathBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        // Pink-ish noise filter
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        const pink = b0 + b1 + b2 + white * 0.5362;

        // Human whispered speech cadence: 5-7 Hz rhythm
        const timeSec = i / this.ctx.sampleRate;
        const cadence = (Math.sin(timeSec * 32) * 0.5 + 0.5) * (Math.sin(timeSec * 9) * 0.5 + 0.5);
        breathData[i] = pink * (0.3 + 0.7 * cadence);
      }

      const breathSource = this.ctx.createBufferSource();
      breathSource.buffer = breathBuffer;

      // Double formant filter to mimic ghostly whispered vocal tract (Ryuk's breath)
      const formantF1 = this.ctx.createBiquadFilter();
      formantF1.type = "bandpass";
      formantF1.frequency.setValueAtTime(1650, now);
      formantF1.frequency.exponentialRampToValueAtTime(950, now + duration);
      formantF1.Q.setValueAtTime(5.5, now);

      const formantF2 = this.ctx.createBiquadFilter();
      formantF2.type = "bandpass";
      formantF2.frequency.setValueAtTime(2600, now);
      formantF2.frequency.exponentialRampToValueAtTime(1400, now + duration);
      formantF2.Q.setValueAtTime(6.0, now);

      // Waveshaper for subtle demonic rasp and dry distortion
      const distCurve = new Float32Array(256);
      for (let i = 0; i < 256; i++) {
        const x = (i * 2) / 256 - 1;
        distCurve[i] = Math.tanh(x * 2.8);
      }
      const distortion = this.ctx.createWaveShaper();
      distortion.curve = distCurve;

      breathSource.connect(formantF1);
      breathSource.connect(formantF2);
      formantF1.connect(distortion);
      formantF2.connect(distortion);
      distortion.connect(whisperMaster);

      // 2. Sub-bass presence (Death God aura)
      const subRumble = this.ctx.createOscillator();
      subRumble.type = "sine";
      subRumble.frequency.setValueAtTime(52, now);
      subRumble.frequency.linearRampToValueAtTime(38, now + duration);

      const subGain = this.ctx.createGain();
      subGain.gain.setValueAtTime(0.001, now);
      subGain.gain.linearRampToValueAtTime(0.18, now + 0.2);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      subRumble.connect(subGain);
      subGain.connect(whisperMaster);

      breathSource.start(now);
      subRumble.start(now);

      breathSource.stop(now + duration);
      subRumble.stop(now + duration);

      // 3. Spoken subtle eerie distorted whisper via speech synthesis
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        try {
          const whispers = [
            "Target acknowledged... hehehe...",
            "Your sacrifice is marked...",
            "The name is written... it cannot be undone...",
            "Interesting... destiny is sealed...",
          ];
          const chosenWhisper = whispers[Math.floor(Math.random() * whispers.length)];
          const utterance = new SpeechSynthesisUtterance(chosenWhisper);
          utterance.rate = 0.82; // Slow, menacing whispered pace
          utterance.pitch = 0.55; // Low, distorted Shinigami pitch
          utterance.volume = 0.38; // Subtle, ghostly whisper level

          const voices = window.speechSynthesis.getVoices();
          if (voices.length > 0) {
            const whisperVoice =
              voices.find((v) => v.lang.startsWith("en") && (v.name.includes("Natural") || v.name.includes("Male") || v.name.includes("Online"))) ||
              voices.find((v) => v.lang.startsWith("en")) ||
              voices[0];
            if (whisperVoice) {
              utterance.voice = whisperVoice;
            }
          }
          window.speechSynthesis.speak(utterance);
        } catch {
          // ignore speech error
        }
      }
    } catch (e) {
      console.warn("Shinigami whisper audio error:", e);
    }
  }

  // 3. AGONIZING DEATH SCREAM (Dardnak cheekh aur tadap)
  // Triggers when target's countdown reaches 00:00 (death consummated)
  public playAgonizingDeathScream() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const duration = 3.6;

      const deathMaster = this.ctx.createGain();
      deathMaster.gain.setValueAtTime(0.001, now);
      deathMaster.gain.linearRampToValueAtTime(0.52, now + 0.12); // sudden agonizing burst
      deathMaster.gain.setValueAtTime(0.48, now + 1.2);
      deathMaster.gain.exponentialRampToValueAtTime(0.001, now + duration);
      deathMaster.connect(this.ctx.destination);

      // Agonized Human Vocal Cord 1 (Wailing scream)
      const screamOsc1 = this.ctx.createOscillator();
      screamOsc1.type = "sawtooth";
      screamOsc1.frequency.setValueAtTime(440, now); // A4
      screamOsc1.frequency.exponentialRampToValueAtTime(920, now + 0.4); // Screaming up in pain
      screamOsc1.frequency.linearRampToValueAtTime(740, now + 1.5);
      screamOsc1.frequency.linearRampToValueAtTime(320, now + 2.8); // Choking dying pitch drop
      screamOsc1.frequency.linearRampToValueAtTime(110, now + duration);

      // Agonized Vocal Cord 2 (Dissonant minor 2nd clash for sheer agony)
      const screamOsc2 = this.ctx.createOscillator();
      screamOsc2.type = "sawtooth";
      screamOsc2.frequency.setValueAtTime(466, now); // Bb4 dissonant clash
      screamOsc2.frequency.exponentialRampToValueAtTime(975, now + 0.4);
      screamOsc2.frequency.linearRampToValueAtTime(790, now + 1.5);
      screamOsc2.frequency.linearRampToValueAtTime(340, now + 2.8);
      screamOsc2.frequency.linearRampToValueAtTime(115, now + duration);

      // Pain shuddering vibrato (rapid diaphragm spasm at 16Hz)
      const tremolo = this.ctx.createOscillator();
      const tremoloGain = this.ctx.createGain();
      tremolo.frequency.setValueAtTime(16, now);
      tremoloGain.gain.setValueAtTime(75, now);
      tremolo.connect(tremoloGain);
      tremoloGain.connect(screamOsc1.frequency);
      tremoloGain.connect(screamOsc2.frequency);
      tremolo.start(now);
      tremolo.stop(now + duration);

      // Human "AAAA-AAAAGH!" Formant Filters (F1: 750Hz, F2: 1400Hz, F3: 2500Hz)
      const formantA1 = this.ctx.createBiquadFilter();
      formantA1.type = "bandpass";
      formantA1.frequency.setValueAtTime(750, now);
      formantA1.Q.setValueAtTime(4.5, now);

      const formantA2 = this.ctx.createBiquadFilter();
      formantA2.type = "bandpass";
      formantA2.frequency.setValueAtTime(1450, now);
      formantA2.Q.setValueAtTime(5.0, now);

      const formantA3 = this.ctx.createBiquadFilter();
      formantA3.type = "bandpass";
      formantA3.frequency.setValueAtTime(2600, now);
      formantA3.Q.setValueAtTime(5.5, now);

      // Deep visceral chest pain groan oscillator (low gut-wrenching moans of dying human)
      const painMoanOsc = this.ctx.createOscillator();
      painMoanOsc.type = "sawtooth";
      painMoanOsc.frequency.setValueAtTime(180, now);
      painMoanOsc.frequency.exponentialRampToValueAtTime(320, now + 0.8);
      painMoanOsc.frequency.linearRampToValueAtTime(120, now + duration);

      const painMoanGain = this.ctx.createGain();
      painMoanGain.gain.setValueAtTime(0.35, now);
      painMoanGain.gain.exponentialRampToValueAtTime(0.01, now + duration);

      painMoanOsc.connect(painMoanGain);
      painMoanGain.connect(deathMaster);
      painMoanOsc.start(now);
      painMoanOsc.stop(now + duration);

      screamOsc1.connect(formantA1);
      screamOsc2.connect(formantA1);
      formantA1.connect(deathMaster);

      screamOsc1.connect(formantA2);
      screamOsc2.connect(formantA2);
      formantA2.connect(deathMaster);

      screamOsc1.connect(formantA3);
      screamOsc2.connect(formantA3);
      formantA3.connect(deathMaster);

      // Choking throat rattle / gasping noise burst as heartbeat stops
      const bufferLen = Math.floor(this.ctx.sampleRate * duration);
      const rattleBuffer = this.ctx.createBuffer(1, bufferLen, this.ctx.sampleRate);
      const rattleData = rattleBuffer.getChannelData(0);
      for (let i = 0; i < bufferLen; i++) {
        const t = i / this.ctx.sampleRate;
        // Spasmodic breathing gasps: rapid shivering inhalation
        const gaspPulse = Math.sin(t * 16) > 0.35 ? 1.0 : 0.2;
        rattleData[i] = (Math.random() * 2 - 1) * gaspPulse * 0.8;
      }
      const rattleSource = this.ctx.createBufferSource();
      rattleSource.buffer = rattleBuffer;

      const rattleFilter = this.ctx.createBiquadFilter();
      rattleFilter.type = "bandpass";
      rattleFilter.frequency.setValueAtTime(1100, now);
      rattleFilter.Q.setValueAtTime(3.0, now);

      const rattleGain = this.ctx.createGain();
      rattleGain.gain.setValueAtTime(0.38, now);
      rattleGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      rattleSource.connect(rattleFilter);
      rattleFilter.connect(rattleGain);
      rattleGain.connect(deathMaster);

      screamOsc1.start(now);
      screamOsc2.start(now);
      rattleSource.start(now);

      screamOsc1.stop(now + duration);
      screamOsc2.stop(now + duration);
      rattleSource.stop(now + duration);

      // Also trigger Shinigami low gong and cardiac flatline
      setTimeout(() => {
        this.playGongOfDeath();
        this.playCardiacFlatline();
      }, 1000);
    } catch (e) {
      console.warn("Agonizing death scream error:", e);
    }
  }

  // Realistic dying human cardiac flatline (ECG monitor dying tone)
  public playCardiacFlatline() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(880, now); // High pitch continuous ECG flatline tone

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.2, now + 0.05);
      gain.gain.setValueAtTime(0.2, now + 2.5);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.8);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 3.9);
    } catch (e) {
      // ignore
    }
  }

  // Real human agonizing dying voice (Insaan ki asli tadapti aur dard se cheekhti hui aawaz)
  // Plays pure acoustic physical agony scream, throat choking, and cardiac flatline
  public playRealHumanAgonyDyingVoice(victimName?: string) {
    if (this.isMuted) return;

    // Stop any pending speech voices
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // ignore
      }
    }

    // Play visceral physical agony groan, shrieking screams, throat choking & cardiac flatline
    this.playAgonizingDeathScream();
  }
}

export const horrorAudio = new HorrorAudioEngine();
