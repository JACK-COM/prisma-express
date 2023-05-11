import { Card, CardTitle } from "components/Common/Containers";
import PageLayout from "components/Common/PageLayout";
import { StyledLink } from "components/Forms/Button";

const NotAuthorized = () => {
  return (
    <PageLayout title="403: Forbidden" description="Unauthorized page access.">
      <Card>
        <CardTitle className="h5">Authenticated Content</CardTitle>
        <p>Please log in to view this content.</p>

        <StyledLink to="/" size="lg" variant="transparent">
          Return Home
        </StyledLink>
      </Card>
    </PageLayout>
  );
};

export default NotAuthorized;
