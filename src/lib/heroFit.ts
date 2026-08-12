/**
 * Where one sequence frame is painted inside the hero canvas.
 *
 * A single rule covers every viewport: the frame always spans the full canvas
 * width, and its height follows from its own aspect ratio.
 *
 *   - On a landscape viewport wider than the frame — which every non-fullscreen
 *     desktop window on a 16:9 monitor is, because browser chrome eats height
 *     and not width — the frame overflows vertically and is centre-cropped, so
 *     it fills edge to edge exactly as it does in F11. This is the case that
 *     used to letterbox: contain-fitting a 16:9 frame into a 2.02:1 window left
 *     ~118px of flat burgundy down each side, and pressing F11 restored a true
 *     16:9 viewport and made the bars vanish.
 *
 *   - On a viewport taller than the frame — portrait phones — the frame falls
 *     short instead and is letterboxed vertically, seated higher to leave room
 *     for the hero copy. That is the behaviour that was already here and is
 *     deliberately identical: at these aspect ratios width-locked scaling and
 *     the old contain scaling are the same number.
 *
 * The two cases meet continuously at the frame's own aspect ratio, so there is
 * no jump as a window is dragged across 16:9.
 *
 * Everything here is in CSS pixels. The canvas context is transformed into CSS
 * pixels before drawing, so devicePixelRatio never enters this calculation and
 * a scale can never be applied twice.
 */
export type FrameFit = {
  /** Left edge of the drawn frame, in CSS px. Always 0: the frame spans the width. */
  dx: number;
  /** Top edge, in CSS px. Negative when the frame is cropped. */
  dy: number;
  /** Drawn width, in CSS px. Always the canvas width. */
  dw: number;
  /** Drawn height, in CSS px. */
  dh: number;
};

export function fitFrame(
  frameW: number,
  frameH: number,
  canvasW: number,
  canvasH: number,
): FrameFit {
  const dw = canvasW;
  const dh = frameH * (canvasW / frameW);

  // Positive slack: the frame is shorter than the canvas and will be
  // letterboxed. Negative slack: it overflows and will be cropped.
  const slack = canvasH - dh;

  // Portrait only. The 16:9 band is short there and the hero copy below it is
  // taller than the space a dead-centre band would leave, so reserve the lower
  // area and centre the frame in what remains. The frame is never scaled or
  // cropped for this — only seated higher. Cannot engage while slack <= 0, so
  // landscape cropping stays exactly centred.
  const reserve = slack > dh * 0.9 ? Math.min(slack, canvasH * 0.46) : 0;

  return { dx: 0, dy: (slack - reserve) / 2, dw, dh };
}
