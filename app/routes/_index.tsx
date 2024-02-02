import type { MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { register } from "~/api/auth";

export const meta: MetaFunction = () => {
  return [
    { title: "Genre Expositor" },
    { name: "description", content: "Drill down into your spotify genres" },
  ];
};

export async function loader() {
  return await register();
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
