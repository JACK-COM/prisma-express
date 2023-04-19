import { Card, PageContainer } from "components/Common/Containers";
import PageLayout from "components/Common/PageLayout";
import { StyledLink, WideButton } from "components/Forms/Button";

const NotFound = () => {
  return (
    <PageLayout
      title="404: Page Not Found"
      description="Content either missing or moved"
    >
      <Card>
        <p>Not sure how to tell you this ...</p>
        <p>Oh, we already did: the content you seek is not here.</p>
        <p>But was it ever?</p>

        <StyledLink to="/" size="lg" variant="transparent">
          Return Home
        </StyledLink>
      </Card>
    </PageLayout>
  );
};

export default NotFound;
