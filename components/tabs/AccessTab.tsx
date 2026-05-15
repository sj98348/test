import * as React from "react";
import { DefaultButton } from "@fluentui/react";
import { SelectedLocation } from "../../models/LocationModels";

interface AccessTabProps {
  environmentName: string;
  selectedLocation: SelectedLocation;
  onGeoLocation: () => void;
  onEquipmentSort: () => void;
  onFunctionalLocation: () => void;
  onChangeLocation: () => void;
  
}

export const AccessTab = ({
  environmentName,
  selectedLocation,
  onGeoLocation,
  onEquipmentSort,
  onFunctionalLocation,
  onChangeLocation
}: AccessTabProps) => {
  const locationName =
    selectedLocation.name && selectedLocation.name !== "Set Location"
      ? selectedLocation.name
      : "Location Not Selected";

  return (
    <div>
      <div style={headerStyle}>
        <div style={{ fontSize: 20, fontWeight: 600 }}>
          Smart Equipment Access
        </div>

        <div style={{ fontSize: 13 }}>{locationName}</div>
      </div>

      <div style={{ padding: 24, textAlign: "center" }}>
        <h3>How Would You Like to Locate Your Asset?</h3>

        <DefaultButton
          text="Geographic Location or Equipment Category"
          onClick={onGeoLocation}
          styles={buttonStyle}
        />

        <DefaultButton
          text="Equipment SORT Field"
          onClick={onEquipmentSort}
          styles={buttonStyle}
        />

        <DefaultButton
          text="Functional Location"
          onClick={onFunctionalLocation}
          styles={buttonStyle}
        />

        <div style={footerStyle}>
          <div
            style={changeLocationStyle}
            onClick={onChangeLocation}
            title="Change Location"
          >
            <div style={changeIconStyle}>⌖</div>
            <div style={{ fontSize: 12 }}>Change Location</div>
          </div>

          <div style={environmentStyle}>{environmentName}</div>
        </div>
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

const buttonStyle = {
  root: {
    width: "100%",
    minHeight: 90,
    marginTop: 18,
    fontSize: 18,
    whiteSpace: "normal"
  }
};

const footerStyle: React.CSSProperties = {
  marginTop: 32,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-end"
};

const changeLocationStyle: React.CSSProperties = {
  display: "inline-flex",
  flexDirection: "column",
  alignItems: "center",
  cursor: "pointer"
};

const changeIconStyle: React.CSSProperties = {
  fontSize: 34,
  lineHeight: "34px"
};

const environmentStyle: React.CSSProperties = {
  fontSize: 12,
  color: "#333"
};