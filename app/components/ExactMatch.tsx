import { DonutChart, DonutChartCell } from "@mantine/charts";
import "@mantine/charts/styles.css";
import { Anchor, Badge, Container, Paper, Title } from "@mantine/core";
import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import { IconVinyl } from "@tabler/icons-react";
import { MouseEventHandler, useCallback } from "react";
import { Artist, Item } from "~/api/search.server";
import styles from "~/styles/artist.module.css";

function extractData(artist: Artist): DonutChartCell[] {
  const color =
    artist.popularity < 30
      ? "red.6"
      : artist.popularity > 75
      ? "green.6"
      : "yellow.6";

  return [
    { name: artist.name, value: artist.popularity, color },
    { name: artist.name, value: 180 - artist.popularity, color: "gray.6" },
  ];
}

export async function action({ params }: ActionFunctionArgs) {
  console.log(params);
}

export default function ExactMatch({ item }: { item: Item }) {
  const popularityData = extractData(item.artist);
  const fetcher = useFetcher();

  const handleClick = useCallback<MouseEventHandler<HTMLButtonElement>>((e) => {
    const { genre } = e.currentTarget.dataset;
    if (genre) {
      const search = new URLSearchParams({ genre }).toString();
      fetcher.load(`/recommendation?${search}`);
    }
  }, []);

  console.log(fetcher.data);

  return (
    <Container size="md">
      <Paper className={styles.root} component="section" shadow="md">
        <img
          src={item.image.url}
          alt={`${item.artist} profile picture on Spotify`}
          className={styles.img}
        />
        <div className={styles.content}>
          <section className={styles.flex}>
            <div>
              <Title order={2} className={styles.h2}>
                <IconVinyl /> {item.artist.name}
              </Title>
              <Anchor
                href={item.artist.spotifyUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Listen on Spotify
              </Anchor>
            </div>

            <div className={styles.chart}>
              <DonutChart
                data={popularityData}
                startAngle={180}
                endAngle={0}
                withTooltip={false}
                size={50}
                thickness={5}
              />
              <h5>Popularity</h5>
            </div>
          </section>
          <section>
            <Title order={3} className={styles.h3}>
              Genres
            </Title>
            <div className={styles.genres}>
              {item.genres.map((genre) => (
                <Badge
                  size="lg"
                  key={genre}
                  variant="gradient"
                  gradient={{ from: "blue", to: "cyan", deg: 90 }}
                  data-genre={genre}
                  component="button"
                  onClick={handleClick}
                  className={styles.genre}
                >
                  {genre}
                </Badge>
              ))}
            </div>
          </section>
        </div>
      </Paper>
    </Container>
  );
}
