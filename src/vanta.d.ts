declare module 'vanta/dist/vanta.halo.min' {
  interface HaloOptions {
    THREE: typeof import('three');
    el: HTMLElement;
    mouseControls?: boolean;
    touchControls?: boolean;
    baseColor?: number;
    backgroundColor?: number;
    size?: number;
    [key: string]: unknown;
  }

  interface HaloEffect {
    destroy(): void;
    resize(): void;
  }

  function HALO(options: HaloOptions): HaloEffect;
  export default HALO;
}

declare module 'vanta/dist/vanta.net.min' {
  interface NetOptions {
    THREE: typeof import('three');
    el: HTMLElement;
    mouseControls?: boolean;
    touchControls?: boolean;
    gyroControls?: boolean;
    minHeight?: number;
    minWidth?: number;
    scale?: number;
    scaleMobile?: number;
    color?: number;
    backgroundColor?: number;
    points?: number;
    maxDistance?: number;
    spacing?: number;
    showDots?: boolean;
    [key: string]: unknown;
  }

  interface NetEffect {
    destroy(): void;
  }

  function NET(options: NetOptions): NetEffect;
  export default NET;
}

interface Window {
  THREE: typeof import('three');
}
