"use client";
import React from "react";
import Image from "next/image";

import Chip from "./Chip";

export default function Head() {
  return (
    <div className="flex items-center gap-10">
      <div>
        <Image
          width={100}
          height={24}
          alt="eurail-logo"
          src="/images/eu-rail-blue.svg"
        />
      </div>
      <div className="flex items-center gap-3">
        <Chip text="VISUAL SYSTEM" />
        <Chip text="INTRODUCTION" isActive />
        <Chip text="BASKETS" />
      </div>
    </div>
  );
}
