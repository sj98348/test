import * as React from "react";
import { useState } from "react";
import {
  PrimaryButton,
  Dropdown,
  IDropdownOption,
  ChoiceGroup,
  IChoiceGroupOption
} from "@fluentui/react";

import { IInputs } from "../../generated/ManifestTypes";
import { SelectedLocation } from "../../models/LocationModels";
import { UserPrimaryFlocService } from "../../services/dataverse/UserPrimaryFlocService";

interface Props {
  context: ComponentFramework.Context<IInputs>;
  dataset: ComponentFramework.PropertyTypes.DataSet;
  selectedLocation: SelectedLocation;
  onBack: () => void;
}

interface EquipmentItem {
  id: string;
  name: string;
  description: string;
}

const categoryOptions: IDropdownOption[] = [
  { key: "pump", text: "Pump" },
  { key: "valve", text: "Valve" },
  { key: "compressor", text: "Compressor" }
];

const radiusOptions: IChoiceGroupOption[] = [
  { key: "10", text: "10" },
  { key: "50", text: "50" },
  { key: "100", text: "100" },
  { key: "300", text: "300" }
];

export const GeoLocationTab = ({
  context,
  dataset,
  selectedLocation,
  onBack
}: Props) => {
  const [latitude, setLatitude] = useState<number>(
    selectedLocation.latitude || 44.85115
  );

  const [longitude, setLongitude] = useState<number>(
    selectedLocation.longitude || -93.00597
  );

  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedRadius, setSelectedRadius] = useState<string>("10");
  const [status, setStatus] = useState("");

  const [equipmentList, setEquipmentList] = useState<EquipmentItem[]>([]);

  const useCurrentLocation = async () => {
    try {
      setStatus("Getting current location...");

      const position = await UserPrimaryFlocService.getCurrentPosition();

      setLatitude(position.latitude);
      setLongitude(position.longitude);

      await UserPrimaryFlocService.saveCurrentLocation(context);

      setStatus("");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      setStatus(`Error: ${message}`);
    }
  };

  const findEquipment = async () => {
    setStatus("Finding equipment...");

    // TODO: Replace this with Dataverse EquipmentService call later.
    const mockEquipment: EquipmentItem[] = [
      {
        id: "1",
        name: "01-PC-0082-B",
        description: "SUPERHEATED STEAM FR... LOOP PRESSURE"
      },
      {
        id: "2",
        name: "01-PM-1001",
        description: "PUMP MOTOR EQUIPMENT"
      }
    ];

    setEquipmentList(mockEquipment);
    setStatus("");
  };

  const mapUrl =
    `https://dev.virtualearth.net/REST/V1/Imagery/Map/Aerial/` +
    `${latitude},${longitude}/18?mapSize=380,260&pp=${latitude},${longitude};66`;

  return (
    <div>
      <div style={headerStyle}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 600 }}>Geo Location</div>
          <div style={{ fontSize: 13 }}>
            {selectedLocation.name || "Location Not Selected"}
          </div>
        </div>

        <button style={homeButtonStyle} onClick={onBack}>
          ⌂
        </button>
      </div>

      <div style={{ padding: 10 }}>
        <div style={mapContainerStyle}>
          <img
            src={mapUrl}
            alt="Map"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover"
            }}
          />

          <div style={mapPinStyle}>📍</div>
        </div>

        <div style={{ textAlign: "center", fontSize: 12, marginTop: 6 }}>
          {latitude.toFixed(5)}, {longitude.toFixed(5)}
        </div>

        <PrimaryButton
          text="Use My Current Location"
          onClick={useCurrentLocation}
          styles={{ root: { width: "100%", marginTop: 12 } }}
        />

        <Dropdown
          label="Equipment Category"
          placeholder="Press to Select (optional)"
          options={categoryOptions}
          selectedKey={selectedCategory}
          onChange={(_, option) =>
            setSelectedCategory(String(option?.key || ""))
          }
        />

        <div style={{ marginTop: 10, fontWeight: 600, textAlign: "center" }}>
          Search Radius (ft)
        </div>

        <ChoiceGroup
          selectedKey={selectedRadius}
          options={radiusOptions}
          onChange={(_, option) =>
            setSelectedRadius(String(option?.key || "10"))
          }
          styles={{
            flexContainer: {
              display: "flex",
              justifyContent: "center",
              gap: 14
            }
          }}
        />

        <PrimaryButton
          text="Find Equipment"
          onClick={findEquipment}
          styles={{
            root: {
              width: "100%",
              marginTop: 12,
              background: "#315f32",
              borderColor: "#315f32",
              fontSize: 18,
              fontWeight: 600
            }
          }}
        />

        <div style={equipmentHeaderStyle}>Equipment Returned</div>

        {status && (
          <div style={{ textAlign: "center", fontSize: 12, marginTop: 8 }}>
            {status}
          </div>
        )}

        <div style={equipmentListStyle}>
          {equipmentList.map((item) => (
            <div key={item.id} style={equipmentRowStyle}>
              <div style={{ fontWeight: 600 }}>{item.name}</div>
              <div style={{ fontSize: 12 }}>{item.description}</div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", fontSize: 12, marginTop: 8 }}>
          {equipmentList.length} Results Found
        </div>
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

const mapContainerStyle: React.CSSProperties = {
  position: "relative",
  height: 260,
  border: "1px solid #aaa",
  overflow: "hidden",
  background: "#d9d9d9"
};

const mapPinStyle: React.CSSProperties = {
  position: "absolute",
  top: "45%",
  left: "48%",
  fontSize: 26
};

const equipmentHeaderStyle: React.CSSProperties = {
  marginTop: 14,
  padding: 10,
  textAlign: "center",
  fontSize: 20,
  fontWeight: 600,
  background: "#f3f2f1",
  border: "1px solid #ddd"
};

const equipmentListStyle: React.CSSProperties = {
  maxHeight: 220,
  overflowY: "auto",
  marginTop: 8
};

const equipmentRowStyle: React.CSSProperties = {
  padding: 10,
  borderBottom: "1px solid #ddd",
  background: "#fff"
};