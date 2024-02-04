/**
 * Sourced from spotify
 * @see https://developer.spotify.com/documentation/web-api/tutorials/client-credentials-flow
 */

import singleton, { SpotifyResponse } from "~/utils/singleton.server";

const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } = process.env;

const spotifyAuthUrl = "https://accounts.spotify.com/api/token";
const authBuffer = Buffer.from(
  [SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET].join(":")
);
const headers = new Headers({
  "Content-Type": "application/x-www-form-urlencoded",
  Authorization: "Basic " + authBuffer.toString("base64"),
});

async function handleResponse(response: Promise<Response>) {
  const resolved: SpotifyResponse = await Promise.resolve(response)
    .then((res) => res.json())
    .catch((err) => console.error("🪇 Error", err));

  // ruh roh
  if (!resolved) return false;

  singleton.setUser(resolved);

  return true;
}

async function fetchToken() {
  console.log("🪇 Fetching token");
  const init: RequestInit = {
    method: "POST",
    body: new URLSearchParams({ grant_type: "client_credentials" }),
    headers,
  };

  const res = fetch(spotifyAuthUrl, init);

  return await handleResponse(res);
}

async function refreshToken(token: string) {
  console.log("🪇 Refreshing token");
  const init: RequestInit = {
    method: "POST",
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: token,
    }),
    headers,
  };

  const res = fetch(spotifyAuthUrl, init);

  return await handleResponse(res);
}

async function validateToken() {
  if (!singleton.user) return false;

  if (singleton.user.expires > Date.now()) {
    return await refreshToken(singleton.user.token);
  }

  return true;
}

export async function register(): Promise<boolean> {
  const isTokenValid = await validateToken();
  // token is valid, return early
  if (isTokenValid) return true;

  return await fetchToken();
}

export async function getToken(): Promise<string> {
  const isValid = await validateToken();
  if (!isValid) {
    await fetchToken();
  }
  return singleton.user!.token;
}
