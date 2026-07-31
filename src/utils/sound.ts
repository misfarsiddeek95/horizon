const MUTE_KEY = 'horizon-puzzle-muted';

export function isMuted(): boolean {
  if (typeof window === 'undefined') return false;
  return window.localStorage.getItem(MUTE_KEY) === '1';
}

export function setMuted(value: boolean): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(MUTE_KEY, value ? '1' : '0');
}

let chime: HTMLAudioElement | null = null;

function getChime(): HTMLAudioElement | null {
  if (typeof window === 'undefined') return null;
  if (!chime) chime = new Audio('/sounds/badge-unlock.mp3');
  return chime;
}

export function playBadgeUnlockSound(): void {
  if (isMuted()) return;
  const audio = getChime();
  if (!audio) return;
  try {
    audio.currentTime = 0;
    void audio.play().catch(() => {});
  } catch {
    // Browser autoplay policy rejection — ignored intentionally.
  }
}
