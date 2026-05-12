import * as React from "react";
import { useState } from "react";
import {
  DefaultButton,
  PrimaryButton,
  Spinner,
  SpinnerSize
} from "@fluentui/react";

import { IInputs } from "../../generated/ManifestTypes";
import {
  LocationOption,
  SelectedLocation
} from "../../models/LocationModels";

import { UserPrimaryFlocService } from "../../services/dataverse/UserPrimaryFlocService";

interface Props {
  context: ComponentFramework.Context<IInputs>;
  selectedLocation: SelectedLocation;
  onLocationConfirmed: (location: SelectedLocation) => void;
  onBack: () => void;
}

const buList: string[] = [
  "G&P",
  "Marine",
  "Pipeline",
  "Refining",
  "Terminals"
];

const locationList: LocationOption[] = [
  {
    id: "sp-refinery",
    name: "St. Paul Park Refinery Complex",
    bu: "Refining",
    flocCode: "20"
  },
  {
    id: "refinery-2",
    name: "Refining Location 2",
    bu: "Refining",
    flocCode: "21"
  },
  {
    id: "marine-1",
    name: "Marine Location 1",
    bu: "Marine",
    flocCode: "30"
  },
  {
    id: "pipeline-1",
    name: "Pipeline Location 1",
    bu: "Pipeline",
    flocCode: "40"
  },
  {
    id: "terminal-1",
    name: "Terminal Location 1",
    bu: "Terminals",
    flocCode: "50"
  },
  {
    id: "gp-1",
    name: "G&P Location 1",
    bu: "G&P",
    flocCode: "60"
  }
];

export const LocationTab = ({
  context,
  onLocationConfirmed,
  onBack
}: Props) => {
  const [selectedBU, setSelectedBU] = useState("");
  const [selectedLocationId, setSelectedLocationId] = useState("");
  const [status, setStatus] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const filteredLocations = locationList.filter(
    (location) => location.bu === selectedBU
  );

  const selectedLocation = locationList.find(
    (location) => location.id === selectedLocationId
  );

  const confirmLocation = async () => {
    if (!selectedLocation) {
      setStatus("Please select a location.");
      return;
    }

    try {
      setIsSaving(true);
      setStatus("Updating user location...");

      const user = await UserPrimaryFlocService.getLoggedInUser(context);

      await UserPrimaryFlocService.updateUserPrimaryFlocCode(
        context,
        user.email,
        user.entraObjectId,
        selectedLocation.flocCode
      );

      onLocationConfirmed({
        id: selectedLocation.id,
        name: selectedLocation.name,
        bu: selectedLocation.bu,
        flocCode: selectedLocation.flocCode
      });

      setStatus("Location updated successfully.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      setStatus(`Error: ${message}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <div style={headerStyle}>
        <div style={{ fontSize: 24, fontWeight: 600 }}>Locations</div>
        <div style={{ fontSize: 32 }}>⌂</div>
      </div>

      <div style={{ padding: 14 }}>
        <div style={userSection}>
          <div style={userIcon}>👤</div>
          <div>
            <div style={{ fontWeight: 600 }}>Current User</div>
            <div style={{ fontSize: 12 }}>
              Select a business unit and location
            </div>
          </div>
        </div>

        <PrimaryButton
          text="Show Locations Near Me"
          styles={{ root: { width: "100%", marginTop: 12 } }}
        />

        <h3 style={{ textAlign: "center" }}>
          Select a different location
        </h3>

        <div style={contentLayout}>
          <div style={buPanel}>
            {buList.map((bu) => (
              <DefaultButton
                key={bu}
                text={bu}
                onClick={() => {
                  setSelectedBU(bu);
                  setSelectedLocationId("");
                  setStatus("");
                }}
                styles={{
                  root: {
                    width: "100%",
                    marginBottom: 8,
                    background: selectedBU === bu ? "#dbeafe" : "#ffffff"
                  }
                }}
              />
            ))}
          </div>

          <div style={locationPanel}>
            {!selectedBU && (
              <div style={emptyMessage}>
                Select a business unit to view locations
              </div>
            )}

            {selectedBU && filteredLocations.length === 0 && (
              <div style={emptyMessage}>
                No locations found for selected BU
              </div>
            )}

            {filteredLocations.map((location) => (
              <div
                key={location.id}
                onClick={() => setSelectedLocationId(location.id)}
                style={{
                  ...locationCard,
                  border:
                    selectedLocationId === location.id
                      ? "2px solid #0078d4"
                      : "1px solid #ddd"
                }}
              >
                <div style={{ fontWeight: 600 }}>{location.name}</div>
                <div style={{ fontSize: 12 }}>
                  BU: {location.bu} | FLOC: {location.flocCode}
                </div>
              </div>
            ))}
          </div>
        </div>

        {status && (
          <div style={{ textAlign: "center", fontSize: 12, marginTop: 10 }}>
            {status}
          </div>
        )}

        {isSaving && (
          <Spinner size={SpinnerSize.small} label="Saving..." />
        )}

        <PrimaryButton
          text="Confirm"
          onClick={confirmLocation}
          disabled={!selectedLocation || isSaving}
          styles={{ root: { width: "100%", marginTop: 14 } }}
        />

        <DefaultButton
          text="Back"
          onClick={onBack}
          styles={{ root: { width: "100%", marginTop: 10 } }}
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
  display: "flex",
  justifyContent: "space-around",
  alignItems: "center"
};

const userSection: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  justifyContent: "center"
};

const userIcon: React.CSSProperties = {
  width: 48,
  height: 48,
  borderRadius: "50%",
  border: "2px solid #a52a2a",
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
};

const contentLayout: React.CSSProperties = {
  display: "flex",
  marginTop: 16,
  border: "1px solid #ddd",
  minHeight: 260
};

const buPanel: React.CSSProperties = {
  width: 120,
  padding: 8,
  borderRight: "1px solid #ddd",
  background: "#f7f7f7"
};

const locationPanel: React.CSSProperties = {
  flex: 1,
  padding: 10
};

const emptyMessage: React.CSSProperties = {
  textAlign: "center",
  marginTop: 70,
  fontSize: 18
};

const locationCard: React.CSSProperties = {
  padding: 10,
  marginBottom: 8,
  background: "#ffffff",
  cursor: "pointer"
};