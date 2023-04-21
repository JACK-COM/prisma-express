import { LOGOUT_URL } from "components/AppAuth";
import { Card, CardTitle } from "components/Common/Containers";
import PageLayout from "components/Common/PageLayout";
import { ButtonWithIcon, WideButton } from "components/Forms/Button";
import {
  Fieldset,
  FormRow,
  Input,
  RadioInput,
  RadioLabel
} from "components/Forms/Form";
import { Label } from "components/Forms/Form";
import { Form, Legend } from "components/Forms/Form";
import useGlobalNotifications from "hooks/GlobalNotifications";
import { useGlobalUser } from "hooks/GlobalUser";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Paths } from "routes";
import {
  addNotification,
  toggleGlobalNotifications,
  updateAsError
} from "state";
import styled from "styled-components";
import { upsertUser } from "graphql/requests/users.graphql";

const LogoutButton = styled(ButtonWithIcon)`
  display: grid;
  grid-template-columns: 24px auto;
  margin: 1rem auto;
  max-width: 600px;
`;
const SettingsForm = styled(Form)`
  margin: 1rem auto 0;
`;

const UserSettings = () => {
  const navigate = useNavigate();
  const { active } = useGlobalNotifications();
  const {
    id: userId,
    displayName,
    firstName,
    lastName,
    email,
    authenticated
  } = useGlobalUser([
    "id",
    "authenticated",
    "displayName",
    "email",
    "firstName",
    "lastName"
  ]);
  const [data, setData] = useState({ displayName, firstName, lastName, email });
  const updateDisplayName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData((prev) => ({ ...prev, displayName: e.target.value }));
  };
  const updateFirstName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData((prev) => ({ ...prev, firstName: e.target.value }));
  };
  const updateLastName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData((prev) => ({ ...prev, lastName: e.target.value }));
  };
  const updateEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData((prev) => ({ ...prev, email: e.target.value }));
  };
  const updateUser = async () => {
    if (!userId || userId === -1) return;
    const res = await upsertUser(userId, {
      displayName: data.displayName || undefined,
      firstName: data.firstName || undefined,
      lastName: data.lastName || undefined,
      email: data.email || undefined
    });
    if (typeof res === "string") return updateAsError(res);
    else addNotification("User updated!");
  };

  useEffect(() => {
    if (!authenticated) navigate(Paths.Dashboard.Index.path, { replace: true });
  }, []);

  return (
    <PageLayout
      title="User Settings"
      description="Manage account settings"
      breadcrumbs={[Paths.Dashboard.Settings]}
    >
      <Card>
        <CardTitle>Account</CardTitle>
        <SettingsForm>
          <Fieldset>
            <Legend>General</Legend>
            <Label columns="2fr 5fr">
              <span className="label">
                <span className="accent--text">Username</span>
              </span>
              <Input
                value={data.displayName || ""}
                name="displayname"
                placeholder="bubbles123"
                onChange={updateDisplayName}
              />
            </Label>

            <Label columns="2fr 5fr">
              <span className="label">Email</span>
              <Input
                value={data.email || ""}
                type="email"
                placeholder="email@address.com"
                onChange={updateEmail}
              />
            </Label>
            <hr />
            <WideButton
              onClick={updateUser}
              type="button"
              variant="outlined"
              size="sm"
            >
              Update
            </WideButton>
          </Fieldset>

          <Fieldset>
            <Legend>Personal</Legend>
            <Label columns="2fr 5fr">
              <span className="label">First Name</span>
              <Input
                value={data.firstName || ""}
                name="firstname"
                placeholder="First Name"
                onChange={updateFirstName}
              />
            </Label>

            <Label columns="2fr 5fr">
              <span className="label">Last Name</span>
              <Input
                value={data.lastName || ""}
                name="lastname"
                placeholder="Last Name"
                onChange={updateLastName}
              />
            </Label>
            <hr />
            <WideButton
              onClick={updateUser}
              type="button"
              variant="outlined"
              size="sm"
            >
              Update
            </WideButton>
          </Fieldset>
        </SettingsForm>

        <CardTitle>User Interface</CardTitle>
        <SettingsForm>
          <Fieldset>
            <Legend>Notifications</Legend>
            <FormRow columns="repeat(2, 1fr)">
              <RadioLabel>
                <span className="label">Enabled</span>
                <RadioInput
                  checked={active}
                  onChange={toggleGlobalNotifications}
                  name="notifications"
                />
              </RadioLabel>
              <RadioLabel>
                <span className="label">Disabled</span>
                <RadioInput
                  checked={!active}
                  onChange={toggleGlobalNotifications}
                  name="notifications"
                />
              </RadioLabel>
            </FormRow>
          </Fieldset>
        </SettingsForm>

        <LogoutButton
          type="button"
          className="error"
          onClick={() => window.open(LOGOUT_URL, "_self")}
          icon="power_off"
          text={`Logout ${displayName}`}
          size="lg"
        />
      </Card>
    </PageLayout>
  );
};

export default UserSettings;
