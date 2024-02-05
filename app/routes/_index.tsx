import { Container } from "@mantine/core";
import type { ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { register } from "~/api/auth";
import Form, { action as formAction } from "~/components/Form/Form";

export const meta: MetaFunction = () => {
  return [
    { title: "Genre Expositor" },
    { name: "description", content: "Drill down into your spotify genres" },
  ];
};

export async function action(args: ActionFunctionArgs) {
  return await formAction(args);
}

export async function loader() {
  return await register();
}

export default function Index() {
  useLoaderData<typeof loader>();

  return (
    <Container component="main" size="md">
      <h1>Genre Expositor</h1>
      <Form />
    </Container>
  );
}
