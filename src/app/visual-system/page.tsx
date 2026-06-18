"use client";
import React from "react";
import Banner from "./_components/Banner";
import CardStackScroll from "./_components/CardStackScroll";
import SectionOne from "./_components/SectionOne";
import SectionTwo from "./_components/SectionTwo";
import SectionThree from "./_components/SectionThree";

export default function VisualSystemPage() {
  return (
    <>
      <Banner />

      <CardStackScroll>
        <SectionOne />
        <SectionTwo />
        <SectionThree />
      </CardStackScroll>
    </>
  );
}
