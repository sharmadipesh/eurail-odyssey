// One-video-at-a-time guard for the Visual System hover previews.
//
// Every tile's hover handler plays through `playSingle` instead of calling
// `video.play()` directly. Before starting a new clip we pause whichever clip
// this helper last started, so the page never decodes more than one video — or
// plays more than one audio track — at the same time, even when the pointer
// races across a dense collage.
let current: HTMLVideoElement | null = null;

/** Play `video`, pausing the previously started one. Returns play()'s promise. */
export function playSingle(video: HTMLVideoElement): Promise<void> {
  if (current && current !== video) current.pause();
  current = video;
  return video.play();
}
