import React from "react";
import AboutUs from "../components/AboutUs";

export default function AboutUsFunc() {
  return <AboutUs />;
};

export async function getStaticProps() {
  return {
    props: {
      userState: null,
    }
  };
}
