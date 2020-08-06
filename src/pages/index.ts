import React from "react";
import NoMatch from "./404/NoMatch";
import AboutUs from "./AboutUs";
import Admin from "./Admin";
import { ArticleDetailPage } from "./ArticleDetail";
import { ArticleListPage } from "./ArticleList";
import Banner from "./Banner";
import MessageBoard from "./MessageBoard";
import { ThirdPartyOAuth } from "./ThirdPartyOAuth";
import UserSettings from "./User/Settings";

export default {
  Home: Banner,
  ArticleList: ArticleListPage,
  ArticleDetail: ArticleDetailPage,
  UserSettings,
  ThirdPartyOAuth,
  MessageBoard: React.lazy<typeof MessageBoard>(() => import('./MessageBoard')),
  AboutUs: React.lazy<typeof AboutUs>(() => import('./AboutUs')),
  Admin: React.lazy<typeof Admin>(() => import('./Admin')),
  NoMatch: React.lazy<typeof NoMatch>(() => import('./404/NoMatch')),
};