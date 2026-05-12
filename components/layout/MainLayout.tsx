import * as React from "react";
import { Stack } from "@fluentui/react";

interface Props {
  children: React.ReactNode;
}

export const MainLayout = ({ children }: Props) => {
  return (
    <Stack
      styles={{
        root: {
          width: "100%",
          minHeight: 640,
          background: "#2f2f2f",
          alignItems: "center"
        }
      }}
    >
      <div
        style={{
          width: 390,
          minHeight: 640,
          background: "#ffffff"
        }}
      >
        {children}
      </div>
    </Stack>
  );
};