export const searchTypes = ["artist", "album", "track"] as const;
export type SearchType = (typeof searchTypes)[number];
