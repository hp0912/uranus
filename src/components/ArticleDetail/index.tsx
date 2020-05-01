import { Breadcrumb } from "antd";
import hljs from "highlight.js";
import "highlight.js/styles/vs2015.css";
import marked from "marked";
import React, { FC } from "react";
import "./articleDetail.css";

const markdown = `
\`\`\`ts
const a: number = 1;
console.log(a);
\`\`\`

\`\`\`typescript
const a: number = 1;
console.log(a);
\`\`\`

\`\`\`
const a: number = 1;
console.log(a);
\`\`\`

\`\`\`css
.avv {
  background-color: red;
  padding: 0;
}
#app {
  color: #ffff;
}
\`\`\`

\`\`\`html
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
    highlight: (code, lang) => {
      if (lang) {
        return hljs.highlight(lang, code).value;
      }
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
        <div dangerouslySetInnerHTML={{ __html: html }} className="uranus-article-code hljs" style={{ margin: 5 }} />
      </div>
    </div>
  );
};