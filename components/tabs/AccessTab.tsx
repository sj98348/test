import * as React from "react";
import { DefaultButton, PrimaryButton } from "@fluentui/react";
import { SelectedLocation } from "../../models/LocationModels";

interface Props {
  selectedLocation: SelectedLocation;

  onGeoLocation: () => void;
  onEquipmentSort: () => void;
  onFunctionalLocation: () => void;

  onChangeLocation: () => void;
}

export const AccessTab = ({
  selectedLocation,
  onGeoLocation,
  onEquipmentSort,
  onFunctionalLocation,
  onChangeLocation
}: Props) => {
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

        <div style={{ fontSize: 13 }}>
          {locationName}
        </div>
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

        <div style={{ marginTop: 40 }}>
  <PrimaryButton
    text="Change Location"
    onClick={onChangeLocation}
    styles={{
      root: {
        width: "100%"
      }
    }}
  />
</div>

<div
  style={{
    marginTop: 14,
    fontSize: 12,
    cursor: "pointer",
    textDecoration: "underline"
  }}
  onClick={onChangeLocation}
>
  Change Location
</div>

        <div style={{ marginTop: 16, fontSize: 12 }}>
          Current Location:
        </div>

        <div
          style={{
            fontSize: 14,
            fontWeight: 600,
            marginTop: 4
          }}
        >
          {locationName}
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