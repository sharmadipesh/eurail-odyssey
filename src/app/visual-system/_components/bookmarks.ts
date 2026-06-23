// Bookmark chip sets shown in each section's Head, keyed by chapter group.
// The first entry is the group label (rendered darkest); the chapters that
// follow shade progressively lighter across the row.
export const BOOKMARKS = {
  visual: [
    "VISUAL SYSTEM",
    "Introduction",
    "Core Visual Pillars",
    "Core Combinations",
    "Phased Planning",
  ],
  art: [
    "ART DIRECTION",
    "The Window",
    "The In-Between",
    "Trains",
    "City Chapters",
    "The Local Effect",
    "Unguarded",
    "Encounter",
    "Light",
    "Fragments",
    "The Belonging",
    "The Origin",
  ],
  graphics: ["GRAPHICS", "Moodboard", "Molecular Route", "Motion Graphics"],
} as const;

export type BookmarkGroup = keyof typeof BOOKMARKS;
