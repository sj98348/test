import * as React from "react";
import { Dialog, DialogType, ChoiceGroup, PrimaryButton } from "@fluentui/react";

interface Props {
  hidden: boolean;
  onDismiss: () => void;
}

export const PinActionDialog = ({ hidden, onDismiss }: Props) => {
  return (
    <Dialog
      hidden={hidden}
      onDismiss={onDismiss}
      dialogContentProps={{
        type: DialogType.normal,
        title: "SP-R-01-0001-30P-PC-0082-B"
      }}
    >
      <ChoiceGroup
        options={[
          { key: "new", text: "New Notification" },
          { key: "equipment", text: "Equipment Details - Coming Soon" },
          { key: "floc", text: "FLOC Details - Coming Soon" },
          { key: "open", text: "Open Notifications - Coming Soon" },
          { key: "history", text: "Work History - Coming Soon" },
          { key: "docs", text: "Cognite Documents - Coming Soon" },
          { key: "exit", text: "Exit" }
        ]}
      />

      <PrimaryButton text="Close" onClick={onDismiss} />
    </Dialog>
  );
};