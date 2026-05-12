import * as React from "react";
import { PrimaryButton } from "@fluentui/react";

interface Props {
  onGo: () => void;
}

export const GoTab = ({ onGo }: Props) => {
  return (
    <div>
      <div style={headerStyle}>
        <div style={{ fontSize: 20, fontWeight: 600 }}>
          Smart Equipment Access
        </div>
      </div>

      <div style={{ padding: 30, textAlign: "center" }}>
        <div style={{ fontSize: 18, marginTop: 10 }}>
          Please Select Your Current Location.
        </div>

        <div style={{ fontSize: 12, fontStyle: "italic", marginTop: 18 }}>
          You only have to do this once.
        </div>

        <PrimaryButton
          text="Go"
          onClick={onGo}
          styles={{
            root: {
              width: 190,
              height: 120,
              fontSize: 24,
              fontWeight: 600,
              marginTop: 22,
              background: "#315f32",
              borderColor: "#315f32"
            }
          }}
        />
      </div>
    </div>
  );
};

const headerStyle: React.CSSProperties = {
  background: "#a52a2a",
  color: "#fff",
  textAlign: "center",
  padding: "16px 8px"
};