import * as React from "react";
import { useState } from "react";
import { IInputs } from "../../generated/ManifestTypes";
import {
  PrimaryButton,
  DefaultButton,
  Dropdown,
  IDropdownOption,
  ChoiceGroup
} from "@fluentui/react";

import { PinActionDialog } from "../maps/PinActionDialog";
import { UserPrimaryFlocService } from "../../services/dataverse/UserPrimaryFlocService";
import { SelectedLocation } from "../../models/LocationModels";

interface Props {
  context: ComponentFramework.Context<IInputs>;
  dataset: ComponentFramework.PropertyTypes.DataSet;
  selectedLocation: SelectedLocation;
  onBack: () => void;
}

const categoryOptions: IDropdownOption[] = [
  { key: "pump", text: "Pump" },
  { key: "valve", text: "Valve" },
  { key: "compressor", text: "Compressor" }
];

export const GeoLocationTab = ({
  context,
  selectedLocation,
  onBack
}: Props) => {
  const [showDialog, setShowDialog] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");

  const saveCurrentLocation  = async () => {
    try {
      setSaveStatus("Getting current location and saving...");

      await UserPrimaryFlocService.createOrUpdateTestLocation(context);

      setSaveStatus("Saved successfully. FLOC Code updated as 20.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      setSaveStatus(`Error: ${message}`);
    }
  };

  return (
    <div>
      <div style={headerStyle}>
        <div style={{ fontSize: 22, fontWeight: 600 }}>Geo Location</div>
        <div style={{ fontSize: 13 }}>
          {selectedLocation.name || "Location Not Selected"}
        </div>
      </div>

      <div style={{ padding: 10 }}>
        <div style={mapPlaceholder}>
          Map Placeholder
          <button style={pinStyle} onClick={() => setShowDialog(true)}>
            📍
          </button>
        </div>

        <div style={{ textAlign: "center", fontSize: 12, marginTop: 6 }}>
          44.85115, -93.00597
        </div>

        <PrimaryButton
          text="Use My Current Location"
          onClick={saveCurrentLocation}
          styles={{ root: { width: "100%", marginTop: 12 } }}
        />

        {saveStatus && (
          <div style={{ marginTop: 8, fontSize: 12, textAlign: "center" }}>
            {saveStatus}
          </div>
        )}

        <Dropdown
          label="Equipment Category"
          placeholder="Press to Select (optional)"
          options={categoryOptions}
        />

        <ChoiceGroup
          label="Search Radius (ft)"
          options={[
            { key: "10", text: "10" },
            { key: "50", text: "50" },
            { key: "100", text: "100" },
            { key: "300", text: "300" }
          ]}
        />

        <PrimaryButton
          text="Find Equipment"
          styles={{ root: { width: "100%", marginTop: 12 } }}
        />

        <h3 style={{ textAlign: "center" }}>Equipment Returned</h3>

        <div style={{ textAlign: "center", fontSize: 12 }}>
          12 Results Found
        </div>

        <div style={resultCard}>
          <b>01-PC-0082-B</b>
          <div>SUPERHEATED STEAM FR... LOOP PRESSURE</div>
          <DefaultButton text="Pin" onClick={() => setShowDialog(true)} />
        </div>

        <DefaultButton
          text="Back"
          onClick={onBack}
          styles={{ root: { width: "100%", marginTop: 12 } }}
        />
      </div>

      <PinActionDialog
        hidden={!showDialog}
        onDismiss={() => setShowDialog(false)}
      />
    </div>
  );
};

const headerStyle: React.CSSProperties = {
  background: "#a52a2a",
  color: "#fff",
  textAlign: "center",
  padding: "14px 8px"
};

const mapPlaceholder: React.CSSProperties = {
  position: "relative",
  height: 220,
  background: "#d9d9d9",
  border: "1px solid #aaa",
  textAlign: "center",
  paddingTop: 90
};

const pinStyle: React.CSSProperties = {
  position: "absolute",
  top: 85,
  left: "50%",
  fontSize: 28,
  border: "none",
  background: "transparent"
};

const resultCard: React.CSSProperties = {
  padding: 10,
  marginTop: 10,
  border: "1px solid #ddd",
  background: "#fff"
};