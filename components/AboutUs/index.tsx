import MarkdownIt from 'markdown-it';
import Prism from 'prismjs';
import React, { FC, useEffect, useMemo } from 'react';
import { Header } from '../../components/Header';
import { conclusion, css, html, markdown, tomarkdown } from './code';
import './plugin';

// 样式
import 'prismjs/themes/prism.css';

const speed = 50;

const AboutUs: FC = () => {
  const boxRef = React.createRef<HTMLDivElement>();
  const styleRef = React.createRef<HTMLStyleElement>();
  const codeRef = React.createRef<HTMLPreElement>();

  const md = useMemo<MarkdownIt>(() => {
    return new MarkdownIt({
      html: true,
      linkify: true,
      typographer: true,
    });
  }, []);

  useEffect(() => {
    let cssTimer = 0;
    let markdownTimer = 0;

    function writeCode(prefix: string, code: string): Promise<void> {
      return new Promise((resolve) => {
        let n = 0;
        cssTimer = window.setInterval(() => {
          if (codeRef.current && styleRef.current && boxRef.current) {
            n += 1;
            codeRef.current.innerHTML = Prism.highlight(prefix + code.substring(0, n), Prism.languages.css);
            styleRef.current.innerHTML = prefix + code.substring(0, n);
            codeRef.current.scrollIntoView({ behavior: 'auto', block: 'end', inline: 'nearest' });
            if (n >= code.length) {
              window.clearInterval(cssTimer);
              return resolve();
            }
          }
        }, speed);
      });
    }

    function createResume(): Promise<void> {
      return new Promise((resolve) => {
        const resume = document.createElement('pre');
        resume.id = 'uranus-resume';
        boxRef.current!.appendChild(resume);
        return resolve();
      });
    }

    function writeMarkdown(mdStr: string): Promise<void> {
      return new Promise((resolve) => {
        const domResume = document.querySelector('#uranus-resume');
        let n = 0;
        markdownTimer = window.setInterval(() => {
          n += 1;
          domResume!.innerHTML = Prism.highlight(mdStr.substring(0, n), Prism.languages.markdown);
          domResume!.scrollIntoView({ behavior: 'auto', block: 'end', inline: 'nearest' });
          if (n >= mdStr.length) {
            window.clearInterval(markdownTimer);
            return resolve();
          }
        }, speed);
      });
    }

    function markdown2Html(): Promise<void> {
      return new Promise((resolve) => {
        document.querySelector('#uranus-resume')!.innerHTML = md.render(markdown);
        return resolve();
      });
    }

    async function start() {
      await writeCode('', css);
      await createResume();
      await writeCode(css, html);
      await writeMarkdown(markdown);
      await writeCode(css + html, tomarkdown);
      await markdown2Html();
      await writeCode(css + html + tomarkdown, conclusion);
    }

    start();

    return () => {
      clearInterval(cssTimer);
      clearInterval(markdownTimer);
    };
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <Header />
      <div id="uranus_about_us_container">
        <div id="uranus_about_us_box" ref={boxRef}>
          <style id="uranusStyle" ref={styleRef} />
          <pre id="uranus_about_us_code" ref={codeRef} />
        </div>
      </div>
    </>
  );
};

export default AboutUs;