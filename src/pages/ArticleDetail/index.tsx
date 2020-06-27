import MarkdownIt from "markdown-it";
import React, { /* FC */ } from 'react';
import { Advertisement01 } from '../../components/Advertisement/Advertisement01';
import { ArticleDetail } from '../../components/ArticleDetail';
import { Content } from "../../components/Content";
import { Header } from '../../components/Header';
import Tocify from "../../components/Tocify";
import { UranusAvatar } from '../../components/UranusAvatar';
import { UranusMotto } from '../../components/UranusMotto';
import { MdHeadingAnchor } from "../../utils/MdHeadingAnchor";

// markdown 插件
import hljs from "highlight.js";
import abbr from 'markdown-it-abbr';
import mdcontainer from 'markdown-it-container';
import emoji from 'markdown-it-emoji';
import footnote from 'markdown-it-footnote';
import ins from 'markdown-it-ins';
import mark from 'markdown-it-mark';
import sub from 'markdown-it-sub';
import sup from 'markdown-it-sup';
import twemoji from 'twemoji';

// css
import "highlight.js/styles/vs2015.css";

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

\`123456789\`

1111

111

111

# 4. react-hooks ==学不动了么 Vue3== 

22

22

2222


222

==学不动了么 Vue3==

222

222


222


222

# 5. ==学不动了么 Vue3==

66666

666666


666666

## 5.1. typescript

> Classic markup: :wink: :crush: :cry: :tear: :laughing: :yum:
>
> Shortcuts (emoticons): :-) :-( 8-) ;)

# 6. react-hooks

5555555

😊😊

# 7. react-hooks

77777

77777

++inserted++

7777

# 8. react-hooks

8888


[Abbreviations](https://github.com/markdown-it/markdown-it-abbr)

This is HTML abbreviation example.

It converts "HTML", but keep intact partial entries like "xxxHTMLyyy" and so on.

*[HTML]: Hyper Text Markup Language


88

[Footnotes](https://github.com/markdown-it/markdown-it-footnote)

Footnote 1 link[^first].

Footnote 2 link[^second].

Inline footnote^[Text of inline footnote] definition.

Duplicated footnote reference[^second].

[^first]: Footnote **can have markup** and multiple paragraphs.

[^second]: Footnote text.

- 29^th^
- H~2~O

[Abbreviations](https://github.com/markdown-it/markdown-it-abbr)

This is HTML abbreviation example.

It converts "HTML", but keep intact partial entries like "xxxHTMLyyy" and so on.

*[HTML]: Hyper Text Markup Language

[Custom containers](https://github.com/markdown-it/markdown-it-container)

::: uranus-warning
*here be dragons*
:::

\`\`\`html
<div>
  <span>
    xxxxxx
  </span>
</div>
\`\`\`
`;

export class ArticleDetailPage extends React.PureComponent {
  md: MarkdownIt;
  tocify: { current?: Tocify } = {};

  constructor(props) {
    super(props);

    this.md = new MarkdownIt({
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
    })
      .use(emoji)
      .use(mark)
      .use(ins)
      .use(abbr)
      .use(footnote)
      .use(sup)
      .use(sub)
      .use(mdcontainer, 'uranus-warning')
      .use(MdHeadingAnchor, { tocify: this.tocify });

    this.md.renderer.rules.emoji = (token, idx) => {
      return twemoji.parse(token[idx].content);
    };
  }

  render() {
    const html = this.md.render(markdown);

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
              {this.tocify.current && this.tocify.current.render()}
            </>
          )}
        >
          <ArticleDetail html={html} />
        </Content>
      </>
    );
  }
}

