import * as React from "react";
import { Stack, DefaultButton, PrimaryButton } from "@fluentui/react";

interface Props {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { key: "home", label: "Home" },
  { key: "workorders", label: "Work Orders" },
  { key: "assets", label: "Assets" },
  { key: "map", label: "Map" },
  { key: "create", label: "Create" }
];

export const BottomNav = ({ activeTab, onTabChange }: Props) => {
  return (
    <Stack
      horizontal
      tokens={{ childrenGap: 6 }}
      styles={{
        root: {
          padding: 8,
          borderTop: "1px solid #e1e1e1",
          overflowX: "auto",
          background: "#ffffff"
        }
      }}
    >
      {tabs.map((tab) =>
        activeTab === tab.key ? (
          <PrimaryButton key={tab.key} text={tab.label} onClick={() => onTabChange(tab.key)} />
        ) : (
          <DefaultButton key={tab.key} text={tab.label} onClick={() => onTabChange(tab.key)} />
        )
      )}
    </Stack>
  );
};