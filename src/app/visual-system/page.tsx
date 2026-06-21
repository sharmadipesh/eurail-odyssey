"use client";
import React from "react";

import Banner from "./_components/Banner";
import SectionOne from "./_components/SectionOne";
import SectionTwo from "./_components/SectionTwo";
import SectionThree from "./_components/SectionThree";
import SectionFour from "./_components/SectionFour";
import SectionFive from "./_components/SectionFive";
import SectionSix from "./_components/SectionSix";
import SectionSeven from "./_components/SectionSeven";
import SectionEight from "./_components/SectionEight";
import SectionNine from "./_components/SectionNine";
import SectionTen from "./_components/SectionTen";
import Section12 from "./_components/Section12";
import Section14 from "./_components/Section14";
import Section16 from "./_components/Section16";
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
        <SectionSeven />
        <SectionEight />
        <SectionNine />
        <SectionTen />
        <Section12 />
        <Section14 />
        <Section16 />
      </CardStackScroll>
    </>
  );
}
