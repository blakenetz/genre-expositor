import { LoaderFunctionArgs } from "@remix-run/node";
// import { useLoaderData } from "@remix-run/react";

import { search } from "~/api/spotify";

export async function loader({ request }: LoaderFunctionArgs) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");
  const type = searchParams.get("type");
  // const {}
  // const data = await search({ query, type });
  console.log(data);
}

export default function Results() {
  // const data = useLoaderData<typeof loader>();

  return <p>hi</p>;
}
