import {
  UpsertLinkData,
  upsertContentLinks
} from "graphql/requests/content-links.graphql";
import Modal from "./Modal";
import { ErrorMessage } from "components/Common/Containers";
import CreateContentLinksForm from "components/Form.CreateContentLinks";
import { useEffect, useState } from "react";
import { useGlobalLibrary } from "hooks/GlobalLibrary";
import { clearGlobalModal, updateChaptersState } from "state";
import { mergeLists } from "utils";

/** Modal props */
type ManageContentLinksModalProps = {
  open: boolean;
  data?: Partial<UpsertLinkData>[] | null;
  onClose?: () => void;
};

// Empty/default form data
const emptyForm = (): Partial<UpsertLinkData>[] => [];

// API form data (to prevent gql errors)
const condenseFormData = (data: Partial<UpsertLinkData>[]) =>
  data.map((item) => ({
    id: item.id,
    text: item.text,
    authorId: item.authorId,
    sceneId: item.sceneId,
    chapterId: item.chapterId,
    bookId: item.bookId,
    seriesId: item.seriesId
  }));

/** Specialized Modal for creating/editing a `LinksEvent` */
export default function ManageContentLinksModal(
  props: ManageContentLinksModalProps
) {
  const { open, onClose = clearGlobalModal } = props;
  const { focusedChapter, focusedScene } = useGlobalLibrary([
    "focusedChapter",
    "focusedScene"
  ]);
  const { Links: data = [] } = focusedScene || { Links: [] };
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<Partial<UpsertLinkData>[]>(
    data?.length ? condenseFormData(data) : emptyForm()
  );
  const resetForm = () => setFormData(emptyForm());
  const submit = async () => {
    if (!focusedChapter) return;
    // validate
    const errorMessage = formData.reduce((acc, item) => {
      if (acc.length > 0) return acc;
      if (!item.originId) return "Text is required on all items.";
      if (!item.text) return "Text is required on all items.";
      return acc;
    }, "");
    setError(errorMessage);
    if (errorMessage.length > 0) return;

    // Create & notify
    const chapterId = focusedChapter.id;
    const resp = await upsertContentLinks(
      chapterId,
      formData as UpsertLinkData[]
    );
    if (typeof resp === "string") setError(resp);
    else if (!resp) return;

    updateChaptersState([resp]);
    resetForm();
    onClose();
  };

  // Reset form data when modal is closed
  useEffect(() => {
    if (data?.length) setFormData(mergeLists(data, formData));
    else resetForm();

    return () => {
      setError("");
      resetForm();
    };
  }, []);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`${data?.length ? "Manage" : "Create"} Content Links`}
      cancelText="Cancel"
      confirmText={`${data?.length ? "Update" : "Create"} Links`}
      onConfirm={submit}
    >
      <CreateContentLinksForm data={formData} onChange={setFormData} />
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </Modal>
  );
}
