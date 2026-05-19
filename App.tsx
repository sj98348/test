import * as React from "react";
import { useEffect, useState } from "react";
import { IInputs } from "./generated/ManifestTypes";
import { MainLayout } from "./components/layout/MainLayout";
import { AccessTab } from "./components/tabs/AccessTab";
import { EquipmentSortTab } from "./components/tabs/EquipmentSortTab";
import { FunctionalLocationTab } from "./components/tabs/FunctionalLocationTab";
import { GeoLocationTab } from "./components/tabs/GeoLocationTab";
import { LocationTab } from "./components/tabs/LocationTab";
import { GoTab } from "./components/tabs/GoTab";
import { SelectedLocation } from "./models/LocationModels";
import { UserPrimaryFlocService } from "./services/dataverse/UserPrimaryFlocService";

export interface AppProps {
  context: ComponentFramework.Context<IInputs>;
  dataset: ComponentFramework.PropertyTypes.DataSet;
  width: number;
  height: number;
 }
export type ScreenKey =
  | "loading"
  | "go"
  | "access"
  | "equipmentSort"
  | "functionalLocation"
  | "geoLocation"
  | "location";

export const App = ({ context, dataset, width, height }: AppProps) => {
  const [activeScreen, setActiveScreen] = useState<ScreenKey>("loading");

  const [selectedLocation, setSelectedLocation] = useState<SelectedLocation>({
    id: "",
    name: "Set Location",
    bu: "",
    flocCode: ""
  });

  useEffect(() => {
    const initializeUserLocation = async () => {
      try {
        const flocCode =
          await UserPrimaryFlocService.getUserPrimaryFlocCode(context);

        if (flocCode) {
          setSelectedLocation({
            id: "",
            name: `FLOC ${flocCode}`,
            bu: "",
            flocCode
          });

          setActiveScreen("access");
        } else {
          setActiveScreen("go");
        }
      } catch {
        setActiveScreen("go");
      }
    };

    initializeUserLocation();
  }, [context]);
  const getEnvironmentName = (): string => {
  const hostName = window.location.hostname;

  return hostName.split(".")[0];
 };
  const environmentName = getEnvironmentName();
  const renderScreen = () => {
    switch (activeScreen) {
      case "loading":
        return <div style={{ padding: 30, textAlign: "center" }}>Checking user location...</div>;

      case "go":
        return <GoTab onGo={() => setActiveScreen("location")} />;

      case "equipmentSort":
        return <EquipmentSortTab
        context={context}
        selectedLocation={selectedLocation}
        onBack={() => setActiveScreen("access")}
        onHome={() => setActiveScreen("access")}
        />;

      case "functionalLocation":
        return <FunctionalLocationTab
         onBack={() => setActiveScreen("access")}
         onHome={() => setActiveScreen("access")}/>;

      case "geoLocation":
        return (
          <GeoLocationTab
          context={context}
          dataset={dataset}
          selectedLocation={selectedLocation}
          onBack={() => setActiveScreen("access")}
         />
        );

      case "location":
        return (
          <LocationTab
  context={context}
  selectedLocation={selectedLocation}

  onLocationConfirmed={(location) => {
    setSelectedLocation(location);
    setActiveScreen("access");
  }}

  onHome={() => setActiveScreen("access")}
/>
        );

      default:
      
        return (
          <AccessTab
            environmentName={environmentName}
            selectedLocation={selectedLocation}
            onGeoLocation={() => setActiveScreen("geoLocation")}
            onEquipmentSort={() => setActiveScreen("equipmentSort")}
            onFunctionalLocation={() => setActiveScreen("functionalLocation")}
            onChangeLocation={() => setActiveScreen("location")}
          />
        );
    }
  };

  return (
  <MainLayout width={width} height={height}>
    {renderScreen()}
  </MainLayout>
);
};