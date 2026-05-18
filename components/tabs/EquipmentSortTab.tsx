import * as React from "react";
import {
  DefaultButton,
  PrimaryButton,
  TextField
} from "@fluentui/react";

interface Props {
  onBack: () => void;
  onHome: () => void;
}

export const EquipmentSortTab = ({
  onBack,
  onHome
}: Props) => {
  return (
    <div>
      <div style={headerStyle}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 600 }}>
            Equipment SORT
          </div>

          <div style={{ fontSize: 13 }}>
            St. Paul Park Refinery Complex
          </div>
        </div>

        <button
          style={homeButtonStyle}
          onClick={onHome}
          title="Home"
        >
          ⌂
        </button>
      </div>

      <div style={{ padding: 20, textAlign: "center" }}>
        <h3>Enter Equipment SORT Field</h3>

        <div style={{ fontSize: 12 }}>
          Starts with 3 Character Minimum
        </div>

        <TextField
          placeholder="Enter SORT field"
          styles={{
            root: {
              marginTop: 18
            }
          }}
        />

        <PrimaryButton
          text="Search"
          styles={{
            root: {
              width: "100%",
              marginTop: 18
            }
          }}
        />

        <div style={{ fontSize: 12, marginTop: 12 }}>
          0 Results Found
        </div>

        <DefaultButton
          text="Back"
          onClick={onBack}
          styles={{
            root: {
              width: "100%",
              marginTop: 20
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
  padding: "14px 8px",
  position: "relative"
};

const homeButtonStyle: React.CSSProperties = {
  position: "absolute",
  right: 16,
  top: 10,
  fontSize: 34,
  color: "#fff",
  background: "transparent",
  border: "none",
  cursor: "pointer"
};