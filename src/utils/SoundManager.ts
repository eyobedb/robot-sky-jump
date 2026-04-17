import { Howl } from 'howler';

class SoundManager {
  private music: Howl;
  private sfx: Record<string, Howl>;
  private muted: boolean = false;

  constructor() {
    // Using free, reliable CDN links for audio
    this.music = new Howl({
      src: ['https://assets.mixkit.co/music/preview/mixkit-arcade-retro-changing-221.mp3'],
      loop: true,
      volume: 0.4,
      html5: true
    });

    this.sfx = {
      click: new Howl({ src: ['https://assets.mixkit.co/sfx/preview/mixkit-modern-technology-select-3124.mp3'], volume: 0.6 }),
      catch: new Howl({ src: ['https://assets.mixkit.co/sfx/preview/mixkit-arcade-game-jump-coin-216.mp3'], volume: 0.5 }),
      miss: new Howl({ src: ['https://assets.mixkit.co/sfx/preview/mixkit-falling-hit-on-slimy-surface-2521.mp3'], volume: 0.6 }),
      gameover: new Howl({ src: ['https://assets.mixkit.co/sfx/preview/mixkit-game-over-dark-orchestra-633.mp3'], volume: 0.7 })
    };
  }

  setMute(muted: boolean) {
    this.muted = muted;
    this.music.mute(muted);
    Object.values(this.sfx).forEach(s => s.mute(muted));
  }

  playMusic() {
    if (!this.music.playing() && !this.muted) {
      this.music.play();
    }
  }

  stopMusic() {
    this.music.stop();
  }

  playSFX(key: string) {
    if (this.sfx[key] && !this.muted) {
      this.sfx[key].play();
    }
  }
}

export const soundManager = new SoundManager();