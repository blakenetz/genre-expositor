import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getUser } from "~/api/spotifyAuth";

export const meta: MetaFunction = () => {
  return [
    { title: "Genre Expositor" },
    { name: "description", content: "Drill down into your spotify genres" },
  ];
};

export async function loader({
  request,
}: LoaderFunctionArgs) {
  const user = await getUser(request);
  console.log({ user })
  return json({});
}

export default function Index() {
  // Get the data from the Loader function
  const res = useLoaderData<typeof loader>();
  console.log({ res })

  return (
    <main>
      <h1>Genre Expositor</h1>
    </main>
  );
}
