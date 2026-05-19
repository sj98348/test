import * as React from "react";
import { useEffect, useState } from "react";
import {
  DefaultButton,
  PrimaryButton,
  TextField,
  Spinner
} from "@fluentui/react";
import { IInputs } from "../../generated/ManifestTypes";
import { EquipmentItem } from "../../models/EquipmentModels";
import { EquipmentService } from "../../services/dataverse/EquipmentService";
import { SelectedLocation } from "../../models/LocationModels";

interface Props {
  context: ComponentFramework.Context<IInputs>;
  selectedLocation: SelectedLocation;
  onBack: () => void;
  onHome: () => void;
}

export const EquipmentSortTab = ({
  context,
  selectedLocation,
  onBack,
  onHome
}: Props) => {
  const [searchText, setSearchText] = useState("");
  const [quickFilter, setQuickFilter] = useState("");
  const [allEquipment, setAllEquipment] = useState<EquipmentItem[]>([]);
  const [results, setResults] = useState<EquipmentItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const loadEquipment = async () => {
      try {
        setIsLoading(true);
        setStatus("Loading equipment...");

        const equipment = await EquipmentService.getAllEquipment(context);

        setAllEquipment(equipment);
        setStatus("");
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        setStatus(`Error loading equipment: ${message}`);
      } finally {
        setIsLoading(false);
      }
    };

    loadEquipment();
  }, [context]);

  const searchEquipment = () => {
    if (searchText.trim().length < 3) {
      setStatus("Please enter at least 3 characters.");
      setResults([]);
      return;
    }

    const searchResults = EquipmentService.searchEquipment(
      allEquipment,
      searchText,
      selectedLocation.flocCode
    );

    setResults(searchResults);

    if (searchResults.length === 0) {
      setStatus("No matching equipment found.");
    } else if (searchResults.length >= 2000) {
      setStatus("Search returned maximum rows. Please refine your search.");
    } else {
      setStatus("");
    }
  };

  const visibleResults = results.filter((item) => {
    const filter = quickFilter.trim().toLowerCase();

    if (!filter) {
      return true;
    }

    return (
      item.equipmentNumber.toLowerCase().includes(filter) ||
      item.description.toLowerCase().includes(filter) ||
      item.functionalLocationName.toLowerCase().includes(filter)
    );
  });

  return (
    <div>
      <div style={headerStyle}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 600 }}>
            Equipment SORT
          </div>

          <div style={{ fontSize: 13 }}>
            {selectedLocation.name || "Location Not Selected"}
          </div>
        </div>

        <button style={homeButtonStyle} onClick={onHome} title="Home">
          ⌂
        </button>
      </div>

      <div style={{ padding: 16 }}>
        <div style={{ textAlign: "center" }}>
          <h3>Enter Equipment SORT Field</h3>

          <div style={{ fontSize: 12 }}>
            Starts with 3 Character Minimum
          </div>
        </div>

        <TextField
          placeholder="Enter SORT field"
          value={searchText}
          onChange={(_, value) => setSearchText(value || "")}
          styles={{ root: { marginTop: 18 } }}
        />

        <PrimaryButton
          text="Search"
          disabled={searchText.trim().length < 3 || isLoading}
          onClick={searchEquipment}
          styles={{
            root: {
              width: "100%",
              marginTop: 18,
              background:
                searchText.trim().length >= 3 ? "#315f32" : "#d0d0d0",
              borderColor:
                searchText.trim().length >= 3 ? "#315f32" : "#d0d0d0"
            },
            rootDisabled: {
              background: "#d0d0d0",
              borderColor: "#d0d0d0",
              color: "#fff"
            }
          }}
        />

        {isLoading && (
          <div style={{ marginTop: 12 }}>
            <Spinner label="Loading equipment..." />
          </div>
        )}

        {status && (
          <div style={{ marginTop: 12, fontSize: 12, textAlign: "center" }}>
            {status}
          </div>
        )}

        <TextField
          placeholder="Quick filter results"
          value={quickFilter}
          onChange={(_, value) => setQuickFilter(value || "")}
          styles={{ root: { marginTop: 16 } }}
        />

        <div style={resultCountStyle}>
          {visibleResults.length} Results Found
        </div>

        <div style={resultListStyle}>
          {visibleResults.map((item) => (
            <div
              key={item.id}
              style={resultRowStyle}
              onClick={() => {
                console.log("Selected equipment", item);
              }}
            >
              


              <div style={{ fontSize: 12 }}>
                {item.description}
              </div>

              <div style={{ fontSize: 12 }}>
                FLOC: {item.functionalLocationName}
              </div>

              <div style={{ fontSize: 12 }}>
                SORT: {item.sortField} {item.sortName}
              </div>
            </div>
          ))}
        </div>

        <DefaultButton
          text="Back"
          onClick={onBack}
          styles={{ root: { width: "100%", marginTop: 16 } }}
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

const resultCountStyle: React.CSSProperties = {
  textAlign: "center",
  fontSize: 12,
  marginTop: 12
};

const resultListStyle: React.CSSProperties = {
  marginTop: 12,
  maxHeight: 360,
  overflowY: "auto"
};

const resultRowStyle: React.CSSProperties = {
  padding: 10,
  marginBottom: 8,
  background: "#f7f7f7",
  border: "1px solid #ddd",
  cursor: "pointer"
};