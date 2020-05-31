import { Affix, Breadcrumb, Button, Col, Input, Row, Select } from 'antd';
import MarkdownIt from "markdown-it";
import React, { FC, useCallback } from 'react';
import MdEditor from 'react-markdown-editor-lite';
import { HtmlType } from 'react-markdown-editor-lite/editor/preview';
import { ArticleTagSelect } from './ArticleTagSelect';
import { CoverUpload } from './CoverUpload';

// 图标
import { SaveOutlined } from '@ant-design/icons';

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
import 'react-markdown-editor-lite/lib/index.css';

const css = {
  MdEditor: { height: "500px" },
};

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

md.use(emoji).use(mark).use(ins).use(abbr).use(footnote).use(sup).use(sub).use(mdcontainer, 'uranus-warning');

md.renderer.rules.emoji = (token, idx) => {
  return twemoji.parse(token[idx].content);
};

const { TextArea } = Input;

export const AdminArticleAdd: FC = (props) => {
  const onArticleTagChange = useCallback((v1) => {
    console.log(v1);
  }, []);

  const onDescChange = useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
    // xxx
  }, []);

  const renderHTML = useCallback<(text: string) => HtmlType | Promise<HtmlType> | (() => HtmlType)>((text) => {
    return md.render(text);
  }, []);

  const onEditorChange = useCallback((data: {
    text: string;
    html: string;
  }, event?: React.ChangeEvent<HTMLTextAreaElement>) => {
    console.log(data.text);
  }, []);

  const onSaveClick = useCallback(() => {
    // xxx
  }, []);

  return (
    <>
      <Breadcrumb className="uranus-admin-breadcrumb">
        <Breadcrumb.Item>编辑文章</Breadcrumb.Item>
      </Breadcrumb>
      <div style={{ padding: 5, minHeight: 360, background: "#fff" }}>
        <Row>
          <Col span={24}>
            <Input placeholder="文章标题" />
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <CoverUpload />
          </Col>
        </Row>
        <Row className="uranus-row">
          <Col span={24}>
            <ArticleTagSelect
              tagOptions={[]}
              onChange={onArticleTagChange}
            />
          </Col>
        </Row>
        <Row className="uranus-row">
          <Col span={24}>
            <Select placeholder="文章可见范围" className="uranus-row-select">
              <Select.Option value={0}>
                仅自己可见
              </Select.Option>
              <Select.Option value={1}>
                所有人可见
              </Select.Option>
            </Select>
          </Col>
        </Row>
        <Row className="uranus-row">
          <Col span={24}>
            <TextArea
              value={""}
              onChange={onDescChange}
              placeholder="文章描述，支持markdown"
              autoSize={{ minRows: 3, maxRows: 5 }}
            />
          </Col>
        </Row>
        <Row className="uranus-row">
          <Col span={24}>
            <MdEditor
              value=""
              style={css.MdEditor}
              renderHTML={renderHTML}
              onChange={onEditorChange}
            />
          </Col>
        </Row>
        <Row className="uranus-row">
          <Col span={24} className="save">
            <Affix offsetBottom={5}>
              <Button
                size="large"
                type="primary"
                icon={<SaveOutlined />}
                loading={false}
                onClick={onSaveClick}
              >
                保存
              </Button>
            </Affix>
          </Col>
        </Row>
      </div>
    </>
  );
};