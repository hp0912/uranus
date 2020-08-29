export const css = `
/*大家好，我是吼吼，一名前端工程师。
请允许我做一个简单的自我介绍，但是纯文字太单调，所以我想来点特别的。
首先我准备一下样式。*/
#uranus-about-us-container * {
  transition: all .5s;
}
/*白色伤眼睛，来点暗色系的背景吧！*/
#uranus-about-us-container {
  background: #333034;
}
/*让我们给它加一个边框吧*/
#uranus-about-us-code {
  border: 2px solid #00FF1B;
  padding: 20px;
}
/*代码看不清楚？来点高亮吧！*/
#uranus-about-us-container .token.selector {
  color: #a6e22e;
}
#uranus-about-us-container .token.property {
  color: #f92672;
}
#uranus-about-us-container .token.punctuation {
  color: #f8f8f2;
}
#uranus-about-us-container .token.function {
  color: red;
}
#uranus-about-us-code {
  color: #f8f8f2;
}
/*来点动画吧*/
#uranus-about-us-code {
  animation: breath 4s linear infinite;
}
/*现在开始写简历吧*/
/*首先我需要一张纸*/
`;

export const html = `
#uranus-about-us-code {
  display: inline-block;
  position: fixed;
  right: 0;
  width: 50%;
  height: 80%;
  margin-right: 20px;
}
#uranus-resume {
  position: fixed;
  left: 0;
  width: 45%;
  height: 80%;
  background: linear-gradient(to bottom, #f4f39e, #f5da41); 
  padding: 20px;
  margin-left: 20px;
  box-shadow: 0 2px 10px 1px rgba(0, 0, 0, 0.8);
  box-shadow: 0 2px 10px 1px rgba(0, 0, 0, 0.8);
  text-shadow: 0 1px 0 #F6EF97;
  margin-top: 30%;
}
/*掉下去了！怎么办？*/
/*没关系，再用胶带粘住它*/
#uranus-resume:after {
  width: 25%;
  height: 5%;
  content: " ";
  margin-left: -90px;
  border: 1px solid rgba(200, 200, 200, .8);
  background: rgba(254, 254, 254, .6);
  box-shadow: 0px 0 3px rgba(0, 0, 0, 0.1);
  transform: rotate(-5deg);
  position: absolute;
  left: 50%;
  top:-15px;
}
#uranus-resume {
  margin-top: 0;
}
`;

export const markdown = `
# 简历
## 基本资料
**姓名：吼吼**
**年龄：8**
**坐标：深圳**
**QQ: 809211365**
**微信：houhouXXOO**
**微博：https://weibo.com/u/2573399657/**
**Github: https://github.com/hp0912**
## 技能介绍
1 HTML/5
2 CSS/3
3 JavaScript/jQuery
4 React
5 Vue
6 Webpack
7 Node.js
8 C#
9 GO
10 MongoDB
11 MySQL
12 Docker
`;

export const tomarkdown = `
/*这样看起来很不舒服？让我们把markdown转换成更易读的显示方式吧*/
`;

export const conclusion = `
/*好了，这个就是我的初步简历了。如果您想要更多了解的话，请通过谷歌邮箱联系我哦*/
`;