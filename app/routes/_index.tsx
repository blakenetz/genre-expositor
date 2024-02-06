import { Container } from "@mantine/core";
import type { ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import { json, useLoaderData } from "@remix-run/react";
import { register } from "~/api/auth.server";
import Form, { action as formAction } from "~/components/Form";

export async function action(args: ActionFunctionArgs) {
  return await formAction(args);
}

export async function loader() {
  await register();
  return json({ ok: true });
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
