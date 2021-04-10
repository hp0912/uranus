import MarkdownIt from 'markdown-it';
import StateCore from 'markdown-it/lib/rules_core/state_core';
import Tocify from '../components/Tocify';

function makeRule(mdit: MarkdownIt, options: { tocify: { current: Tocify } }) {
  return (state: StateCore) => {
    options.tocify.current = new Tocify();

    for (let i = 0; i < state.tokens.length - 1; i++) {
      if (state.tokens[i].type !== 'heading_open' || state.tokens[i + 1].type !== 'inline') {
        continue;
      }

      const headingInlineToken = state.tokens[i + 1];

      if (!headingInlineToken.content) {
        continue;
      }

      if (headingInlineToken.children) {
        const text = headingInlineToken.children[0].content;
        const level = Number(state.tokens[i].tag.replace(/\D+/, ''));

        let anchorText = '';
        headingInlineToken.children.forEach(item => {
          if (item.type === 'text') {
            anchorText += item.content;
          }
        });

        const anchor = options.tocify.current.add(anchorText, level);
        const anchorToken = new state.Token('html_inline', '', 0);

        anchorToken.content = `<a id="${anchor}" style="color: #000" href="#${anchor}">${text}</a>\n`;

        const first = headingInlineToken.children[0];
        if (first.type === 'text') {
          headingInlineToken.children[0] = anchorToken;
        } else {
          headingInlineToken.children.unshift(anchorToken);
        }
      }

      // Advance past the inline and heading_close tokens.
      i += 2;
    }

    return true;
  };
}

export const MdHeadingAnchor = (mdit: MarkdownIt, options: { tocify: { current: Tocify } }) => {
  mdit.core.ruler.push('heading_anchor', makeRule(mdit, options));
};