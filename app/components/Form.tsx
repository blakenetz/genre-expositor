import { Button, Flex, Paper, Radio, TextInput } from "@mantine/core";
import { useInputState, useToggle } from "@mantine/hooks";
import type { ActionFunctionArgs } from "@remix-run/node";
import {
  Form as RemixForm,
  json,
  redirect,
  useActionData,
  useNavigation,
} from "@remix-run/react";
import { SearchType, searchTypes } from "~/api/spotify";
import { validateAndExtract } from "~/api/search.server";
import styles from "~/styles/form.module.css";
import { capitalize } from "~/utils";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  const { errors, data } = validateAndExtract(formData);
  if (errors) return json({ errors });

  return redirect("/results?" + new URLSearchParams(data));
}

export default function Form() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();

  const [query, setQuery] = useInputState("");
  const [type, setType] = useToggle<SearchType>(["artist", "album", "track"]);

  const isLoading = navigation.formAction === "/results";
  return (
    <Paper
      component={RemixForm}
      method="post"
      className={styles.form}
      shadow="md"
    >
      <Flex gap="lg">
        <TextInput
          className={styles.textInput}
          label={`Query ${capitalize(type)}`}
          variant="filled"
          name="query"
          value={query}
          onChange={setQuery}
          error={actionData?.errors.query}
          placeholder={actionData?.errors.query}
        />

        <Radio.Group
          className={styles.radioGroup}
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
      <Button type="submit" loading={isLoading} className={styles.submitButton}>
        Submit
      </Button>
    </Paper>
  );
}
