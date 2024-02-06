import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import {
  search,
  validateAndExtract,
  Results as ResultData,
} from "~/api/spotify.server";
import ExactMatch from "~/components/ExactMatch";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { searchParams } = new URL(request.url);
  const { data, errors } = validateAndExtract(searchParams);

  const response = await search(data);
  console.log(response);
  return response;
}

export default function Results() {
  const data: ResultData = useLoaderData<typeof loader>();

  switch (data.status) {
    case "exact-match":
      return <ExactMatch item={data.items[0]} />;
  }

  return <p>hi</p>;
}
