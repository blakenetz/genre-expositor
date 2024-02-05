import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { search, validateAndExtract } from "~/api/spotify";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { searchParams } = new URL(request.url);
  const { data, errors } = validateAndExtract(searchParams);

  const response = await search(data);
  console.log(response);
  return response;
}

export default function Results() {
  const data = useLoaderData<typeof loader>();

  return <p>hi</p>;
}
