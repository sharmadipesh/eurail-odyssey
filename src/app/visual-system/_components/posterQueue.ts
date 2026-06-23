// Concurrency-limited poster loader for SectionFour's moodboard.
//
// SectionFour's video tiles have no static poster image — their resting frame is
// seeked out of the video itself, which needs metadata loaded. Mounting all ~11
// tiles at once with preload="metadata" fires ~11 metadata fetches AND ~11 seek
// decodes simultaneously the instant the grid phase appears, spiking the main
// thread mid-scroll. This queue loads them a few at a time instead: each tile
// stays preload="none" until the queue pulls it, then we load metadata, seek to
// the poster frame, and release the slot for the next one.
const MAX = 3;
let active = 0;
const queue: Array<() => void> = [];

function pump() {
  while (active < MAX && queue.length) {
    active++;
    queue.shift()!();
  }
}

/**
 * Load `video`'s metadata and seek it to its poster frame, but no more than
 * `MAX` videos at a time across the whole moodboard. `seek` is the caller's
 * existing seek-to-poster routine, run once metadata is available.
 */
export function loadPoster(video: HTMLVideoElement, seek: () => void): void {
  queue.push(() => {
    const done = () => {
      active--;
      pump();
    };
    video.addEventListener("loadedmetadata", seek, { once: true });
    video.addEventListener("seeked", done, { once: true });
    video.addEventListener("error", done, { once: true });
    video.preload = "metadata";
    video.load();
  });
  pump();
}
