import { LoaderFunction, json } from "@remix-run/node";
import {
  getRecommendation,
  validateAndExtract,
} from "~/api/recommendation.server";

export const loader: LoaderFunction = async ({ request, params }) => {
  const { searchParams } = new URL(request.url);
  const { data, errors } = validateAndExtract(searchParams);
  const response = await getRecommendation(data.genre);

  return json(response);
};
