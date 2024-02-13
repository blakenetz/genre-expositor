import {
  RecommendationSeed,
  RecommendationsResponse,
} from "@spotify/web-api-ts-sdk";
import { getToken } from "./auth.server";
import { isObjectEmpty, validateString } from "~/utils";

type Data = { genre: string };
type Error = { genre?: string };

function extract(searchParams: URLSearchParams) {
  const genre = searchParams.get("genre") as string;

  return { genre };
}

function validate({ genre }: Data): Error | void {
  const errors: Error = {};

  const error = validateString(genre);
  if (error) errors.genre = error;

  if (!isObjectEmpty(errors)) return errors;
}

export function validateAndExtract(obj: URLSearchParams) {
  const data = extract(obj);
  const errors = validate(data);

  return {
    errors,
    data,
  };
}

export async function getRecommendation(genre: string) {
  const token = await getToken();

  const headers = new Headers({
    "Content-Type": "application/x-www-form-urlencoded",
    Authorization: token,
  });

  const init: RequestInit = {
    method: "GET",
    headers,
  };

  const params = new URLSearchParams({ seed_genres: genre, market: "US" });

  const response = await fetch(
    `https://api.spotify.com/v1/recommendations?${params}`,
    init
  );

  const data: RecommendationsResponse = await response.json();

  return data.tracks;
}
