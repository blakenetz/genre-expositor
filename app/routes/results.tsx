import { LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import {
  search,
  validateAndExtract,
  Results as ResultData,
} from "~/api/search.server";
import ExactMatch from "~/components/ExactMatch";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { searchParams } = new URL(request.url);
  const { data, errors } = validateAndExtract(searchParams);

  if (errors) {
    console.error("🪇 Errors: ", errors);
    redirect("/");
  }

  const response = await search(data);
  return response;
}

export default function Results() {
  const data = useLoaderData<typeof loader>();

  switch (data.status) {
    case "exact-match":
      return <ExactMatch item={data.items[0]} />;
  }

  return (
    <p>
      Sorry! This app only supports exact matches at the moment. Please try
      again or{" "}
      <a
        href="https://github.com/blakenetz/genre-expositor/pulls"
        target="_blank"
        ref="noopener noreferrer"
      >
        submit a PR!
      </a>
    </p>
  );
}
