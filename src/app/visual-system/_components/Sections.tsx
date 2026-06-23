import React from "react";
import classNames from "classnames";

import Head from "./Head";
import { BOOKMARKS, type BookmarkGroup } from "./bookmarks";

interface SectionsProps {
  children: React.ReactNode;
  style?: { container?: string; children?: string };
  /** Which bookmark chip set to show in the Head. */
  group?: BookmarkGroup;
  /** Drop the Head entirely (e.g. the Index slide). */
  hideHead?: boolean;
}

export default function Sections({
  children,
  style,
  group = "visual",
  hideHead = false,
}: SectionsProps) {
  return (
    <div
      className={classNames("h-screen bg-white py-10 px-14", style?.container)}
    >
      {!hideHead && <Head chips={BOOKMARKS[group]} />}
      <div className={style?.children}>{children}</div>
    </div>
  );
}
