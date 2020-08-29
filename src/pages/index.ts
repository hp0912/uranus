import React from "react";
import NoMatch from "./404/NoMatch";
import AboutUs from "./AboutUs";
import Admin from "./Admin";
import { ArticleDetailPage } from "./ArticleDetail";
import ArticleEditPage from "./ArticleEdit";
import Banner from "./Banner";
import { FrontendPage } from "./Frontend";
import { GossipPage } from "./Gossip";
import MessageBoard from "./MessageBoard";
import { ThirdPartyOAuth } from "./ThirdPartyOAuth";
import UserHomePages from "./User/HomePages";
import UserSettings from "./User/Settings";

export default {
  Home: Banner,
  FrontendPage,
  GossipPage,
  ArticleDetail: ArticleDetailPage,
  UserSettings,
  UserHomePages,
  ThirdPartyOAuth,
  ArticleEditPage: React.lazy<typeof ArticleEditPage>(() => import('./ArticleEdit')),
  MessageBoard: React.lazy<typeof MessageBoard>(() => import('./MessageBoard')),
  AboutUs: React.lazy<typeof AboutUs>(() => import('./AboutUs')),
  Admin: React.lazy<typeof Admin>(() => import('./Admin')),
  NoMatch: React.lazy<typeof NoMatch>(() => import('./404/NoMatch')),
};