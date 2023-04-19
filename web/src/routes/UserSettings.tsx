import { LOGOUT_URL } from "components/AppAuth";
import { Card, PageContainer } from "components/Common/Containers";
import PageLayout from "components/Common/PageLayout";
import { ButtonLink, LinkWithIcon } from "components/Forms/Button";
import { Paths } from "routes";

const UserSettings = () => {
  return (
    <PageLayout
      title="User Settings"
      description="Manage account settings"
      breadcrumbs={[Paths.Dashboard.Settings]}
    >
      <Card>
        <p>Not sure how to tell you this ...</p>
        <p>Oh, we already did: the content you seek is not here.</p>
        <p>Yet.</p>
        <LinkWithIcon
          target="_self"
          variant="transparent"
          href={LOGOUT_URL}
          icon="power_off"
          text="Logout"
        />
      </Card>
    </PageLayout>
  );
};

export default UserSettings;
