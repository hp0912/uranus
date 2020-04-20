import { Breadcrumb } from "antd";
import hljs from "highlight.js";
import "highlight.js/styles/github.css";
import marked from "marked";
import React, { FC } from "react";

const markdown = `
\`\`\`
const a: number = 1;
console.log(a);
\`\`\`

\`\`\`
.avv {
  background-color: red;
  padding: 0;
}
#app {
  color: #ffff;
}
\`\`\`

\`\`\`
<div>
  <span>
    xxxxxx
  </span>
</div>
\`\`\`
`;

export const ArticleDetail: FC = (props) => {

  const renderer = new marked.Renderer();

  marked.setOptions({
    renderer,
    gfm: true,
    pedantic: false,
    sanitize: false,
    breaks: false,
    smartLists: true,
    smartypants: false,
    highlight: (code) => {
      return hljs.highlightAuto(code).value;
    }
  });

  const html = marked(markdown);

  return (
    <div>
      <div>
        <Breadcrumb>
          <Breadcrumb.Item>
            <a href="/">首页</a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            霸道总裁
          </Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <div>
        <div>
          霸道总裁之总裁夫人手撕小三
        </div>
        <div>
          --吼吼 2020-04-20 22:31
        </div>
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </div>
  );
};