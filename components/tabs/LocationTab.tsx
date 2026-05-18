import * as React from "react";
import { useEffect, useState } from "react";
import { DefaultButton, PrimaryButton, TextField } from "@fluentui/react";

import { IInputs } from "../../generated/ManifestTypes";
import { LocationOption, SelectedLocation } from "../../models/LocationModels";
import { FlocLocationService } from "../../services/dataverse/FlocLocationService";
import { UserPrimaryFlocService } from "../../services/dataverse/UserPrimaryFlocService";

interface Props {
  context: ComponentFramework.Context<IInputs>;
  selectedLocation: SelectedLocation;
  onLocationConfirmed: (location: SelectedLocation) => void;
  onHome: () => void;
}
const hardcodedBUList = ["G&P", "Marine", "Pipeline", "Refining", "Terminal"];

export const LocationTab = ({
  context,
  selectedLocation,
  onLocationConfirmed,
  onHome
}: Props) => {
  const [allLocations, setAllLocations] = useState<LocationOption[]>([]);
  const [filteredLocations, setFilteredLocations] = useState<LocationOption[]>([]);
  const [buList, setBuList] = useState<string[]>(hardcodedBUList);
  const [selectedBU, setSelectedBU] = useState("");
  const [selectedLocationId, setSelectedLocationId] = useState("");
  const [filterText, setFilterText] = useState("");
  const [status, setStatus] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const loadLocations = async () => {
      try {
        setStatus("Loading locations...");

        const user = await UserPrimaryFlocService.getLoggedInUser(context);
        setUserName(user.fullName || "Current User");

        const locations = await FlocLocationService.getAllLocations(context);

        setAllLocations(locations);
        setBuList(hardcodedBUList);
        setStatus("");
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        setStatus(`Error loading locations: ${message}`);
      }
    };

    loadLocations();
  }, [context]);

  const filterLocations = (bu: string, text: string) => {
    const buFiltered = bu
      ? FlocLocationService.filterByBU(allLocations, bu)
      : allLocations;

    const textFiltered = FlocLocationService.filterByText(
      buFiltered,
      text
    );

    setFilteredLocations(textFiltered);
  };

  const selectBU = (bu: string) => {
    setSelectedBU(bu);
    setSelectedLocationId("");
    filterLocations(bu, filterText);
  };

  const onFilterChange = (value?: string) => {
    const text = value || "";

    setFilterText(text);
    filterLocations(selectedBU, text);
  };

  const showLocationsNearMe = async () => {
    try {
      setStatus("Getting current location...");

      const position = await UserPrimaryFlocService.getCurrentPosition();

      const nearby = FlocLocationService.filterNearMe(
        allLocations,
        position.latitude,
        position.longitude,
        50
      );

      setSelectedBU("");
      setSelectedLocationId("");
      setFilteredLocations(nearby);
      setStatus("");
    } catch {
      setStatus(
        "This feature is available to mobile devices with location services and GPS enabled."
      );
    }
  };

  const confirmLocation = async () => {
    const selected = allLocations.find(
      (location) => location.id === selectedLocationId
    );

    if (!selected) {
      setStatus("Please select a location.");
      return;
    }

    try {
      setIsSaving(true);
      setStatus("Saving selected location...");

      const user = await UserPrimaryFlocService.getLoggedInUser(context);

      await UserPrimaryFlocService.updateUserPrimaryFlocCode(
        context,
        user.email,
        user.entraObjectId,
        selected.flocCode
      );

      onLocationConfirmed({
        id: selected.id,
        name: selected.flocName || selected.name || selected.flocCode,
        bu: selected.bu,
        flocCode: selected.flocCode,
        latitude: selected.latitude,
        longitude: selected.longitude
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      setStatus(`Error saving location: ${message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const selected = allLocations.find(
    (location) => location.id === selectedLocationId
  );

  return (
    <div>
      <div style={headerStyle}>
        <div>
          <div style={{ fontSize: 24, fontWeight: 600 }}>Locations</div>
          <div style={{ fontSize: 13 }}>
            {selectedLocation.name || "Set Location"}
          </div>
        </div>

        <button style={homeButtonStyle} onClick={onHome} title="Home">
          ⌂
        </button>
      </div>

      <div style={{ padding: 12, textAlign: "center" }}>
        <div style={userBlock}>
          <div style={avatarStyle}>👤</div>

          <div style={{ textAlign: "left" }}>
            <div style={{ fontWeight: 600 }}>
              {userName || "Current User"}
            </div>

            <div style={{ fontSize: 12 }}>
              {selectedLocation.name || "No location selected"}
            </div>
          </div>
        </div>

        <PrimaryButton
          text="Show Locations Near Me"
          onClick={showLocationsNearMe}
          styles={{ root: { width: 240, marginTop: 8 } }}
        />

        <h3>Select a different location.</h3>

        <TextField
          placeholder="Filter by Text"
          value={filterText}
          onChange={(_, value) => onFilterChange(value)}
        />

        <div style={mainArea}>
          <div style={buPanel}>
            {buList.map((bu) => (
              <DefaultButton
                key={bu}
                text={bu}
                onClick={() => selectBU(bu)}
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
            {!selectedBU && filteredLocations.length === 0 && (
              <div style={emptyText}>
                Select a business unit to view locations
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
                      : "1px solid #bbb"
                }}
              >
                {location.flocName || location.name || location.flocCode}
              </div>
            ))}
          </div>
        </div>

        {selected && (
          <div style={{ marginTop: 8, fontSize: 13 }}>
            Set Location to {selected.flocName || selected.name}??
          </div>
        )}

        {status && (
          <div style={{ marginTop: 8, fontSize: 12 }}>
            {status}
          </div>
        )}

        <PrimaryButton
          text={isSaving ? "Saving..." : "Confirm"}
          disabled={!selectedLocationId || isSaving}
          onClick={confirmLocation}
          styles={{
            root: {
              width: 180,
              marginTop: 8,
              background: selectedLocationId ? "#315f32" : "#d0d0d0",
              borderColor: selectedLocationId ? "#315f32" : "#d0d0d0",
              color: "#fff"
            },
            rootDisabled: {
              background: "#d0d0d0",
              borderColor: "#d0d0d0",
              color: "#ffffff"
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
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
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

const userBlock: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 12
};

const avatarStyle: React.CSSProperties = {
  width: 56,
  height: 56,
  borderRadius: "50%",
  border: "2px solid #a52a2a",
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
};

const mainArea: React.CSSProperties = {
  display: "flex",
  marginTop: 12,
  border: "1px solid #ccc",
  height: 340
};

const buPanel: React.CSSProperties = {
  width: 120,
  padding: 8,
  background: "#f0f0f0",
  borderRight: "1px solid #ccc"
};

const locationPanel: React.CSSProperties = {
  flex: 1,
  padding: 8,
  overflowY: "auto"
};

const locationCard: React.CSSProperties = {
  padding: 10,
  marginBottom: 8,
  background: "#f7f7f7",
  cursor: "pointer"
};

const emptyText: React.CSSProperties = {
  marginTop: 80,
  fontSize: 18
};