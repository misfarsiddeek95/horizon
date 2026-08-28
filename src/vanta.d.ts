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
