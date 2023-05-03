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
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { Paths } from "routes";
import {
  GlobalUser,
  addNotification,
  toggleGlobalNotifications,
  updateAsError,
  updateNotification
} from "state";
import styled from "styled-components";
import { upsertUser } from "graphql/requests/users.graphql";
import { uploadFileToServer } from "api/loadUserData";
import ImageLoader from "components/Common/ImageLoader";

const LogoutButton = styled(ButtonWithIcon)`
  display: grid;
  grid-template-columns: 24px auto;
  margin: 1rem auto;
  max-width: 600px;
`;
const SettingsForm = styled(Form)`
  margin: 1rem auto 0;
`;
const ProfileImage = styled(ImageLoader)`
  border-radius: 50%;
  cursor: pointer;
  outline: 0;

  &:hover {
    outline: 0.8rem solid #a2a2a219;
    transition: outline 180ms ease-in-out;
  }
`;

const UserSettings = () => {
  const navigate = useNavigate();
  const { active } = useGlobalNotifications();
  const { id: userId, ...initialState } = useGlobalUser([
    "id",
    "authenticated",
    "displayName",
    "profileImage",
    "email",
    "image",
    "firstName",
    "lastName"
  ]);
  const [data, setData] = useState(initialState);
  const [imgData, setImgData] = useState<File | undefined>(undefined);
  const profileImg = useMemo(() => initialState.image, [initialState]);

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
  const updateImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setImgData(e.target.files[0] || undefined);
  };
  const uploadUserImage = async () => {
    if (!userId || userId === -1 || !imgData) return;

    const noteId = addNotification("Uploading image...", true);
    const imageRes = await uploadFileToServer(imgData, "users");
    if (typeof imageRes === "string") return updateAsError(imageRes, noteId);

    updateNotification("Updating user...", noteId);
    const fileURL = imageRes.fileURL;
    const userRes = await upsertUser(userId, { image: fileURL });
    if (typeof userRes === "string") return updateAsError(userRes, noteId);
    if (!userRes) return updateAsError("User not found", noteId);

    GlobalUser.multiple(userRes);
    updateNotification("User updated!", noteId);
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
    const { authenticated } = initialState;
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
            <Legend>Profile Image</Legend>
            <Label columns="2fr 5fr">
              <span className="label">
                <ProfileImage width={120} src={profileImg} />
              </span>
              <Input
                type="file"
                accept="image/*"
                onChange={updateImage}
                style={{ padding: "0 0.5rem" }}
              />
            </Label>
            <hr />
            <WideButton
              disabled={!imgData}
              onClick={uploadUserImage}
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
          text={`Logout ${data.displayName}`}
          size="lg"
        />
      </Card>
    </PageLayout>
  );
};

export default UserSettings;
