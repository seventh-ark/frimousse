import { EMOJI_FONT_FAMILY } from "../constants";

let context: CanvasRenderingContext2D | null = null;

export function isEmojiSupported(emoji: string): boolean {
  try {
    context ??= document
      .createElement("canvas")
      .getContext("2d", { willReadFrequently: true });
    /* v8 ignore next */
  } catch {}

  // Non-browser environments are not supported
  if (!context) {
    return false;
  }

  // Schedule to dispose of the context
  queueMicrotask(() => {
    if (context) {
      context = null;
    }
  });

  context.canvas.width = 2;
  context.canvas.height = 2;
  context.font = `1px ${EMOJI_FONT_FAMILY}`;
  context.textBaseline = "top";

  // Unsupported ZWJ sequence emojis show up as separate emojis
  if (context.measureText(emoji).width >= 2) {
    return false;
  }

  context.fillStyle = "#00f";
  context.fillText(emoji, 0, 0);

  const blue = context.getImageData(0, 0, 1, 1).data.slice(0, 3).join(",");

  context.clearRect(0, 0, 1, 1);

  context.fillStyle = "#f00";
  context.fillText(emoji, 0, 0);

  const red = context.getImageData(0, 0, 1, 1).data.slice(0, 3).join(",");

  // Emojis have an immutable color so they should look the same regardless of the text color
  if (blue !== red) {
    return false;
  }

  return true;
}
