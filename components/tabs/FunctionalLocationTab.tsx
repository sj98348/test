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

export const FunctionalLocationTab = ({
  onBack,
  onHome
}: Props) => {
  return (
    <div>
      <div style={headerStyle}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 600 }}>
            Functional Location
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

      <div style={{ padding: 12 }}>
        <div
          style={{
            textAlign: "center",
            fontSize: 13
          }}
        >
          Click below to select Functional Location for Notification
        </div>

        <TextField
          value="St. Paul Park Refinery Complex"
          readOnly
        />

        <PrimaryButton
          text="Back"
          onClick={onBack}
          styles={{
            root: {
              width: "100%",
              marginTop: 8
            }
          }}
        />

        <div
          style={{
            textAlign: "center",
            marginTop: 12,
            fontSize: 13
          }}
        >
          Click item below to Drill-Down
        </div>

        <TextField placeholder="Highlight by Text" />

        <div style={listCard}>
          <b>SP</b>

          <div>
            ST PAUL PARK REFINING COMPLEX
          </div>
        </div>

        <div style={listCard}>
          <b>SP-L</b>

          <div>
            ST PAUL PARK REFINING - LOGISTICS ASSETS
          </div>
        </div>

        <div style={listCard}>
          <b>SP-R</b>

          <div>
            ST PAUL PARK REFINING - REFINERY ASSETS
          </div>
        </div>

        <DefaultButton
          text="Home"
          onClick={onHome}
          styles={{
            root: {
              width: "100%",
              marginTop: 16
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

const listCard: React.CSSProperties = {
  padding: 12,
  marginTop: 8,
  background: "#f1f1f1",
  border: "1px solid #ddd"
};