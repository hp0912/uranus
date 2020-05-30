import hljs from "highlight.js";
import "highlight.js/styles/vs2015.css";
import MarkdownIt from "markdown-it";
import React, { FC } from 'react';
import { Advertisement01 } from '../../components/Advertisement/Advertisement01';
import { ArticleDetail } from '../../components/ArticleDetail';
import { Content } from "../../components/Content";
import { Header } from '../../components/Header';
import Tocify from "../../components/Tocify";
import { UranusAvatar } from '../../components/UranusAvatar';
import { UranusMotto } from '../../components/UranusMotto';
import { MdHeadingAnchor } from "../../utils/MdHeadingAnchor";

const markdown = `

# 1. Terminology

# 2. Requirements

\`\`\`ts
const a: number = 1;
console.log(a);
\`\`\`

## 2.1. Promise States

'123'

"456"

<code class="uranus-keyword">typescript</code><code class="uranus-keyword">react-hooks</code>学不动了吧~~~

\`\`\`typescript
const a: number = 1;
console.log(a);
\`\`\`

\`\`\`text
typescript
\`\`\`

\`\`\`text
react-hooks
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

## 2.2. Promise States2

# 3. react-hooks

111

111

111


1111

111

111

# 4. react-hooks

22

22

2222


222

222

222


222


222

# 5. react-hooks

66666

666666


666666

## 5.1. typescript

# 6. react-hooks

5555555

# 7. react-hooks

77777

77777


7777

# 8. react-hooks

8888


8888


88

\`\`\`html
<div>
  <span>
    xxxxxx
  </span>
</div>
\`\`\`
`;

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  langPrefix: 'uranus-article-code hljs ',
  highlight: (code, lang) => {
    if (lang && hljs.getLanguage(lang)) {
      return hljs.highlight(lang, code).value;
    }
    return hljs.highlightAuto(code).value;
  }
});

export const ArticleDetailPage: FC = (props) => {

  const tocify = new Tocify();
  
  md.use(MdHeadingAnchor, { tocify });
  
  const html = md.render(markdown);

  return (
    <>
      <Header />
      <Content
        left={(
          <>
            <UranusAvatar />
            <Advertisement01 />
          </>
        )}
        right={(
          <>
            <UranusMotto />
            { tocify && tocify.render() }
          </>
        )}
      >
        <ArticleDetail html={html} />
      </Content>
    </>
  );
};
