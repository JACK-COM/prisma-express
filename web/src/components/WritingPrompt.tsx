import { noOp } from "../utils";
import { buildDescriptionPrompt } from "utils/prompt-builder";
import { getAndShowPrompt } from "api/loadUserData";
import { ButtonWithIcon } from "./Forms/Button";

type WritingPromptProps = {
  onPrompt?: (p: string) => any;
  additionalData?: any;
  buttonText?: string;
};

/** @component Get a writing prompt from the server */
export const WritingPrompt = (props: WritingPromptProps) => {
  const { additionalData, onPrompt = noOp, buttonText = "Get ideas" } = props;
  const getSummaryIdea = async () => {
    const promptOpts = { type: "adventure", ...additionalData };
    const ideaPrompt = buildDescriptionPrompt(promptOpts);
    if (!ideaPrompt) return;
    const idea = await getAndShowPrompt(ideaPrompt, false);
    if (idea) onPrompt(idea);
  };

  return (
    <ButtonWithIcon
      type="button"
      onClick={getSummaryIdea}
      icon="tips_and_updates"
      size="lg"
      text={buttonText}
    />
  );
};
