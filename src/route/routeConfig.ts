interface IRouteConfig {
  title: string;
  path: string;
  exact: boolean;
  component: string;
}

export const routeConfig: IRouteConfig[] = [
  { title: '吼吼', path: '/', exact: true, component: 'Home' },
  { title: '博客列表', path: '/articles', exact: true, component: 'ArticleList' },
  { title: '博客详情', path: '/article/:articleId', exact: true, component: 'ArticleDetail' },
  { title: '留言板', path: '/messageboard', exact: true, component: 'MessageBoard' },
  { title: '关于我们', path: '/aboutus', exact: true, component: 'AboutUs' },
  { title: '个人设置', path: '/user/settings', exact: true, component: 'UserSettings' },
  { title: '后台管理', path: '/admin', exact: false, component: 'Admin' },
  { title: '404', path: '*', exact: true, component: 'NoMatch' },
];