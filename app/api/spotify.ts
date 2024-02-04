import { getToken } from "./auth";

export const searchTypes = ["artist", "album", "track"] as const;
export type SearchType = (typeof searchTypes)[number];

type Data = { type: SearchType; query: string };
type ValidateReturn =
  | {
      status: "valid";
      data: Data;
    }
  | { status: "invalid" };
type Results = {
  status: "ok" | "no-results";
  items: {
    artist: string;
    album?: string;
    track?: string;
    genres: string[];
    image: { url: string; width: number; height: number };
  }[];
};

export function validate(formData: FormData): ValidateReturn {
  const type = formData.get("type") as SearchType | null;
  const query = formData.get("query") as string | null;

  if (typeof query !== "string" || typeof type !== "string")
    return { status: "invalid" };
  if (!query.length) return { status: "invalid" };
  if (!searchTypes.includes(type)) return { status: "invalid" };

  return { status: "valid", data: { type, query } };
}

export async function search({ type, query }: Data) {
  const token = await getToken();

  const headers = new Headers({
    "Content-Type": "application/x-www-form-urlencoded",
    Authorization: token,
  });

  const init: RequestInit = {
    method: "GET",
    body: new URLSearchParams({ q: query, type, market: "US" }),
    headers,
  };

  const response = await fetch("https://api.spotify.com/v1/search", init);
  const data = await response.json();

  const results: Results = { status: "ok", items: [] };

  switch (type) {
    case "album":
      break;
    case "artist":
      if (!data.artist.items.length) {
        results.status = "no-results";
      } else {
        results.items = data.artist.items.map((item) => ({
          artist: item.name,
          image: item.image,
        }));
      }
      break;
    case "track":
      break;
  }

  return results;
}
