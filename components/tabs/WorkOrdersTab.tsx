import * as React from "react";

interface Props {
  dataset: ComponentFramework.PropertyTypes.DataSet;
}

export const WorkOrdersTab = ({ dataset }: Props) => {
  const recordIds = dataset?.sortedRecordIds || [];

  return (
    <div>
      <h3>Work Orders</h3>

      {recordIds.length === 0 && <p>No records loaded.</p>}

      {recordIds.map((id) => {
        const record = dataset.records[id];

        return (
          <div
            key={id}
            style={{
              padding: 12,
              marginBottom: 10,
              border: "1px solid #ddd",
              borderRadius: 8,
              background: "#fff"
            }}
          >
            <strong>{record.getFormattedValue("msdyn_name") || id}</strong>
            <div>{record.getFormattedValue("createdon")}</div>
          </div>
        );
      })}
    </div>
  );
};