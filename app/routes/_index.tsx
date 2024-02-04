import type { ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import { useLoaderData, useFetcher, json } from "@remix-run/react";
import { register } from "~/api/auth";

import { Button, Container, TextInput, Radio, Flex } from "@mantine/core";
import { capitalize } from "~/utils/format";
import { useInputState, useToggle } from "@mantine/hooks";
import { SearchType, search, searchTypes, validate } from "~/api/spotify";

export const meta: MetaFunction = () => {
  return [
    { title: "Genre Expositor" },
    { name: "description", content: "Drill down into your spotify genres" },
  ];
};

export async function loader() {
  return await register();
}

export async function action({ request }: ActionFunctionArgs) {
  console.log("inside action!");
  const formData = await request.formData();
  const validation = validate(formData);
  if (validation.status === "invalid") {
    return json({ ok: false });
  }

  const response = await search(validation.data);

  console.log(response);

  return json({ ok: true });
}

export default function Index() {
  // Get the data from the Loader function
  useLoaderData<typeof loader>();
  const fetcher = useFetcher();

  const isLoading = fetcher.state !== "idle";

  const [query, setQuery] = useInputState("");
  const [type, setType] = useToggle<SearchType>(["artist", "album", "track"]);

  return (
    <Container component="main" size="md">
      <h1>Genre Expositor</h1>
      <fetcher.Form method="post">
        <Flex gap="lg">
          <TextInput
            label={`Query ${capitalize(type)}`}
            variant="filled"
            name="query"
            value={query}
            onChange={setQuery}
          />

          <Radio.Group
            name="type"
            label="Search by"
            value={type}
            onChange={(val) => setType(val as SearchType)}
          >
            {searchTypes.map((val) => (
              <Radio value={val} label={capitalize(val)} key={val} />
            ))}
          </Radio.Group>
        </Flex>
        <Button
          type="submit"
          loading={isLoading}
          loaderProps={{ type: "bars" }}
        >
          Submit
        </Button>
      </fetcher.Form>
    </Container>
  );
}
