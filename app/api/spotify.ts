import { isObjectEmpty } from "~/utils";
import { getToken } from "./auth";
import { SearchResults } from "@spotify/web-api-ts-sdk";

export const searchTypes = ["artist", "album", "track"] as const;
export type SearchType = (typeof searchTypes)[number];

type Item =
  | {
      artist: string;
      genres: string[];
      image: { url: string; width: number; height: number };
    }
  | {
      album: string;
      artist: string;
      genres: string[];
      image: { url: string; width: number; height: number };
    }
  | {
      track: string;
      album: string;
      artist: string;
      genres: string[];
      image: { url: string; width: number; height: number };
    };

export type Results = {
  status?: "exact-match" | "partial-match" | "no-results" | "error";
  items: Item[];
};

type Data = { query: string; type: SearchType };

type Error = {
  type?: string;
  query?: string;
};

const formatter = new Intl.ListFormat("en", {
  style: "long",
  type: "conjunction",
});

function extract(obj: FormData | URLSearchParams) {
  const type = obj.get("type") as SearchType;
  const query = obj.get("query") as string;

  return { type, query };
}

function validate({ query, type }: Data): Error | void {
  
  const errors: Error = {};

  // validate query
  if (typeof query !== "string") errors.query = `Invalid type: ${typeof query}`;
  else if (!query?.length) errors.query = "Required";

  // validate type
  if (typeof type !== "string") errors.type = `Invalid type: ${typeof type}`;
  else if (!searchTypes.includes(type)) errors.type = `Invalid option: ${type}`;

  if (!isObjectEmpty(errors)) return errors
}

export function validateAndExtract(obj: FormData | URLSearchParams) {
  const data = extract(obj);
  const errors = validate(data);

  return {
    errors,
    data,
  };
}

export async function search({ query, type }: Data): Promise<Results> {
  const token = await getToken();

  const headers = new Headers({
    "Content-Type": "application/x-www-form-urlencoded",
    Authorization: token,
  });

  const init: RequestInit = {
    method: "GET",
    headers,
  };

  const params = new URLSearchParams({ q: query, type, market: "US" });

  const response = await fetch(
    `https://api.spotify.com/v1/search?${params}`,
    init
  );

  const data: SearchResults<["artist", "album", "track"]> =
    await response.json();

  const results: Results = { items: [] };

  switch (type) {
    case "album":
      if (!data.albums.items.length) {
        results.status = "no-results";
      } else {
        results.items = data.albums.items.map((item) => ({
          album: item.name,
          artist: formatter.format(item.artists.map((a) => a.name)),
          image: item.images[0],
          genres: item.genres,
        }));
      }
      break;

    case "artist":
      if (!data.artists.items.length) {
        results.status = "no-results";
      } else {
        const exactMatch = data.artists.items.find(
          (item) => item.name.toLowerCase() === query
        );

        results.status = exactMatch ? "exact-match" : "partial-match";
        results.items = exactMatch
          ? [
              {
                artist: exactMatch.name,
                image: exactMatch.images[0],
                genres: exactMatch.genres,
              },
            ]
          : data.artists.items.map((item) => ({
              artist: item.name,
              image: item.images[0],
              genres: item.genres,
            }));
      }
      break;

    case "track":
      if (!data.tracks.items.length) {
        results.status = "no-results";
      } else {
        // results.items = data.tracks.items.map((item) => {
        //   const genres = new Set();
        //   item.artists.forEach((artist) =>
        //     artist.genres.forEach((g) => genres.add(g))
        //   );
        //   return {
        //     track: item.name,
        //     artist: formatter.format(item.artists.map((a) => a.name)),
        //     album: item.album.name,
        //     genres: genres,
        //     image: []
        //   };
        // });
      }
      break;
  }

  return results;
}
