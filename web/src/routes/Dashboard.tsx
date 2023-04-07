import styled from "styled-components";
import { GridContainer, PageContainer } from "components/Common/Containers";
import GridImageLink from "components/Common/GridImageLink";
import { useGlobalWindow } from "hooks/GlobalWindow";
import { useMemo } from "react";
import { useNavigate } from "react-router";
import { Paths, RouteDef } from "routes";
// Grid images
import worlds from "assets/mystic-world.png";
import timelines from "assets/mystic-time.png";
import characters from "assets/mystic-characters.png";
import books from "assets/mystic-books.png";

const userSections = [
  { data: Paths.Worlds, src: worlds }, // "Worlds & settings",
  { data: Paths.Timelines, src: timelines }, // "Events & Timelines",
  { data: Paths.Characters, src: characters }, // "Cast & Characters",
  { data: Paths.BooksAndSeries, src: books } // "Books & Series"
];
const Controls = styled(GridContainer)`
  padding: 1rem 0;
`;

const Dashboard = () => {
  const navigate = useNavigate();
  const { width } = useGlobalWindow();
  const [gridColumns, gridGap] = useMemo(() => {
    if (width > 1280) return [4, "1rem"];
    if (width > 1024) return [3, "0.9rem"];
    if (width > 400) return [2, "0.4rem"];
    return [1, "0.25rem"];
  }, [width]);

  const goTo = (section: RouteDef) => navigate(section.path);

  return (
    <PageContainer>
      <h1>Dashboard</h1>
      <p>Jump to a section</p>

      <Controls columns={`repeat(${gridColumns},1fr)`} gap={gridGap}>
        {userSections.map(({ data, src }, i) => (
          <GridImageLink
            key={data.Index.text}
            href={data.Index.path}
            title={data.Index.text}
            image={src}
          />
        ))}
      </Controls>
    </PageContainer>
  );
};

export default Dashboard;
