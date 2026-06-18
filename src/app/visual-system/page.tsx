"use client";
import React from "react";

import Banner from "./_components/Banner";
import SectionOne from "./_components/SectionOne";
import SectionTwo from "./_components/SectionTwo";
import SectionThree from "./_components/SectionThree";
import SectionFour from "./_components/SectionFour";
import SectionFive from "./_components/SectionFive";
import SectionSix from "./_components/SectionSix";
import CardStackScroll from "./_components/CardStackScroll";

export default function VisualSystemPage() {
  return (
    <>
      <Banner />
      <CardStackScroll>
        <SectionOne />
        <SectionTwo />
        <SectionThree />
        <SectionFour />
        <SectionFive />
        <SectionSix />
      </CardStackScroll>
    </>
  );
}
