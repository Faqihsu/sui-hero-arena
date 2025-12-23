// Sound Effects Manager
export class SoundEffects {
  private static audioContext: AudioContext | null = null;

  static initAudioContext() {
    if (!this.audioContext && typeof window !== 'undefined') {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  // Play a simple beep sound
  static playBeep(frequency: number = 800, duration: number = 100) {
    this.initAudioContext();
    if (!this.audioContext) return;

    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    
    osc.connect(gain);
    gain.connect(this.audioContext.destination);
    
    osc.frequency.value = frequency;
    gain.gain.setValueAtTime(0.3, this.audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration / 1000);
    
    osc.start(this.audioContext.currentTime);
    osc.stop(this.audioContext.currentTime + duration / 1000);
  }

  // Battle hit sound
  static playHit() {
    this.playBeep(400, 80);
  }

  // Victory sound
  static playVictory() {
    this.initAudioContext();
    if (!this.audioContext) return;

    const frequencies = [523, 659, 784]; // C, E, G
    frequencies.forEach((freq, index) => {
      setTimeout(() => this.playBeep(freq, 150), index * 150);
    });
  }

  // Defeat sound
  static playDefeat() {
    this.playBeep(300, 300);
  }

  // Level up sound
  static playLevelUp() {
    this.initAudioContext();
    if (!this.audioContext) return;

    const frequencies = [440, 554, 659]; // A, C#, E
    frequencies.forEach((freq, index) => {
      setTimeout(() => this.playBeep(freq, 120), index * 120);
    });
  }

  // Click sound
  static playClick() {
    this.playBeep(600, 50);
  }

  // Success sound
  static playSuccess() {
    this.playBeep(800, 100);
    setTimeout(() => this.playBeep(1000, 100), 100);
  }

  // Error sound
  static playError() {
    this.playBeep(200, 150);
  }
}

export default SoundEffects;
