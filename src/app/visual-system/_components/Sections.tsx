import React from "react";
import classNames from "classnames";

import Head from "./Head";

interface SectionsProps {
  children: React.ReactNode;
  style?: { container?: string; children?: string };
}

export default function Sections({ children, style }: SectionsProps) {
  return (
    <div
      className={classNames("h-screen bg-white py-10 px-14", style?.container)}
    >
      <Head />
      <div className={style?.children}>{children}</div>
    </div>
  );
}
