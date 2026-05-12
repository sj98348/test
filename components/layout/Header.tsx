import * as React from "react";

interface Props {
  title: string;
}

export const Header = ({ title }: Props) => {
  return (
    <div
      style={{
        padding: "12px 16px",
        fontSize: 18,
        fontWeight: 600,
        borderBottom: "1px solid #e1e1e1",
        background: "#ffffff"
      }}
    >
      {title}
    </div>
  );
};