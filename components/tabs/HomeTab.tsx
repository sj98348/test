import * as React from "react";

interface Props {
  dataset: ComponentFramework.PropertyTypes.DataSet;
}

export const HomeTab = ({ dataset }: Props) => {
  const count = dataset?.sortedRecordIds?.length || 0;

  return (
    <div>
      <h3>Home</h3>
      <p>Welcome to Field Service Mobile PCF.</p>
      <p>Loaded records: {count}</p>
    </div>
  );
};