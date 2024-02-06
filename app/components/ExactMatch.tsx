import { DonutChart, DonutChartCell } from "@mantine/charts";
import "@mantine/charts/styles.css";
import {
  Anchor,
  Container,
  Badge,
  Paper,
  Title,
  useMantineTheme,
  Button,
} from "@mantine/core";
import { Artist, Item } from "~/api/spotify.server";
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

export default function ExactMatch({ item }: { item: Item }) {
  const popularityData = extractData(item.artist);
  const theme = useMantineTheme();

  return (
    <Container size="md">
      <Paper className={styles.root} component="section" shadow="md">
        <img
          src={item.image.url}
          alt={`${item.artist} profile picture on Spotify`}
          className={styles.img}
        />
        <div className={styles.content}>
          <div className={styles.flex}>
            <Title order={2}>{item.artist.name}</Title>
            <Anchor
              href={item.artist.spotifyUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Listen on Spotify
            </Anchor>
            {item.album && <h3>{item.album}</h3>}
            {item.track && <h4>{item.track}</h4>}
          </div>

          <div className={styles.chart}>
            <DonutChart
              data={popularityData}
              startAngle={180}
              endAngle={0}
              withTooltip={false}
              size={100}
            />
            <h5>Popularity</h5>
          </div>
        </div>
      </Paper>
      <section>
        <h2>Genres</h2>
        <div className={styles.genres}>
          {item.genres.map((genre) => (
            <Button
              variant="gradient"
              gradient={{ from: "blue", to: "cyan", deg: 90 }}
              component={Badge}
            >
              {genre}
            </Button>
          ))}
        </div>
      </section>
    </Container>
  );
}
