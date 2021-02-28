import React from "react";
import Head from 'next/head';
import { Header } from "../components/Header";
import { Banner } from "../components/Banner";

export default (props) => {
  return (
    <>
      <Head>
        <title>吼吼的博客</title>
      </Head>
      <Header />
      <Banner />
    </>
  );
};

export async function getStaticProps() {
  return {
    props: {
      userState: null,
    }
  };
}
