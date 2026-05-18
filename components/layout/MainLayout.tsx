import * as React from "react";

interface Props {
  width: number;
  height: number;
  children: React.ReactNode;
}

export const MainLayout = ({ width, height, children }: Props) => {
  const isMobile = width <= 600;
  const isTablet = width > 600 && width <= 1024;

  const contentWidth = isMobile ? "100%" : isTablet ? 720 : 980;

  return (
    <div
      style={{
        width: "100%",
        height: height > 0 ? height : "100vh",
        minHeight: isMobile ? 640 : 720,
        overflow: "hidden",
        display: "flex",
        justifyContent: "center",
        background: "#f3f2f1"
      }}
    >
      <div
        style={{
          width: contentWidth,
          maxWidth: "100%",
          height: "100%",
          overflowY: "auto",
          background: "#ffffff"
        }}
      >
        {children}
      </div>
    </div>
  );
};