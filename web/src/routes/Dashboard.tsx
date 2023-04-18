import styled from "styled-components";
import { GridContainer } from "components/Common/Containers";
import { useGlobalWindow } from "hooks/GlobalWindow";
import { useMemo } from "react";
import { Paths } from "routes";
// Grid images
import worlds from "assets/mystic-world.png";
import timelines from "assets/mystic-time.png";
import characters from "assets/mystic-characters.png";
import books from "assets/mystic-books.png";
import { Link } from "react-router-dom";
import PageLayout from "components/Common/PageLayout";

const Container = styled(PageLayout)``;
const Controls = styled(GridContainer)`
  align-self: stretch;
  height: 100%;
  padding: 1rem 0;
`;
const Control = styled(Link)<{ image: string }>`
  background: ${({ image }) => `url(${image}) no-repeat bottom center / cover`};
  color: white;
  font-size: 1.6rem;
  font-weight: 600;
  height: 88vh;
  overflow: hidden;
  place-content: center;
  text-shadow: 0 0 0.3rem #111b;
  &:hover {
    animation: scale-up 150ms ease-in;
    animation-fill-mode: forwards;
    box-shadow: 0 0 0.5rem 0.1rem ${({ theme }) => theme.colors.accent};
  }

  @media screen and (max-width: 768px) {
    height: 50vh;
  }
`;

const SECTIONS = [
  { auth: false, data: Paths.Library, src: books }, // "Books & Series"
  { auth: false, data: Paths.Characters, src: characters }, // "Cast & Characters",
  { auth: false, data: Paths.Worlds, src: worlds }, // "Worlds & settings",
  { auth: true, data: Paths.Timelines, src: timelines } // "Events & Timelines",
];
const Dashboard = () => {
  const { width } = useGlobalWindow();
  const [gridColumns, gridGap] = useMemo(() => {
    if (width > 1024) return [4, "0"];
    if (width > 400) return [2, "0"];
    return [1, "0"];
  }, [width]);

  return (
    <Container
      id="app-dashboard"
      title="MythosForge"
      description="A forge of myths and legends"
    >
      <Controls columns={`repeat(${gridColumns},1fr)`} gap={gridGap}>
        {SECTIONS.map(({ data, src }) => (
          <Control
            className="flex"
            key={data.Index.text}
            to={data.Index.path}
            title={data.Index.text}
            children={data.Index.text}
            image={src}
          />
        ))}
      </Controls>
    </Container>
  );
};

export default Dashboard;
