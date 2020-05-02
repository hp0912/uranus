import React from "react";
import AboutUs from "./AboutUs";
import { ArticleDetailPage } from "./ArticleDetail";
import { ArticleListPage } from "./ArticleList";
import Banner from "./Banner";

export default {
  Home: Banner,
  ArticleList: ArticleListPage,
  ArticleDetail: ArticleDetailPage,
  AboutUs: React.lazy<typeof AboutUs>(() => import('./AboutUs')),
};