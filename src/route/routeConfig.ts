interface IRouteConfig {
  title: string;
  path: string;
  component: string;
}

export const routeConfig: IRouteConfig[] = [
  { title: '吼吼', path: '/', component: 'Home' },
  { title: '博客列表', path: '/articlelist', component: 'ArticleList' },
  { title: '博客详情', path: '/articledetail', component: 'ArticleDetail' },
  { title: '关于我们', path: '/aboutus', component: 'AboutUs' },
];