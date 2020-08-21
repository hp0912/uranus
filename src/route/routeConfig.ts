interface IRouteConfig {
  title: string;
  path: string;
  exact: boolean;
  component: string;
}

export const routeConfig: IRouteConfig[] = [
  { title: '吼吼', path: '/', exact: true, component: 'Home' },
  { title: '前端优选', path: '/frontend', exact: true, component: 'FrontendPage' },
  { title: '神秘空间', path: '/gossip', exact: true, component: 'GossipPage' },
  { title: '博客详情', path: '/article/:articleId', exact: true, component: 'ArticleDetail' },
  { title: '第三方授权登录', path: '/:thirdParty/oauth/authorize', exact: true, component: 'ThirdPartyOAuth' },
  { title: '留言板', path: '/messageboard', exact: true, component: 'MessageBoard' },
  { title: '关于我们', path: '/aboutus', exact: true, component: 'AboutUs' },
  { title: '个人设置', path: '/user/settings', exact: true, component: 'UserSettings' },
  { title: '后台管理', path: '/admin', exact: false, component: 'Admin' },
  { title: '404', path: '*', exact: true, component: 'NoMatch' },
];