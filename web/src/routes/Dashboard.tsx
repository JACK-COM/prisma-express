import styled from "styled-components";
import {
  GridContainer,
  PageContainer,
  PageDescription,
  PageTitle
} from "components/Common/Containers";
import GridImageLink from "components/Common/GridImageLink";
import { useGlobalWindow } from "hooks/GlobalWindow";
import { useMemo } from "react";
import { Paths } from "routes";
// Grid images
import worlds from "assets/mystic-world.png";
import timelines from "assets/mystic-time.png";
import characters from "assets/mystic-characters.png";
import books from "assets/mystic-books.png";
import { useGlobalUser } from "hooks/GlobalUser";

const SECTIONS = [
  { auth: false, data: Paths.Worlds, src: worlds }, // "Worlds & settings",
  { auth: true, data: Paths.Characters, src: characters }, // "Cast & Characters",
  { auth: true, data: Paths.Timelines, src: timelines }, // "Events & Timelines",
  { auth: false, data: Paths.BooksAndSeries, src: books } // "Books & Series"
];
const Controls = styled(GridContainer)`
  padding: 1rem 0;
`;

const Dashboard = () => {
  const { email } = useGlobalUser();
  const { width } = useGlobalWindow();
  const [gridColumns, gridGap] = useMemo(() => {
    if (width > 1024) return [4, "1rem"];
    if (width > 400) return [2, "0.4rem"];
    return [1, "0.25rem"];
  }, [width]);
  const pageTitle = useMemo(() => {
    return email ? "Dashboard" : "MythosForge Home";
  }, [email]);
  const dashSections = SECTIONS.filter(({ auth }) => !auth || email);

  return (
    <PageContainer id="app-dashboard">
      <header>
        <PageTitle>{pageTitle}</PageTitle>
        <PageDescription>A forge of myths and legends</PageDescription>
      </header>

      <h4>Jump to a section:</h4>
      <Controls columns={`repeat(${gridColumns},1fr)`} gap={gridGap}>
        {dashSections.map(({ data, src }, i) => (
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
